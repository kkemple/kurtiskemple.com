## Overview

The pattern-locked baryon hypothesis predicts ~45% of baryons exist in thermodynamic equilibrium where all available energy maintains topological structure, making them electromagnetically invisible while gravitationally active. DESI's 40 million galaxy and QSO spectra provide unprecedented statistical power to test this through systematic mass discrepancies and redshift evolution.

## Theoretical Framework

### Pattern-Locked Condition
```python
def pattern_locked_state(T, rho, z):
    """Determine pattern-locked fraction at given conditions"""
    
    # Critical temperature for pattern locking
    T_lock = 1e6  # K
    T_full = 1e7  # K, full visibility above this
    
    # Energy balance
    E_thermal = (3/2) * (rho / m_p) * k_B * T
    
    # Pattern maintenance requirement
    N_bits = (rho / rho_crit(z)) * np.log2(voxel_connectivity)
    eta_topology = 100 * (1 + z)**(-1.5)  # Topology complexity evolution
    E_maintenance = N_bits * k_B * T * np.log(2) * eta_topology
    
    # Fraction locked
    if T < T_lock:
        f_locked = 1.0
    elif T > T_full:
        f_locked = 0.0
    else:
        f_locked = (T_full - T) / (T_full - T_lock)
    
    return f_locked
```

### Detection Method Discrepancies
```python
def baryon_detection_fractions(M_halo, z):
    """Predicted detection fractions by method"""
    
    # Halo temperature from virial theorem
    T_vir = (mu * m_p * G * M_halo) / (2 * k_B * R_vir(M_halo, z))
    
    # Local density
    rho = 200 * rho_crit(z)  # Typical halo overdensity
    
    # Pattern-locked fraction
    f_locked = pattern_locked_state(T_vir, rho, z)
    
    # Method-specific detection
    fractions = {
        'stellar_mass': 0.05,  # Always visible
        'HI_21cm': 0.10 * (1 - f_locked),  # Cold gas
        'xray': 0.50 * (1 - f_locked),  # Hot gas if not locked
        'sz_effect': 0.85 * (1 - 0.5 * f_locked),  # Pressure sensitive
        'weak_lensing': 1.0,  # All mass contributes
        'dynamics': 0.95,  # Most mass affects dynamics
    }
    
    return fractions
```

### Redshift Evolution Model
```python
def missing_fraction_evolution(z):
    """Evolution of pattern-locked fraction with redshift"""
    
    # Temperature evolution of typical structures
    T_cosmic = T_cmb_0 * (1 + z)
    
    # Pattern-locked fraction evolves as universe cools
    f_locked_0 = 0.45  # z=0 value
    
    # Scaling with cosmic temperature
    f_locked = f_locked_0 * ((1 + z) / (1 + 0))**(-1.5)
    
    return f_locked
```

## DESI Data Analysis Pipeline

### Step 1: Sample Selection
```python
import numpy as np
import pandas as pd
from astropy.io import fits
from astropy.cosmology import FlatLambdaCDM
import matplotlib.pyplot as plt

cosmo = FlatLambdaCDM(H0=70, Om0=0.3)

def select_desi_systems(catalog):
    """Select galaxy groups and clusters from DESI"""
    
    # Quality cuts
    quality_mask = (
        (catalog['ZWARN'] == 0) &  # Good redshift
        (catalog['SNR_R'] > 5) &   # Good S/N
        (catalog['SPECTYPE'] == 'GALAXY') &
        (catalog['Z'] > 0.01) &    # Beyond local
        (catalog['Z'] < 0.5)       # Within DESI sweet spot
    )
    
    # Select systems with multiple mass estimates
    mass_mask = (
        ~np.isnan(catalog['MASS_STELLAR']) &
        ~np.isnan(catalog['MASS_DYNAMICS']) &
        ~np.isnan(catalog['MASS_LENSING'])
    )
    
    return catalog[quality_mask & mass_mask]
```

### Step 2: Multi-Method Mass Estimation
```python
def estimate_masses_multimethod(group_data):
    """Estimate total mass using different methods"""
    
    masses = {}
    z = group_data['Z_GROUP']
    
    # Method 1: Stellar mass + gas fraction scaling
    M_stellar = np.sum(group_data['MASS_STELLAR'])
    f_gas = 0.15  # Typical gas fraction
    masses['stellar_scaled'] = M_stellar / (1 - f_gas)
    
    # Method 2: Velocity dispersion (dynamics)
    sigma_v = np.std(group_data['CZBEST'])
    R_vir = estimate_virial_radius(group_data)
    masses['dynamics'] = 3 * sigma_v**2 * R_vir / G
    
    # Method 3: Weak lensing (if available)
    if 'MASS_LENSING' in group_data:
        masses['lensing'] = group_data['MASS_LENSING'].mean()
    
    # Method 4: X-ray scaling (from external catalog)
    if 'LX' in group_data:
        T_X = (group_data['LX'] / 1e44)**(1/2.5)  # L-T relation
        masses['xray'] = 1e14 * (T_X / 5)**1.5  # M-T relation
    
    # Method 5: SZ effect (from Planck)
    if 'Y_SZ' in group_data:
        masses['sz'] = 1e14 * (group_data['Y_SZ'] / 1e-4)**(1/1.79)
    
    return masses
```

### Step 3: Identify Pattern-Locked Signature
```python
def detect_pattern_locked_signal(groups):
    """Test for systematic mass discrepancies"""
    
    results = {
        'z': [],
        'stellar_fraction': [],
        'xray_fraction': [],
        'sz_fraction': [],
        'dynamics_fraction': [],
        'T_vir': []
    }
    
    for group_id, group in groups.groupby('GROUP_ID'):
        masses = estimate_masses_multimethod(group)
        
        # Use lensing as "true" mass
        if 'lensing' not in masses:
            continue
            
        M_true = masses['lensing']
        z = group['Z_GROUP'].mean()
        
        # Calculate fractions
        results['z'].append(z)
        results['stellar_fraction'].append(masses['stellar_scaled'] / M_true)
        
        if 'xray' in masses:
            results['xray_fraction'].append(masses['xray'] / M_true)
        else:
            results['xray_fraction'].append(np.nan)
            
        if 'sz' in masses:
            results['sz_fraction'].append(masses['sz'] / M_true)
        else:
            results['sz_fraction'].append(np.nan)
            
        results['dynamics_fraction'].append(masses['dynamics'] / M_true)
        
        # Estimate temperature
        T_vir = (mu * m_p * G * M_true) / (2 * k_B * R_vir)
        results['T_vir'].append(T_vir)
    
    return pd.DataFrame(results)
```

### Step 4: Test Redshift Evolution
```python
def test_redshift_evolution(results_df):
    """Test if missing fraction evolves as predicted"""
    
    # Bin by redshift
    z_bins = np.linspace(0, 0.5, 11)
    z_centers = (z_bins[1:] + z_bins[:-1]) / 2
    
    missing_fractions = []
    missing_errors = []
    
    for i in range(len(z_bins)-1):
        mask = (results_df['z'] > z_bins[i]) & (results_df['z'] < z_bins[i+1])
        if mask.sum() < 10:
            continue
            
        # Average detection fraction (should be 1 - f_locked)
        detected = results_df[mask]['dynamics_fraction'].mean()
        error = results_df[mask]['dynamics_fraction'].std() / np.sqrt(mask.sum())
        
        missing_fractions.append(1 - detected)
        missing_errors.append(error)
    
    # Theoretical prediction
    z_theory = np.linspace(0, 0.5, 100)
    f_locked_theory = missing_fraction_evolution(z_theory)
    
    # Chi-squared test
    chi2 = np.sum((np.array(missing_fractions) - 
                   missing_fraction_evolution(z_centers[:len(missing_fractions)]))**2 / 
                  np.array(missing_errors)**2)
    dof = len(missing_fractions) - 1
    
    return z_centers[:len(missing_fractions)], missing_fractions, missing_errors, chi2, dof
```

### Step 5: Temperature Dependence Analysis
```python
def test_temperature_threshold(results_df):
    """Test for temperature threshold in detection"""
    
    # Bin by virial temperature
    T_bins = np.logspace(5, 7.5, 20)  # 10^5 to 10^7.5 K
    T_centers = np.sqrt(T_bins[1:] * T_bins[:-1])  # Geometric mean
    
    detection_by_method = {
        'xray': [],
        'sz': [],
        'dynamics': []
    }
    
    for i in range(len(T_bins)-1):
        mask = (results_df['T_vir'] > T_bins[i]) & \
               (results_df['T_vir'] < T_bins[i+1])
        
        if mask.sum() < 5:
            continue
            
        for method in detection_by_method.keys():
            col = f'{method}_fraction'
            if col in results_df.columns:
                frac = results_df[mask][col].mean()
                detection_by_method[method].append(frac)
    
    # Test for threshold behavior
    T_lock_fit = fit_threshold_model(T_centers[:len(detection_by_method['xray'])], 
                                     detection_by_method['xray'])
    
    return T_centers, detection_by_method, T_lock_fit
```

## Complete Analysis Implementation

```python
class PatternLockedBaryonTest:
    """Complete test of pattern-locked baryons using DESI"""
    
    def __init__(self, desi_catalog_path, external_catalogs=None):
        self.catalog_path = desi_catalog_path
        self.external = external_catalogs or {}
        self.results = {}
        
    def run_analysis(self):
        """Execute complete analysis pipeline"""
        
        print("="*60)
        print("PATTERN-LOCKED BARYON TEST WITH DESI")
        print("="*60)
        
        # 1. Load and prepare data
        print("\n1. Loading DESI galaxy catalog...")
        catalog = fits.open(self.catalog_path)[1].data
        systems = select_desi_systems(catalog)
        print(f"   Found {len(systems)} suitable systems")
        
        # 2. Group finding
        print("\n2. Identifying galaxy groups...")
        groups = self.find_groups(systems)
        print(f"   Found {len(groups)} groups/clusters")
        
        # 3. Multi-method mass estimation
        print("\n3. Estimating masses with multiple methods...")
        mass_results = detect_pattern_locked_signal(groups)
        print(f"   Processed {len(mass_results)} systems with multi-method masses")
        
        # 4. Test redshift evolution
        print("\n4. Testing redshift evolution...")
        z_centers, missing, errors, chi2, dof = test_redshift_evolution(mass_results)
        p_value_z = 1 - chi2_distribution.cdf(chi2, dof)
        
        # 5. Test temperature threshold
        print("\n5. Testing temperature dependence...")
        T_centers, detection, T_lock = test_temperature_threshold(mass_results)
        
        # 6. Report results
        print("\n" + "="*60)
        print("RESULTS:")
        print("="*60)
        
        print(f"\nMissing Baryon Fraction at z=0: {missing[0]:.2f} ± {errors[0]:.2f}")
        print(f"Theoretical Prediction: 0.45")
        
        print(f"\nRedshift Evolution Test:")
        print(f"  Chi-squared: {chi2:.2f} (dof={dof})")
        print(f"  p-value: {p_value_z:.3f}")
        
        print(f"\nTemperature Threshold:")
        print(f"  T_lock = {T_lock:.2e} K")
        print(f"  Theoretical: 1e6 K")
        
        print(f"\nDetection Method Discrepancies:")
        print(f"  X-ray / Lensing: {np.nanmean(mass_results['xray_fraction']):.2f}")
        print(f"  SZ / Lensing: {np.nanmean(mass_results['sz_fraction']):.2f}")
        print(f"  Dynamics / Lensing: {np.nanmean(mass_results['dynamics_fraction']):.2f}")
        
        if p_value_z > 0.05 and abs(missing[0] - 0.45) < 0.1:
            print("\n✓ Pattern-locked baryon hypothesis SUPPORTED")
        else:
            print("\n✗ Pattern-locked baryon hypothesis NOT SUPPORTED")
        
        self.results = {
            'mass_results': mass_results,
            'z_evolution': (z_centers, missing, errors),
            'T_dependence': (T_centers, detection, T_lock),
            'statistics': {'chi2_z': chi2, 'p_value_z': p_value_z}
        }
        
        return self.results
    
    def find_groups(self, catalog):
        """Friends-of-friends group finding"""
        from sklearn.cluster import DBSCAN
        
        # Convert to comoving coordinates
        coords = self.sky_to_comoving(catalog)
        
        # FOF with linking length
        b = 0.2  # Standard linking parameter
        mean_sep = (len(catalog) / self.survey_volume)**(1/3)
        linking_length = b * mean_sep
        
        clustering = DBSCAN(eps=linking_length, min_samples=5)
        catalog['GROUP_ID'] = clustering.fit_predict(coords)
        
        # Remove ungrouped (-1)
        grouped = catalog[catalog['GROUP_ID'] >= 0]
        
        return grouped
    
    def plot_results(self):
        """Generate publication plots"""
        
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        
        # Plot 1: Missing fraction vs redshift
        ax = axes[0, 0]
        z, missing, errors = self.results['z_evolution']
        ax.errorbar(z, missing, yerr=errors, fmt='o', label='DESI Data')
        
        z_theory = np.linspace(0, 0.5, 100)
        ax.plot(z_theory, missing_fraction_evolution(z_theory), 
                'r-', label='Pattern-Locked Prediction')
        ax.set_xlabel('Redshift')
        ax.set_ylabel('Missing Baryon Fraction')
        ax.legend()
        ax.set_title('Redshift Evolution Test')
        
        # Plot 2: Detection vs Temperature
        ax = axes[0, 1]
        T, detection, T_lock = self.results['T_dependence']
        for method, values in detection.items():
            ax.semilogx(T[:len(values)], values, 'o-', label=method)
        ax.axvline(1e6, color='r', linestyle='--', label='T_lock prediction')
        ax.set_xlabel('Temperature (K)')
        ax.set_ylabel('Detection Fraction')
        ax.legend()
        ax.set_title('Temperature Threshold Test')
        
        # Plot 3: Method comparison
        ax = axes[0, 2]
        df = self.results['mass_results']
        methods = ['stellar_fraction', 'xray_fraction', 'sz_fraction', 'dynamics_fraction']
        positions = range(len(methods))
        values = [df[m].mean() for m in methods]
        errors = [df[m].std() / np.sqrt(len(df)) for m in methods]
        
        ax.bar(positions, values, yerr=errors)
        ax.set_xticks(positions)
        ax.set_xticklabels(['Stellar', 'X-ray', 'SZ', 'Dynamics'])
        ax.axhline(1.0, color='k', linestyle='--')
        ax.set_ylabel('Mass Fraction (relative to lensing)')
        ax.set_title('Detection Method Discrepancies')
        
        # Plot 4: Scatter plot - X-ray vs Lensing mass
        ax = axes[1, 0]
        ax.scatter(df['T_vir'], df['xray_fraction'], alpha=0.5, c=df['z'])
        ax.set_xscale('log')
        ax.set_xlabel('Virial Temperature (K)')
        ax.set_ylabel('M_xray / M_lensing')
        ax.set_title('X-ray Mass Deficit vs Temperature')
        
        # Plot 5: Histogram of missing fractions
        ax = axes[1, 1]
        ax.hist(1 - df['dynamics_fraction'], bins=30, alpha=0.7, label='Dynamics')
        ax.hist(1 - df['xray_fraction'].dropna(), bins=30, alpha=0.7, label='X-ray')
        ax.axvline(0.45, color='r', linestyle='--', label='Prediction')
        ax.set_xlabel('Missing Fraction')
        ax.set_ylabel('Number of Systems')
        ax.legend()
        ax.set_title('Missing Baryon Distribution')
        
        # Plot 6: Phase diagram
        ax = axes[1, 2]
        scatter = ax.scatter(df['T_vir'], df['z'], 
                            c=1-df['dynamics_fraction'], 
                            cmap='coolwarm', vmin=0, vmax=1)
        ax.set_xscale('log')
        ax.set_xlabel('Temperature (K)')
        ax.set_ylabel('Redshift')
        plt.colorbar(scatter, ax=ax, label='Missing Fraction')
        ax.set_title('Pattern-Locked Phase Space')
        
        plt.tight_layout()
        plt.savefig('pattern_locked_baryon_test.pdf', dpi=300)
        plt.show()

# Execute analysis
test = PatternLockedBaryonTest('/path/to/desi/galaxy_catalog.fits')
results = test.run_analysis()
test.plot_results()
```

## Expected Signatures

### Primary Predictions
1. **Missing fraction**: 45% ± 10% at z=0
2. **Redshift evolution**: f_missing ∝ (1+z)^(-3/2)
3. **Temperature threshold**: Sharp transition at T ~ 10^6 K
4. **Method discrepancies**: X-ray (50%), SZ (85%), Lensing (100%)

### Secondary Signatures
- Increased scatter in scaling relations near T_lock
- Bimodal distribution in baryon fractions
- Correlation with filamentary structure
- Enhanced missing fraction at percolation threshold

## Falsification Criteria

The pattern-locked hypothesis is falsified if:

1. **No systematic discrepancy**: All methods give same mass within errors
2. **Wrong evolution**: Missing fraction increases with redshift
3. **No temperature dependence**: Detection uniform across all temperatures
4. **Wrong threshold**: Transition temperature ≠ 10^6 K by > order of magnitude
5. **Wrong fraction**: z=0 missing fraction outside 35-55% range

## Statistical Requirements

### Sample Size
- Minimum: 1,000 groups/clusters with multi-method masses
- Optimal: 10,000+ for fine redshift/temperature binning
- DESI capability: ~100,000 groups in full survey

### Precision Required
- Mass estimates: ±30% systematic uncertainty acceptable
- Redshift: σ_z < 0.001
- Temperature: Factor of 2 uncertainty acceptable

### Significance Threshold
- 5σ detection of missing fraction
- 3σ confirmation of redshift evolution
- 3σ identification of temperature threshold

## Data Products Required

### DESI Products
- Galaxy redshift catalog with ZWARN flags
- Group catalog (or ability to run FOF)
- Stellar mass estimates from SED fitting
- Velocity dispersions for dynamics

### External Cross-matches
- **X-ray**: ROSAT, eROSITA all-sky surveys
- **SZ**: Planck COMPSZ catalog
- **Weak lensing**: DES, HSC, future from Euclid/Roman
- **Radio**: FIRST, NVSS for AGN contamination

## Timeline

- **Months 1-2**: Data assembly and cross-matching
- **Months 3-4**: Group finding and mass estimation
- **Month 5**: Pattern-locked signal detection
- **Month 6**: Statistical analysis and systematics
- **Month 7**: Paper preparation

## Computational Requirements

- **RAM**: 32 GB for group finding on full catalog
- **Storage**: ~500 GB for DESI + external catalogs
- **CPU time**: ~1000 hours for complete pipeline
- **Software**: Python with scikit-learn, astropy, pandas

## Systematic Uncertainties

### Known Systematics
1. **Selection effects**: Brightness limits bias against locked systems
2. **Projection effects**: Line-of-sight contamination in groups
3. **AGN contamination**: Active galaxies bias X-ray masses high
4. **IMF variations**: Stellar mass uncertainties
5. **Hydrostatic bias**: Dynamics/X-ray underestimate true mass

### Mitigation Strategies
- Use multiple independent mass estimators
- Bootstrap resampling for error estimation
- Mock catalogs from simulations for calibration
- Careful quality cuts and outlier rejection

## Conclusion

This analysis provides a definitive test of the pattern-locked baryon hypothesis using DESI's unprecedented spectroscopic dataset. The key observables—45% missing fraction, (1+z)^(-3/2) evolution, and temperature threshold at 10^6 K—are all within DESI's measurement capabilities. The systematic discrepancies between different mass estimation methods provide the smoking gun for pattern-locked matter, distinguishing this framework from standard ΛCDM predictions where all methods should agree.