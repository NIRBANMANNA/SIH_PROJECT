# models/unet_3x.py
import torch
import torch.nn as nn
import torch.nn.functional as F

class ResBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1)
        self.relu = nn.ReLU(inplace=True)
        
    def forward(self, x):
        residual = x
        out = self.relu(self.conv1(x))
        out = self.conv2(out)
        return self.relu(out + residual)

class DownscaleUNet3x(nn.Module):
    def __init__(self, in_ch=1, out_ch=1, base_ch=64):
        super().__init__()
        
        # Encoder
        self.enc1 = nn.Sequential(
            nn.Conv2d(in_ch, base_ch, 3, padding=1),
            nn.ReLU(inplace=True),
            ResBlock(base_ch)
        )
        self.enc2 = nn.Sequential(
            nn.MaxPool2d(2),
            nn.Conv2d(base_ch, base_ch*2, 3, padding=1),
            nn.ReLU(inplace=True),
            ResBlock(base_ch*2)
        )
        
        # Bottleneck
        self.bottleneck = nn.Sequential(
            nn.MaxPool2d(2),
            nn.Conv2d(base_ch*2, base_ch*2, 3, padding=1),
            nn.ReLU(inplace=True),
            ResBlock(base_ch*2)
        )
        
        # Decoder with 3× upsampling via PixelShuffle
        # To upsample by 3x: conv to base_ch*9, then pixelshuffle(3)
        self.up1 = nn.Sequential(
            nn.Conv2d(base_ch*2, base_ch*9, 3, padding=1),
            nn.PixelShuffle(3),
            nn.ReLU(inplace=True)
        )
        self.dec1 = ResBlock(base_ch)
        
        self.up2 = nn.Sequential(
            nn.Conv2d(base_ch, base_ch*9, 3, padding=1),
            nn.PixelShuffle(3),
            nn.ReLU(inplace=True)
        )
        self.dec2 = ResBlock(base_ch)
        
        self.out = nn.Conv2d(base_ch, out_ch, 3, padding=1)
        
    def forward(self, x):
        # x: [B, 1, H, W] at 9km
        e1 = self.enc1(x)      # [B, 64, H, W]
        e2 = self.enc2(e1)     # [B, 128, H/2, W/2]
        
        b = self.bottleneck(e2) # [B, 128, H/4, W/4]
        
        # Decoder path
        d1 = self.up1(b)       # [B, 64, 3H/4, 3W/4] — need to align with e1
        # Resize the encoder skip to match the decoder spatial dims.
        e1_cropped = F.interpolate(e1, size=d1.shape[-2:], mode='bilinear', align_corners=False)
        d1 = self.dec1(d1 + e1_cropped)
        
        d2 = self.up2(d1)      # [B, 64, 9H/4, 9W/4]
        # We want exactly 3H x 3W output. Adjust via center crop.
        target_h, target_w = x.size(2)*3, x.size(3)*3
        d2 = d2[:, :, :target_h, :target_w]
        d2 = self.dec2(d2)
        
        return self.out(d2)    # [B, 1, 3H, 3W]