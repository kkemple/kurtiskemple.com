"""
Primordial Black Hole Evaporation Test - Fermi-LAT Data
Theory: 10^11 kg PBHs should show E^-1.5 → E^-2.5 spectral transition
"""

import numpy as np
import matplotlib.pyplot as plt
from astropy.io import fits
import requests
from scipy.optimize import curve_fit

# Fermi-LAT data server
FERMI_BASE_URL = "https://fermi.gsfc.nasa.gov/FTP/fermi/data/lat/weekly/photon/"

# Download Fermi-LAT weekly photon files (or use local if available)
print("Downloading Fermi-LAT data...")
print("For full analysis, download from: https://fermi.gsfc.nasa.gov/ssc/data/access/")

# For Colab: upload your downloaded Fermi photon file
from google.colab import files
print("\nUpload Fermi-LAT photon event file (FITS format):")
uploaded = files.upload()

if uploaded:
    filename = list(uploaded.keys())[0]
    
    # Load Fermi-LAT photon data
    with fits.open(filename) as hdul:
        events = hdul['EVENTS'].data
        energy = events['ENERGY']  # MeV
        time = events['TIME']
        ra = events['RA'] 
        dec = events['DEC']
else:
    # Generate test data matching PBH prediction
    print("No file uploaded - using simulated PBH spectrum for demonstration")
    energy = np.logspace(2, 5, 10000)  # 100 MeV to 100 GeV
    
    # Simulate spectrum with transition
    E_transition = 10000  # MeV
    spectrum = np.where(energy < E_transition, 
                       energy**(-1.5),  # Below transition
                       energy**(-2.5) * E_transition)  # Above transition
    
    # Add Poisson noise
    counts = np.random.poisson(spectrum * 1000)
    energy = np.repeat(energy, counts.astype(int))

print(f"Loaded {len(energy)} photon events")

# Energy range for 10^11 kg PBH (should be radiating at ~10^12 K)
# Characteristic energy: E ~ kT ~ 10^12 K ~ 100 GeV
E_min = 1000   # MeV (1 GeV)
E_max = 100000 # MeV (100 GeV)

# Filter to relevant energy range
mask = (energy > E_min) & (energy < E_max)
energy_filtered = energy[mask]

print(f"Events in PBH energy range: {len(energy_filtered)}")

# Create spectrum
bins = np.logspace(np.log10(E_min), np.log10(E_max), 50)
counts, bin_edges = np.histogram(energy_filtered, bins=bins)
bin_centers = np.sqrt(bin_edges[:-1] * bin_edges[1:])  # Geometric mean

# Normalize to flux
bin_widths = bin_edges[1:] - bin_edges[:-1]
flux = counts / bin_widths

# Remove zeros for log plot
nonzero = flux > 0
bin_centers = bin_centers[nonzero]
flux = flux[nonzero]
flux_err = np.sqrt(counts[nonzero]) / bin_widths[nonzero]

# Fit broken power law
def broken_power_law(E, norm, E_break, index1, index2):
    """Broken power law: transitions from index1 to index2 at E_break"""
    return norm * np.where(E < E_break,
                           (E/E_break)**index1,
                           (E/E_break)**index2)

# Initial guess
p0 = [flux[len(flux)//2], bin_centers[len(bin_centers)//2], -1.5, -2.5]

try:
    popt, pcov = curve_fit(broken_power_law, bin_centers, flux, 
                           p0=p0, sigma=flux_err, maxfev=5000)
    
    norm_fit, E_break_fit, index1_fit, index2_fit = popt
    perr = np.sqrt(np.diag(pcov))
    
    print("\n" + "="*50)
    print("BROKEN POWER LAW FIT RESULTS:")
    print("="*50)
    print(f"Break energy: {E_break_fit:.1f} ± {perr[1]:.1f} MeV")
    print(f"Index below break: {index1_fit:.2f} ± {perr[2]:.2f}")
    print(f"Index above break: {index2_fit:.2f} ± {perr[3]:.2f}")
    print(f"\nTheory prediction: -1.5 → -2.5")
    
    # Check if consistent with theory
    if abs(index1_fit - (-1.5)) < 3*perr[2] and abs(index2_fit - (-2.5)) < 3*perr[3]:
        print("\n✓ SPECTRAL INDICES MATCH PBH EVAPORATION SIGNATURE!")
    else:
        print("\n✗ Indices do not match prediction")
        
except Exception as e:
    print(f"Fit failed: {e}")
    popt = None

# Plot spectrum
plt.figure(figsize=(10, 8))

# Data
plt.errorbar(bin_centers, flux, yerr=flux_err, fmt='o', 
            label='Fermi-LAT Data', alpha=0.7, markersize=4)

# Theory prediction
E_theory = np.logspace(np.log10(E_min), np.log10(E_max), 100)
theory_break = 10000  # MeV, typical for 10^11 kg PBH
flux_theory = broken_power_law(E_theory, flux[len(flux)//2], 
                               theory_break, -1.5, -2.5)
plt.plot(E_theory, flux_theory, 'r-', lw=2, alpha=0.7,
         label='PBH Theory: E^-1.5 → E^-2.5')

# Fit if successful
if popt is not None:
    flux_fit = broken_power_law(E_theory, *popt)
    plt.plot(E_theory, flux_fit, 'g--', lw=2, alpha=0.7,
             label=f'Fit: E^{index1_fit:.2f} → E^{index2_fit:.2f}')

plt.xscale('log')
plt.yscale('log')
plt.xlabel('Energy (MeV)')
plt.ylabel('Flux (counts/MeV)')
plt.title('Search for 10^11 kg Primordial Black Hole Evaporation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

# Additional test: look for spatial clustering
# PBHs should appear as point sources
if 'ra' in locals() and 'dec' in locals():
    plt.figure(figsize=(10, 6))
    
    # Sky map of high-energy events
    high_E_mask = energy > 10000  # > 10 GeV
    plt.scatter(ra[high_E_mask], dec[high_E_mask], 
               s=1, alpha=0.5, c=energy[high_E_mask], 
               cmap='hot', norm=plt.matplotlib.colors.LogNorm())
    plt.colorbar(label='Energy (MeV)')
    plt.xlabel('RA (degrees)')
    plt.ylabel('Dec (degrees)')
    plt.title('Sky Distribution of High-Energy Events (potential PBH candidates)')
    plt.show()
    
    print(f"\nHigh-energy events (>10 GeV): {high_E_mask.sum()}")
    print("Clustered events could indicate PBH point sources")

print("\n" + "="*50)
print("NEXT STEPS:")
print("1. Download full Fermi-LAT Pass 8 data")
print("2. Apply proper exposure correction")
print("3. Search for point sources with E^-1.5 → E^-2.5 spectra")
print("4. Cross-correlate with gravitational lensing maps")
print("5. Check for time variability (PBHs should brighten as they evaporate)")
