from pathlib import Path
import sys

# Ensure both the repository root and ml_pipeline are in sys.path
REPO_ROOT = Path(__file__).resolve().parents[1]
PARENT_ROOT = Path(__file__).resolve().parents[2]

for p in [REPO_ROOT, REPO_ROOT / "ml_pipeline", PARENT_ROOT]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

try:
    from ml_pipeline.inference.api import app
except ImportError:
    from inference.api import app
