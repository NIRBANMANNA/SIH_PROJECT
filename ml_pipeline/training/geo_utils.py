# training/geo_utils.py
import rioxarray
from shapely.geometry import mapping
import geopandas as gpd

def crop_to_panchayat(ds, shapefile_path, panchayat_name):
    """Crop gridded dataset to a specific Gram Panchayat boundary."""
    gdf = gpd.read_file(shapefile_path)
    gp_geom = gdf[gdf['NAME'] == panchayat_name].geometry
    ds = ds.rio.write_crs("EPSG:4326")
    clipped = ds.rio.clip(gp_geom.apply(mapping), gp_geom.crs)
    return clipped