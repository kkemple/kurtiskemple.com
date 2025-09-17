"""
White Dwarf Pattern Maintenance Test - DESI Data
Theory: ΔT = (M/M_Ch)² × 500K
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from google.colab import files

# Upload DESI data file
uploaded = files.upload()
filename = list(uploaded.keys())[0]

# Load data
if filename.endswith('.csv'):
    df = pd.read_csv(filename)
elif filename.endswith('.fits'):
    from astropy.io import fits
    with fits.open(filename) as hdul:
        df = pd.DataFrame(hdul[1].data)

print(f"Loaded {len(df)} white dwarfs")

# Theory: cooling anomaly scales as (M/M_Ch)²
M_ch = 1.4  # Chandrasekhar mass
df['theory_delta_T'] = -(df['mass'] / M_ch)**2 * 500  # Kelvin

# Bin by mass and compute mean temperatures
mass_bins = np.linspace(0.4, 1.35, 15)
bin_centers = (mass_bins[:-1] + mass_bins[1:]) / 2
binned_temps = []

for i in range(len(mass_bins)-1):
    mask = (df['mass'] >= mass_bins[i]) & (df['mass'] < mass_bins[i+1])
    if mask.sum() > 0:
        binned_temps.append(df[mask]['teff'].mean())
    else:
        binned_temps.append(np.nan)

# Compare to standard cooling (you'll need to adjust based on actual cooling models)
# For now, assume temperature deficit shows up directly in the data
temp_deficit = np.array(binned_temps) - np.nanmean(binned_temps)

# Plot
plt.figure(figsize=(10, 6))
plt.scatter(bin_centers, temp_deficit, label='DESI Data', s=50)
plt.plot(bin_centers, -(bin_centers/M_ch)**2 * 500, 'r-', label='Pattern Maintenance Theory')
plt.xlabel('Mass (M☉)')
plt.ylabel('Temperature Deficit (K)')
plt.title('White Dwarf Cooling Anomaly Test')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# Calculate correlation
from scipy import stats
theory = -(bin_centers/M_ch)**2 * 500
valid = ~np.isnan(temp_deficit)
r, p = stats.pearsonr(temp_deficit[valid], theory[valid])

print(f"\nCorrelation with (M/M_Ch)² theory: r = {r:.3f}, p = {p:.3e}")
if p < 0.05:
    print("✓ Pattern maintenance scaling detected!")
else:
    print("✗ No significant correlation")
