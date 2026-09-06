"""
prepare_dataset.py
------------------
Helper script to prepare meteorological NetCDF datasets for KisanDarpan AI.
Either converts downloaded real IMD gridded files into the required structure,
or generates synthetic surrogate datasets for quick local testing and training.

Usage:
  python prepare_dataset.py --mode synthetic   # Instant surrogate generation
  python prepare_dataset.py --mode real        # Process downloaded IMD_rain_2020.nc
"""

import argparse
import os
from pathlib import Path
import numpy as np
import pandas as pd
import xarray as xr


def prepare_synthetic(base_dir: Path):
    """Generates synthetic 9km LR and 3km HR NetCDF files."""
    print("Generating synthetic meteorological surrogate datasets...")
    lr_dir = base_dir / "data" / "raw" / "wrf_9km"
    hr_dir = base_dir / "data" / "raw" / "imd_3km"
    lr_dir.mkdir(parents=True, exist_ok=True)
    hr_dir.mkdir(parents=True, exist_ok=True)

    times = pd.date_range("2020-01-01", "2020-12-31", freq="D")
    lats_lr = np.linspace(6.5, 38.5, 60)
    lons_lr = np.linspace(66.5, 100.0, 60)

    lats_hr = np.linspace(6.5, 38.5, 180)  # 3x spatial resolution
    lons_hr = np.linspace(66.5, 100.0, 180)

    tp_lr = np.random.gamma(shape=2.0, scale=3.0, size=(len(times), 60, 60)).astype(np.float32)
    ds_lr = xr.Dataset(
        {"tp": (["time", "lat", "lon"], tp_lr)},
        coords={"time": times, "lat": lats_lr, "lon": lons_lr},
    )
    lr_file = lr_dir / "merged.nc"
    ds_lr.to_netcdf(lr_file)
    print(f"  [OK] Saved 9km WRF surrogate: {lr_file}")

    tp_hr = np.random.gamma(shape=2.0, scale=3.0, size=(len(times), 180, 180)).astype(np.float32)
    ds_hr = xr.Dataset(
        {"tp": (["time", "lat", "lon"], tp_hr)},
        coords={"time": times, "lat": lats_hr, "lon": lons_hr},
    )
    hr_file = hr_dir / "merged.nc"
    ds_hr.to_netcdf(hr_file)
    print(f"  [OK] Saved 3km IMD target: {hr_file}")


def prepare_real(base_dir: Path, source_nc: str = "data/raw/imd_public/IMD_rain_2020.nc"):
    """Processes downloaded real IMD NetCDF files into standard structure."""
    src = base_dir / source_nc
    if not src.exists():
        alt_src = base_dir / Path(source_nc).name
        if alt_src.exists():
            src = alt_src
        else:
            raise FileNotFoundError(
                f"Source file not found at {src}. Please download via:\n"
                "  pip install imddata\n"
                "  imddata --name rain --syear 2020 --eyear 2020\n"
            )

    print(f"Processing real IMD dataset from: {src}")
    lr_dir = base_dir / "data" / "raw" / "wrf_9km"
    hr_dir = base_dir / "data" / "raw" / "imd_3km"
    lr_dir.mkdir(parents=True, exist_ok=True)
    hr_dir.mkdir(parents=True, exist_ok=True)

    ds = xr.open_dataset(src)
    var_candidates = [v for v in ds.data_vars if any(k in v.lower() for k in ["rain", "rf", "tp", "precipitation"])]
    if not var_candidates:
        raise ValueError(f"Could not automatically detect precipitation variable in {list(ds.data_vars.keys())}")
    
    rain_var = var_candidates[0]
    print(f"  Detected precipitation variable: '{rain_var}' -> renaming to 'tp'")
    ds_std = ds[[rain_var]].rename({rain_var: "tp"})

    hr_file = hr_dir / "merged.nc"
    ds_std.to_netcdf(hr_file)
    print(f"  [OK] Saved 3km IMD target: {hr_file}")

    ds_lr = ds_std.coarsen(lat=3, lon=3, boundary="trim").mean()
    lr_file = lr_dir / "merged.nc"
    ds_lr.to_netcdf(lr_file)
    print(f"  [OK] Saved 9km WRF input: {lr_file}")


def main():
    parser = argparse.ArgumentParser(description="Prepare dataset files for KisanDarpan AI")
    parser.add_argument(
        "--mode",
        choices=["synthetic", "real"],
        default="synthetic",
        help="Mode: 'synthetic' for instant mock generation, 'real' to process downloaded IMD files.",
    )
    parser.add_argument(
        "--source",
        default="data/raw/imd_public/IMD_rain_2020.nc",
        help="Path to downloaded real IMD NetCDF file.",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    if args.mode == "synthetic":
        prepare_synthetic(root)
    else:
        prepare_real(root, args.source)
    print("\nDataset preparation complete! You can now run model training or start the backend.")


if __name__ == "__main__":
    main()
