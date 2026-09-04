# training/dataset.py
import os

import xarray as xr
import torch
from torch.utils.data import Dataset
import numpy as np

class PanchayatDownscaleDataset(Dataset):
    def __init__(self, lr_path, hr_path, variable='tp', panchayat_mask=None):
        """
        lr_path: NetCDF with 9km WRF output
        hr_path: NetCDF with 3km observation target
        panchayat_mask: Optional GeoJSON/shapefile to mask specific GP
        """
        if not os.path.exists(lr_path):
            raise FileNotFoundError(f'Low-resolution dataset not found: {lr_path}')
        if not os.path.exists(hr_path):
            raise FileNotFoundError(f'High-resolution dataset not found: {hr_path}')

        self.lr = xr.open_dataset(lr_path)[variable]
        self.hr = xr.open_dataset(hr_path)[variable]
        self.var = variable
        
        # Align time dimensions
        common_times = np.intersect1d(self.lr.time.values, self.hr.time.values)
        self.lr = self.lr.sel(time=common_times)
        self.hr = self.hr.sel(time=common_times)
        
        # Compute normalization stats from training split
        self.lr_mean = self.lr.mean().values
        self.lr_std = self.lr.std().values
        self.hr_mean = self.hr.mean().values
        self.hr_std = self.hr.std().values

    def __len__(self):
        return len(self.lr.time)

    def __getitem__(self, idx):
        # Extract single timestep [H, W]
        x = self.lr.isel(time=idx).values
        y = self.hr.isel(time=idx).values
        
        # Handle NaNs
        x = np.nan_to_num(x, nan=0.0)
        y = np.nan_to_num(y, nan=0.0)
        
        # Add channel dimension: [1, H, W]
        x = torch.from_numpy(x).unsqueeze(0).float()
        y = torch.from_numpy(y).unsqueeze(0).float()
        
        # Normalize
        x = (x - self.lr_mean) / (self.lr_std + 1e-8)
        y = (y - self.hr_mean) / (self.hr_std + 1e-8)
        x = x.float()
        y = y.float()
        
        return x, y