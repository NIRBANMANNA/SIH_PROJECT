# inference/predictor.py
import os

import torch

from training.train import WeatherDownscaler


class MultiVariablePredictor:
    def __init__(self, checkpoint_dir='checkpoints/'):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.models = {}

        for var in ['tp', 't2m', 'rh', 'ws']:
            ckpt_path = f'{checkpoint_dir}/{var}.ckpt'
            if os.path.exists(ckpt_path):
                model = WeatherDownscaler.load_from_checkpoint(ckpt_path)
            else:
                model = WeatherDownscaler(variable=var)
            self.models[var] = model.eval().to(self.device)
    
    def predict(self, lr_input_dict):
        """
        lr_input_dict: {'tp': tensor, 't2m': tensor, ...} each [1, 1, H, W]
        Returns: Dict of 3km predictions
        """
        results = {}
        for var, model in self.models.items():
            with torch.no_grad():
                hr = model(lr_input_dict[var].to(self.device))
                results[var] = hr.cpu().numpy()
        return results