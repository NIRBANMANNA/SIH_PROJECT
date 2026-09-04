"""
inference/wrf_loader.py
-----------------------
Loads the WRF 9 km NetCDF dataset once at module import and exposes a
single function ``load_wrf_patch`` that the FastAPI /predict endpoint can
call for every request.

Dataset facts (data/raw/wrf_9km/merged.nc):
  - variable : tp  (total precipitation, mm/day)
  - shape    : (366, 60, 60)  →  time × lat × lon
  - time     : 2020-01-01 … 2020-12-31  (full year, daily)
  - lat      : 6.5 → 38.5 °N  (60 steps, ~0.54° spacing ≈ 9 km)
  - lon      : 66.5 → 100.0 °E (60 steps)

Because the only available data is for 2020, any requested date is mapped
to the same month-day in 2020 (climatological analog approach).
"""
from __future__ import annotations

import logging
from pathlib import Path
from datetime import datetime, date as _date

import numpy as np
import xarray as xr

logger = logging.getLogger(__name__)

# ── Paths ────────────────────────────────────────────────────────────────────
_ROOT        = Path(__file__).resolve().parents[1]          # d:/arora_AI
_WRF_PATH    = _ROOT / "data" / "raw" / "wrf_9km" / "merged.nc"

# ── Constants ────────────────────────────────────────────────────────────────
_PATCH_SIZE  = 32     # ONNX model expects [1, 1, 32, 32]
_ANALOG_YEAR = 2020   # only year present in the dataset

# ── Module-level cache ───────────────────────────────────────────────────────
_ds:    xr.Dataset | None = None
_tp:    xr.DataArray | None = None
_mean:  float | None = None
_std:   float | None = None


def _load_once() -> None:
    """Open the WRF dataset and compute normalisation stats (called once)."""
    global _ds, _tp, _mean, _std

    if _tp is not None:
        return  # already loaded

    if not _WRF_PATH.exists():
        raise FileNotFoundError(
            f"WRF 9 km dataset not found at {_WRF_PATH}. "
            "Please ensure data/raw/wrf_9km/merged.nc exists."
        )

    logger.info("Loading WRF dataset from %s …", _WRF_PATH)
    _ds   = xr.open_dataset(str(_WRF_PATH))
    _tp   = _ds["tp"]                          # (366, 60, 60)

    # Normalisation stats over the whole dataset (excluding NaN)
    vals  = _tp.values
    valid = vals[~np.isnan(vals)]
    _mean = float(valid.mean())
    _std  = float(valid.std()) if valid.std() > 0 else 1.0
    logger.info(
        "WRF dataset loaded: shape=%s  mean=%.4f  std=%.4f",
        _tp.shape, _mean, _std,
    )


def _analog_date(requested: str) -> str:
    """
    Map any calendar date → same month-day in _ANALOG_YEAR.

    Example: "2026-07-15" → "2020-07-15"
    Feb 29 in a non-leap year is mapped to Feb 28.
    """
    try:
        d = datetime.strptime(requested, "%Y-%m-%d").date()
    except ValueError:
        d = _date.today()

    try:
        analog = _date(_ANALOG_YEAR, d.month, d.day)
    except ValueError:
        # Feb 29 requested for a non-leap year → use Feb 28
        analog = _date(_ANALOG_YEAR, d.month, 28)

    return analog.strftime("%Y-%m-%d")


def _center_crop(arr: np.ndarray, size: int) -> np.ndarray:
    """
    Crop a 2-D array to (size × size) from the spatial centre.
    If the array is smaller than size in any dimension, it is zero-padded.
    """
    h, w = arr.shape

    if h < size or w < size:
        # Pad first
        pad_h = max(0, size - h)
        pad_w = max(0, size - w)
        arr = np.pad(
            arr,
            ((pad_h // 2, pad_h - pad_h // 2),
             (pad_w // 2, pad_w - pad_w // 2)),
            mode="constant",
            constant_values=0.0,
        )
        h, w = arr.shape

    row_start = (h - size) // 2
    col_start = (w - size) // 2
    return arr[row_start : row_start + size, col_start : col_start + size]


# ── Public API ───────────────────────────────────────────────────────────────

def load_wrf_patch(date_str: str, patch_size: int = _PATCH_SIZE) -> np.ndarray:
    """
    Return a normalised WRF precipitation patch for the given date.

    Parameters
    ----------
    date_str   : ISO date string, e.g. ``"2026-09-04"``
    patch_size : spatial size of the square patch (default 32 to match ONNX)

    Returns
    -------
    np.ndarray of shape ``(1, 1, patch_size, patch_size)``, dtype float32,
    ready to pass directly to ``ort.InferenceSession.run``.
    """
    _load_once()

    analog = _analog_date(date_str)
    logger.debug("Requested %s → analog date %s", date_str, analog)

    # Select the time slice; fall back to nearest if exact match missing
    try:
        da = _tp.sel(time=analog)
    except KeyError:
        da = _tp.sel(time=analog, method="nearest")

    grid = da.values.astype(np.float64)           # (60, 60)
    grid = np.nan_to_num(grid, nan=0.0)            # replace NaN with 0

    patch = _center_crop(grid, patch_size)         # (32, 32)

    # Normalise  (z-score)
    patch = (patch - _mean) / (_std + 1e-8)

    # Shape expected by ONNX: [batch=1, channel=1, H, W]
    return patch[np.newaxis, np.newaxis, :, :].astype(np.float32)


def wrf_status() -> dict:
    """Return a small status dict for the /health endpoint."""
    try:
        _load_once()
        return {
            "loaded": True,
            "path": str(_WRF_PATH),
            "shape": list(_tp.shape),
            "mean": round(_mean, 4),
            "std": round(_std, 4),
            "time_range": [
                str(_tp.time.values[0])[:10],
                str(_tp.time.values[-1])[:10],
            ],
        }
    except Exception as exc:
        return {"loaded": False, "error": str(exc)}
