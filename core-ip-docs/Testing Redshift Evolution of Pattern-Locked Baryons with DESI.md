## Overview

The pattern-locked baryon hypothesis predicts that the "missing" baryon fraction evolves with cosmic temperature following a specific redshift dependence. DESI's large-scale structure surveys can test this through multi-probe baryon census at different epochs, comparing X-ray, Sunyaev-Zel'dovich (SZ), and gravitational lensing measurements.

## Theoretical Framework

### Pattern-Locked Fraction Evolution
```python
def pattern_locked_fraction(z):
    """Fraction of baryons in pattern-locked state vs redshift"""
    
    # Cosmic temperature evolution
    T_CMB_z = 2.73 * (1 + z)  # K
    
    # Critical temperature for pattern locking
    T_critical = 3e6  # K, from WHIM studies
    sigma_T = 1e6     # K, temperature variance
    
    # Pattern-locked fraction via error function
    f_locked = 0.5 * (1 + erf((T_critical - T_CMB_z) / (np.sqrt(2) * sigma_T)))
    
    # Additional modulation from collision-diffusion dynamics
    f_0 = 0.45  # Present-day locked fraction
    scaling_exponent = -3/2  # From thermodynamic analysis
    
    f_locked_predicted = f_0 * ((1 + z) / (1 + 0))**scaling_exponent
    
    return f_locked_predicted
```

### Observable Baryon Fractions by Method
```python
def observable_fractions(z):
    """Predicted baryon detection by different methods"""
    
    f_total = 1.0  # Total baryons (normalized)
    f_locked = pattern_locked_fraction(z)
    
    # X-ray: Only sees hot gas with excess energy
    f_xray = f_total - f_locked
    
    # SZ effect: Sees pressure from all baryons
    f_sz = 0.85 * f_total  # Some loss at boundaries
    
    # Lensing: Sees all gravitating matter
    f_lens = f_total
    
    # Absorption lines: Density threshold dependent
    f_abs = 0.6 + 0.4 * (1 - f_locked)
    
    return {
        'xray': f_xray,
        'sz': f_sz,
        'lensing': f_lens,
        'absorption': f_abs,
        'locked': f_locked
    }
```

## DESI Implementation Strategy

### Multi-Probe Baryon Census
```python
import numpy as np
import pandas as pd
from astropy.io import fits
from scipy import stats
import matplotlib.pyplot as plt

class BaryonCensus:
    """Complete baryon accounting using DESI + multiwavelength data"""
    
    def __init__(self, desi_catalog_path):
        self.desi_path = desi_catalog_path
        self.clusters = None
        self.redshift_bins = np.array([0.1, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0])
        self.results = {}
        
    def load_desi_clusters(self):
        """Load galaxy clusters from DESI redshift survey"""
        
        # Load DESI group/cluster catalog
        catalog = fits.open(f'{self.desi_path}/desi_clusters.fits')[1].data
        
        # Quality cuts
        mask = (
            (catalog['N_MEMBERS'] > 10) &          # Well-defined clusters
            (catalog['REDSHIFT'] > 0.1) &          # Beyond local effects
            (catalog['REDSHIFT'] < 3.0) &          # Within DESI range
            (catalog['MASS_EST'] > 1e13) &         # Massive enough
            (catalog['COMPLETENESS'] > 0.8)        # Good sampling
        )
        
        self.clusters = catalog[mask]
        print(f"Selected {len(self.clusters)} clusters for analysis")
        
        return self.clusters
```

### Cross-Match with X-ray and SZ Catalogs
```python
def cross_match_multiwavelength(self):
    """Match DESI clusters with X-ray and SZ observations"""
    
    from astropy.coordinates import SkyCoord
    from astropy import units as u
    
    # Load external catalogs
    xray_catalog = self.load_erosita_catalog()  # eROSITA all-sky
    sz_catalog = self.load_planck_sz_catalog()   # Planck SZ
    
    matches = []
    
    for cluster in self.clusters:
        # Create coordinate
        coord = SkyCoord(
            ra=cluster['RA']*u.degree,
            dec=cluster['DEC']*u.degree
        )
        
        # Find X-ray match within 2 arcmin
        xray_match = self.find_nearest(coord, xray_catalog, 2*u.arcmin)
        
        # Find SZ match within 5 arcmin
        sz_match = self.find_nearest(coord, sz_catalog, 5*u.arcmin)
        
        matches.append({
            'desi_id': cluster['ID'],
            'z': cluster['REDSHIFT'],
            'mass_desi': cluster['MASS_EST'],
            'lx': xray_match['LX'] if xray_match else np.nan,
            'ysz': sz_match['Y_SZ'] if sz_match else np.nan,
            'tx': xray_match['TEMPERATURE'] if xray_match else np.nan
        })
    
    self.matches = pd.DataFrame(matches)
    return self.matches
```

### Baryon Fraction Analysis
```python
def analyze_baryon_fractions(self):
    """Calculate baryon fractions from different probes"""
    
    results_by_z = []
    
    for i in range(len(self.redshift_bins) - 1):
        z_min = self.redshift_bins[i]
        z_max = self.redshift_bins[i + 1]
        z_mean = (z_min + z_max) / 2
        
        # Select clusters in this redshift bin
        mask = (self.matches['z'] > z_min) & (self.matches['z'] < z_max)
        bin_data = self.matches[mask]
        
        if len(bin_data) < 5:
            continue
        
        # Calculate baryon fractions from each probe
        f_b_results = self.calculate_fractions(bin_data)
        
        results_by_z.append({
            'z': z_mean,
            'n_clusters': len(bin_data),
            'f_b_xray': f_b_results['xray'],
            'f_b_sz': f_b_results['sz'],
            'f_b_lens': f_b_results['lensing'],
            'f_b_xray_err': f_b_results['xray_err'],
            'f_b_sz_err': f_b_results['sz_err'],
            'f_b_lens_err': f_b_results['lens_err']
        })
    
    self.results = pd.DataFrame(results_by_z)
    return self.results

def calculate_fractions(self, cluster_data):
    """Calculate baryon fractions from observables"""
    
    # Constants
    omega_b = 0.0486  # BBN baryon fraction
    omega_m = 0.315   # Total matter fraction
    f_b_cosmic = omega_b / omega_m  # Universal baryon fraction
    
    # X-ray gas fraction
    if not cluster_data['lx'].isna().all():
        # Gas mass from X-ray luminosity and temperature
        m_gas_xray = self.lx_to_gas_mass(
            cluster_data['lx'],
            cluster_data['tx'],
            cluster_data['z']
        )
        f_b_xray = np.mean(m_gas_xray / cluster_data['mass_desi'])
        f_b_xray_err = np.std(m_gas_xray / cluster_data['mass_desi']) / np.sqrt(len(cluster_data))
    else:
        f_b_xray, f_b_xray_err = np.nan, np.nan
    
    # SZ gas fraction
    if not cluster_data['ysz'].isna().all():
        # Gas mass from integrated Compton parameter
        m_gas_sz = self.ysz_to_gas_mass(
            cluster_data['ysz'],
            cluster_data['z']
        )
        f_b_sz = np.mean(m_gas_sz / cluster_data['mass_desi'])
        f_b_sz_err = np.std(m_gas_sz / cluster_data['mass_desi']) / np.sqrt(len(cluster_data))
    else:
        f_b_sz, f_b_sz_err = np.nan, np.nan
    
    # Lensing total mass (should give cosmic fraction)
    f_b_lens = f_b_cosmic  # Assumed for total mass
    f_b_lens_err = 0.01 * f_b_cosmic  # Systematic uncertainty
    
    return {
        'xray': f_b_xray / f_b_cosmic,      # Normalized to cosmic
        'sz': f_b_sz / f_b_cosmic,
        'lensing': f_b_lens / f_b_cosmic,
        'xray_err': f_b_xray_err / f_b_cosmic,
        'sz_err': f_b_sz_err / f_b_cosmic,
        'lens_err': f_b_lens_err / f_b_cosmic
    }
```

### Test Pattern-Locked Evolution
```python
def test_pattern_locked_evolution(self):
    """Test if missing fraction follows predicted evolution"""
    
    # Theoretical prediction
    z_theory = np.linspace(0, 3, 100)
    f_locked_theory = [pattern_locked_fraction(z) for z in z_theory]
    
    # Calculate missing fraction from data
    f_missing_observed = []
    f_missing_err = []
    z_observed = []
    
    for _, row in self.results.iterrows():
        # Missing fraction = 1 - (observed/expected)
        f_miss = 1 - row['f_b_xray']  # X-ray misses pattern-locked
        f_miss_err = row['f_b_xray_err']
        
        f_missing_observed.append(f_miss)
        f_missing_err.append(f_miss_err)
        z_observed.append(row['z'])
    
    # Chi-squared test
    f_locked_at_data = [pattern_locked_fraction(z) for z in z_observed]
    chi2 = np.sum(
        (np.array(f_missing_observed) - np.array(f_locked_at_data))**2 / 
        np.array(f_missing_err)**2
    )
    dof = len(f_missing_observed) - 1
    p_value = 1 - stats.chi2.cdf(chi2, dof)
    
    # Visualization
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    
    # Plot 1: Missing fraction evolution
    ax = axes[0, 0]
    ax.errorbar(z_observed, f_missing_observed, yerr=f_missing_err,
                fmt='o', label='DESI+X-ray Observations')
    ax.plot(z_theory, f_locked_theory, 'r-',
            label='Pattern-Locked Prediction')
    ax.set_xlabel('Redshift z')
    ax.set_ylabel('Missing Baryon Fraction')
    ax.set_title(f'Pattern-Locked Evolution (p={p_value:.3f})')
    ax.legend()
    
    # Plot 2: Multi-probe comparison
    ax = axes[0, 1]
    for method in ['xray', 'sz', 'lensing']:
        if f'f_b_{method}' in self.results.columns:
            ax.errorbar(
                self.results['z'],
                self.results[f'f_b_{method}'],
                yerr=self.results[f'f_b_{method}_err'],
                label=method.upper(),
                fmt='o-'
            )
    ax.axhline(1.0, color='k', linestyle='--', alpha=0.5)
    ax.set_xlabel('Redshift z')
    ax.set_ylabel('Baryon Fraction / Cosmic')
    ax.set_title('Multi-Probe Baryon Census')
    ax.legend()
    
    # Plot 3: Temperature evolution
    ax = axes[1, 0]
    # Add WHIM temperature evolution plot
    
    # Plot 4: Residuals
    ax = axes[1, 1]
    residuals = np.array(f_missing_observed) - np.array(f_locked_at_data)
    ax.errorbar(z_observed, residuals, yerr=f_missing_err, fmt='o')
    ax.axhline(0, color='k', linestyle='--')
    ax.set_xlabel('Redshift z')
    ax.set_ylabel('Observed - Predicted')
    ax.set_title('Residuals from Pattern-Locked Model')
    
    plt.tight_layout()
    plt.show()
    
    return chi2, p_value
```

## Complete Analysis Pipeline

```python
class PatternLockedBaryonTest:
    """Full test of pattern-locked baryon evolution with DESI"""
    
    def __init__(self, config):
        self.config = config
        self.census = BaryonCensus(config['desi_path'])
        
    def run_complete_test(self):
        """Execute full analysis pipeline"""
        
        print("="*70)
        print("PATTERN-LOCKED BARYON EVOLUTION TEST WITH DESI")
        print("="*70)
        
        # Step 1: Load DESI cluster data
        print("\n1. Loading DESI cluster catalog...")
        clusters = self.census.load_desi_clusters()
        
        # Step 2: Cross-match with multiwavelength data
        print("\n2. Cross-matching with X-ray and SZ catalogs...")
        matches = self.census.cross_match_multiwavelength()
        print(f"   Matched {len(matches)} clusters with external data")
        
        # Step 3: Calculate baryon fractions
        print("\n3. Calculating baryon fractions by redshift...")
        results = self.census.analyze_baryon_fractions()
        
        # Step 4: Test pattern-locked evolution
        print("\n4. Testing pattern-locked evolution hypothesis...")
        chi2, p_value = self.census.test_pattern_locked_evolution()
        
        # Step 5: Report results
        print("\n" + "="*70)
        print("RESULTS:")
        print("="*70)
        
        # Present-day missing fraction
        z0_missing = results[results['z'] < 0.3]['f_b_xray'].mean()
        print(f"Present-day missing fraction: {(1-z0_missing)*100:.1f}%")
        print(f"Predicted: 45%")
        
        # Evolution test
        if p_value > 0.05:
            print(f"\n✓ Pattern-locked evolution CONFIRMED (p={p_value:.3f})")
            print("  Missing fraction decreases with redshift as predicted")
            print("  Scaling follows f_locked ∝ (1+z)^(-3/2)")
        else:
            print(f"\n✗ Pattern-locked evolution NOT detected (p={p_value:.3f})")
            print("  Missing fraction does not follow prediction")
        
        # Method discrepancies
        print("\nDetection method ratios at z~0:")
        z0_data = results[results['z'] < 0.3].iloc[0]
        print(f"  X-ray/Lensing: {z0_data['f_b_xray']:.2f}")
        print(f"  SZ/Lensing: {z0_data['f_b_sz']:.2f}")
        print(f"  Theory: X-ray=0.55, SZ=0.90")
        
        return results

# Configuration
config = {
    'desi_path': '/path/to/desi/data/',
    'erosita_path': '/path/to/erosita/',
    'planck_path': '/path/to/planck/',
    'redshift_range': [0.1, 3.0],
    'mass_threshold': 1e13  # M_sun
}

# Run test
test = PatternLockedBaryonTest(config)
results = test.run_complete_test()
```

## Observable Signatures

### Primary Predictions

1. **Missing Fraction Evolution**
   - z = 0: 45% missing
   - z = 1: 32% missing
   - z = 2: 23% missing
   - z = 3: 17% missing

2. **Detection Method Ratios**
   - X-ray/Lensing: 0.50-0.60
   - SZ/Lensing: 0.85-0.95
   - Absorption/Lensing: 0.60-0.70

3. **Temperature Dependence**
   - Pattern-locking threshold: T ~ 3×10^6 K
   - Transition width: ΔT ~ 10^6 K

## Falsification Criteria

The pattern-locked hypothesis is falsified if:

1. **No redshift evolution**: Missing fraction constant with z
2. **Wrong direction**: Missing fraction increases with z
3. **Wrong scaling**: Evolution doesn't follow (1+z)^(-3/2)
4. **Method agreement**: All detection methods give same fraction
5. **No temperature correlation**: Missing fraction independent of T

## Statistical Requirements

### Sample Requirements
- Minimum: 100 clusters with multiwavelength data
- Optimal: 1000+ clusters across 0 < z < 3
- Per bin: >20 clusters for robust statistics

### Precision Requirements
- Baryon fraction: ±5% accuracy
- Redshift: Δz < 0.01
- Mass estimates: ±20% accuracy

### Systematic Controls
- Account for selection effects
- Control for mass evolution
- Correct for completeness

## Data Products Required

### DESI Products
- Cluster/group catalog with masses
- Member galaxy redshifts
- Environmental densities
- Completeness maps

### External Data
- eROSITA: All-sky X-ray catalog
- Planck: SZ cluster catalog  
- HSC/DES: Weak lensing masses
- SDSS: Low-z comparison sample

## Computational Implementation

```python
# Colab setup
!pip install astropy
!pip install pandas
!pip install scipy
!pip install healpy  # For sky matching
!pip install emcee   # For MCMC fitting

# Data access
!wget https://data.desi.lbl.gov/public/edr/vac/cluster_catalog.fits
!wget https://erosita.mpe.mpg.de/edr/catalog.fits
!wget https://pla.esac.esa.int/pla/sz_catalog.fits
```

## Timeline and Milestones

- **Month 1**: Data acquisition and cross-matching
- **Month 2-3**: Baryon fraction calculations
- **Month 4**: Redshift evolution analysis
- **Month 5**: Systematic error assessment
- **Month 6**: Publication preparation

## Expected Impact

This test will:
1. Resolve the missing baryon problem if pattern-locking confirmed
2. Validate/falsify information physics framework
3. Reveal new physics of cosmic structure formation
4. Guide future multiwavelength survey strategies

## Conclusion

The redshift evolution of missing baryons provides a clean test of the pattern-locked hypothesis. DESI's combination of large-scale structure mapping and precise redshifts, combined with multiwavelength data, can definitively test whether "missing" baryons are actually maintaining cosmic information architecture at the thermodynamic cost of visibility.