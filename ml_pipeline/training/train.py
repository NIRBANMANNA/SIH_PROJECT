# training/train.py
import os

import pytorch_lightning as pl
from torch.utils.data import DataLoader, random_split
from torch import nn
import torch
from models.unet_3x import DownscaleUNet3x
from training.dataset import PanchayatDownscaleDataset


DEFAULT_LR_PATH = 'data/raw/wrf_9km/merged.nc'
DEFAULT_HR_PATH = 'data/raw/imd_3km/merged.nc'


def _dataset_path(env_name, default_path):
    return os.environ.get(env_name, default_path)


def _env_int(env_name, default_value):
    return int(os.environ.get(env_name, default_value))

class WeatherDownscaler(pl.LightningModule):
    def __init__(self, variable='tp', lr=1e-4):
        super().__init__()
        self.model = DownscaleUNet3x(in_ch=1, out_ch=1)
        self.variable = variable
        self.criterion = nn.L1Loss()  # MAE is more stable than MSE for weather
        self.save_hyperparameters()
        
    def forward(self, x):
        return self.model(x)
    
    def _common_step(self, batch):
        x, y = batch
        pred = self(x)
        loss = self.criterion(pred, y)
        return loss, pred, y
    
    def training_step(self, batch, batch_idx):
        loss, _, _ = self._common_step(batch)
        self.log('train_loss', loss, prog_bar=True)
        return loss
    
    def validation_step(self, batch, batch_idx):
        loss, pred, y = self._common_step(batch)
        
        # Denormalize for real-world metrics (assuming stats stored in dataset)
        # Here we compute on normalized space for simplicity
        mae = (pred - y).abs().mean()
        rmse = torch.sqrt(((pred - y)**2).mean())
        
        # R² score
        ss_res = ((pred - y)**2).sum()
        ss_tot = ((y - y.mean())**2).sum()
        r2 = 1 - (ss_res / (ss_tot + 1e-8))
        
        self.log('val_mae', mae, prog_bar=True)
        self.log('val_rmse', rmse, prog_bar=True)
        self.log('val_r2', r2, prog_bar=True)
        return loss
    
    def configure_optimizers(self):
        optimizer = torch.optim.AdamW(self.parameters(), lr=self.hparams.lr)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.5, patience=5
        )
        return {
            "optimizer": optimizer,
            "lr_scheduler": {"scheduler": scheduler, "monitor": "val_mae"}
        }

if __name__ == '__main__':
    lr_path = _dataset_path('AURORA_LR_PATH', DEFAULT_LR_PATH)
    hr_path = _dataset_path('AURORA_HR_PATH', DEFAULT_HR_PATH)

    if not os.path.exists(lr_path):
        raise FileNotFoundError(
            f'Missing low-resolution dataset: {lr_path}. '
            'Set AURORA_LR_PATH to your WRF 9km NetCDF file.'
        )

    if not os.path.exists(hr_path):
        raise FileNotFoundError(
            f'Missing high-resolution dataset: {hr_path}. '
            'Set AURORA_HR_PATH to your IMD NetCDF file.'
        )

    # Initialize dataset
    ds = PanchayatDownscaleDataset(
        lr_path=lr_path,
        hr_path=hr_path,
        variable='tp'
    )
    
    train_len = int(0.8 * len(ds))
    val_len = len(ds) - train_len
    train_ds, val_ds = random_split(ds, [train_len, val_len])
    
    batch_size = _env_int('AURORA_BATCH_SIZE', 4)
    num_workers = _env_int('AURORA_NUM_WORKERS', 0)
    max_epochs = _env_int('AURORA_MAX_EPOCHS', 1)

    train_dl = DataLoader(train_ds, batch_size=batch_size, shuffle=True, num_workers=num_workers)
    val_dl = DataLoader(val_ds, batch_size=batch_size, num_workers=num_workers)
    
    model = WeatherDownscaler(variable='tp', lr=1e-4)
    
    checkpoint_cb = pl.callbacks.ModelCheckpoint(
        dirpath='checkpoints/',
        filename='unet-{epoch:02d}-{val_mae:.4f}',
        monitor='val_mae',
        mode='min',
        save_top_k=3
    )
    
    trainer = pl.Trainer(
        max_epochs=max_epochs,
        accelerator='gpu' if torch.cuda.is_available() else 'cpu',
        devices=1,
        callbacks=[checkpoint_cb],
        precision='16-mixed' if torch.cuda.is_available() else '32'
    )
    
    trainer.fit(model, train_dl, val_dl)