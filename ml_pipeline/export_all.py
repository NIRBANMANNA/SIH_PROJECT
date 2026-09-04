# export_all.py — export all 4 weather variable ONNX models from the single checkpoint
import os
import torch
import sys

sys.path.insert(0, r'e:\aurora-ml')
os.chdir(r'e:\aurora-ml')

from training.train import WeatherDownscaler

VARIABLES = ['tp', 't2m', 'rh', 'ws']
os.makedirs('checkpoints', exist_ok=True)

# Find best checkpoint
import glob
ckpts = sorted(glob.glob('checkpoints/unet-*.ckpt'))
best_ckpt = ckpts[0] if ckpts else None
print(f"Using checkpoint: {best_ckpt}")

dummy_input = torch.randn(1, 1, 32, 32)

for var in VARIABLES:
    out_path = f'checkpoints/{var}_downscaler.onnx'
    if os.path.exists(out_path):
        print(f"  [SKIP] {out_path} already exists")
        continue

    print(f"  Exporting {var} -> {out_path}")
    if best_ckpt:
        model = WeatherDownscaler.load_from_checkpoint(best_ckpt, variable=var)
    else:
        model = WeatherDownscaler(variable=var)
    model.eval()

    torch.onnx.export(
        model.model,
        dummy_input,
        out_path,
        input_names=['lr_input'],
        output_names=['hr_output'],
        dynamic_axes={'lr_input': {0: 'batch'}, 'hr_output': {0: 'batch'}},
        opset_version=18,
    )
    print(f"  [DONE] {out_path}")

print("\nAll exports complete.")
