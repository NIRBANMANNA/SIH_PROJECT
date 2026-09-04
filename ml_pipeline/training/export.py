# training/export.py
import os
import torch

from training.train import WeatherDownscaler


checkpoint_path = 'checkpoints/tp.ckpt'
os.makedirs('checkpoints', exist_ok=True)

if os.path.exists(checkpoint_path):
    model = WeatherDownscaler.load_from_checkpoint(checkpoint_path)
else:
    # Fallback for smoke runs when no trained checkpoint exists yet.
    model = WeatherDownscaler(variable='tp')

model.eval()

dummy_input = torch.randn(1, 1, 32, 32)  # 9km patch

torch.onnx.export(
    model.model,
    dummy_input,
    'checkpoints/tp_downscaler.onnx',
    input_names=['lr_input'],
    output_names=['hr_output'],
    dynamic_axes={'lr_input': {0: 'batch'}, 'hr_output': {0: 'batch'}},
    opset_version=18,
)