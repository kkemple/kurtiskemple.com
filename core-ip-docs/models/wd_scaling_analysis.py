# -*- coding: utf-8 -*-
"""White Dwarf Scaling Law Analysis - Kemple Pattern Maintenance Law"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import stats
from google.colab import files
import io

# Physical constants
G = 6.67430e-11  # m^3 kg^-1 s^-2
c = 299792458  # m/s
M_sun = 1.989e30  # kg

def calculate_radius(mass_solar, logg):
    """Calculate radius from mass and log(g)"""
    mass_kg = mass_solar * M_sun
    g_cgs = 10**logg  # cm/s^2
    g_si = g_cgs / 100  # m/s^2
    radius = np.sqrt(G * mass_kg / g_si)  # meters
    return radius

def process_white_dwarf_data(df):
    """Calculate scaling law parameters for each white dwarf"""
    # Filter valid data
    valid = df[(df['mass'] > 0) & (df['logg'] > 0) & 
               (~df['mass'].isna()) & (~df['logg'].isna())].copy()
    
    # Calculate for each WD
    valid['M_kg'] = valid['mass'] * M_sun
    valid['R_m'] = valid.apply(lambda row: calculate_radius(row['mass'], row['logg']), axis=1)
    valid['R_km'] = valid['R_m'] / 1000
    valid['R_S'] = 2 * G * valid['M_kg'] / (c * c)
    valid['R_over_RS'] = valid['R_m'] / valid['R_S']
    valid['RS_over_R'] = valid['R_S'] / valid['R_m']
    valid['log_R_RS'] = np.log10(valid['R_over_RS'])
    valid['log_RS_R'] = np.log10(valid['RS_over_R'])
    
    return valid

def create_visualizations(data):
    """Generate research-quality plots"""
    
    fig = plt.figure(figsize=(18, 12))
    
    # 1. Main scaling law plot
    ax1 = plt.subplot(2, 3, 1)
    scatter = ax1.scatter(data['R_over_RS'], data['RS_over_R'], 
                         c=data['mass'], s=1, cmap='viridis', alpha=0.6)
    ax1.set_xscale('log')
    ax1.set_yscale('log')
    ax1.set_xlabel('R/R$_S$')
    ax1.set_ylabel('E$_{maintenance}$/Mc$^2$ = R$_S$/R')
    ax1.grid(True, alpha=0.3)
    plt.colorbar(scatter, ax=ax1, label='Mass (M$_⊙$)')
    
    # Add theoretical line
    x_theory = np.logspace(2, 6, 100)
    y_theory = 1 / x_theory
    ax1.plot(x_theory, y_theory, 'r--', alpha=0.5, linewidth=1)
    
    # 2. Mass distribution with R/R_S zones
    ax2 = plt.subplot(2, 3, 2)
    zones = {
        'Extreme compact\n(R/R$_S$ < 500)': data[data['R_over_RS'] < 500],
        'Pre-anomaly\n(500-800)': data[(data['R_over_RS'] >= 500) & (data['R_over_RS'] < 800)],
        'Anomaly zone\n(800-1500)': data[(data['R_over_RS'] >= 800) & (data['R_over_RS'] < 1500)],
        'Post-anomaly\n(1500-5000)': data[(data['R_over_RS'] >= 1500) & (data['R_over_RS'] < 5000)],
        'Low mass\n(> 5000)': data[data['R_over_RS'] >= 5000]
    }
    
    positions = []
    masses = []
    colors = []
    color_map = plt.cm.Set1(np.linspace(0, 1, len(zones)))
    
    for i, (label, zone_data) in enumerate(zones.items()):
        if len(zone_data) > 0:
            positions.append(label)
            masses.append(zone_data['mass'].values)
            colors.append(color_map[i])
    
    bp = ax2.boxplot(masses, labels=positions, patch_artist=True)
    for patch, color in zip(bp['boxes'], colors):
        patch.set_facecolor(color)
        patch.set_alpha(0.7)
    ax2.set_ylabel('Mass (M$_⊙$)')
    ax2.axhline(1.36, color='red', linestyle='--', alpha=0.5)
    ax2.text(0.02, 1.38, 'Chandrasekhar', fontsize=8, transform=ax2.get_yaxis_transform())
    
    # 3. Cooling age vs R/R_S
    ax3 = plt.subplot(2, 3, 3)
    data_with_age = data[data['age'] > 0]
    scatter2 = ax3.scatter(data_with_age['R_over_RS'], data_with_age['age'],
                          c=data_with_age['mass'], s=1, alpha=0.6, cmap='plasma')
    ax3.set_xscale('log')
    ax3.set_xlabel('R/R$_S$')
    ax3.set_ylabel('Cooling age (Gyr)')
    ax3.axvline(1000, color='red', linestyle='--', alpha=0.5)
    ax3.axhline(8, color='blue', linestyle='--', alpha=0.3)
    plt.colorbar(scatter2, ax=ax3, label='Mass (M$_⊙$)')
    ax3.grid(True, alpha=0.3)
    
    # 4. Density plot: Mass vs log(g)
    ax4 = plt.subplot(2, 3, 4)
    hexbin = ax4.hexbin(data['mass'], data['logg'], gridsize=30, cmap='YlOrRd', mincnt=1)
    ax4.set_xlabel('Mass (M$_⊙$)')
    ax4.set_ylabel('log(g) [cgs]')
    plt.colorbar(hexbin, ax=ax4, label='Count')
    
    # 5. Temperature distribution in anomaly zone
    ax5 = plt.subplot(2, 3, 5)
    anomaly_data = data[(data['R_over_RS'] >= 800) & (data['R_over_RS'] < 1500)]
    other_data = data[(data['R_over_RS'] < 800) | (data['R_over_RS'] >= 1500)]
    
    if len(anomaly_data) > 0 and len(other_data) > 0:
        temps_anomaly = anomaly_data[anomaly_data['teff'] > 0]['teff']
        temps_other = other_data[other_data['teff'] > 0]['teff']
        
        ax5.hist(temps_other, bins=50, alpha=0.5, label='Other zones', density=True, color='blue')
        ax5.hist(temps_anomaly, bins=30, alpha=0.7, label='Anomaly zone', density=True, color='red')
        ax5.set_xlabel('T$_{eff}$ (K)')
        ax5.set_ylabel('Normalized density')
        ax5.legend()
    
    # 6. Scaling across orders of magnitude
    ax6 = plt.subplot(2, 3, 6)
    bins = np.logspace(2, 6, 50)
    hist, edges = np.histogram(data['R_over_RS'], bins=bins)
    centers = (edges[:-1] + edges[1:]) / 2
    
    ax6.bar(centers, hist, width=np.diff(edges), alpha=0.7, color='darkblue', edgecolor='black')
    ax6.set_xscale('log')
    ax6.set_xlabel('R/R$_S$')
    ax6.set_ylabel('Count')
    ax6.axvline(1000, color='red', linestyle='--', alpha=0.5, label='Anomaly threshold')
    ax6.legend()
    ax6.grid(True, alpha=0.3)
    
    plt.suptitle('Kemple Pattern Maintenance Law: E$_{maintenance}$/Mc$^2$ = R$_S$/R', fontsize=14)
    plt.tight_layout()
    plt.show()

def analyze_anomaly_zone(data):
    """Detailed analysis of the cooling anomaly zone"""
    
    # Define zones
    zones = {
        'extreme_compact': data[data['R_over_RS'] < 500],
        'pre_anomaly': data[(data['R_over_RS'] >= 500) & (data['R_over_RS'] < 800)],
        'anomaly': data[(data['R_over_RS'] >= 800) & (data['R_over_RS'] < 1500)],
        'post_anomaly': data[(data['R_over_RS'] >= 1500) & (data['R_over_RS'] < 5000)],
        'low_mass': data[data['R_over_RS'] >= 5000]
    }
    
    print("="*60)
    print("ZONE ANALYSIS")
    print("="*60)
    
    for name, zone_data in zones.items():
        if len(zone_data) > 0:
            with_age = zone_data[zone_data['age'] > 0]
            
            print(f"\n{name.upper().replace('_', ' ')} (n={len(zone_data)}):")
            print(f"  R/R_S range: {zone_data['R_over_RS'].min():.0f} - {zone_data['R_over_RS'].max():.0f}")
            print(f"  Mean R/R_S: {zone_data['R_over_RS'].mean():.0f}")
            print(f"  Mean mass: {zone_data['mass'].mean():.2f} M_sun")
            print(f"  Mass range: {zone_data['mass'].min():.2f} - {zone_data['mass'].max():.2f} M_sun")
            print(f"  Mean R_S/R: {zone_data['RS_over_R'].mean():.2e}")
            
            if len(with_age) > 0:
                print(f"  Mean age: {with_age['age'].mean():.2f} Gyr")
                print(f"  Max age: {with_age['age'].max():.2f} Gyr")
                
                # Find outliers with age > 8 Gyr
                old_ones = with_age[with_age['age'] > 8]
                if len(old_ones) > 0:
                    print(f"  Objects with age > 8 Gyr: {len(old_ones)}")
    
    # Statistical test for anomaly
    anomaly = zones['anomaly'][zones['anomaly']['age'] > 0]['age']
    pre = zones['pre_anomaly'][zones['pre_anomaly']['age'] > 0]['age']
    post = zones['post_anomaly'][zones['post_anomaly']['age'] > 0]['age']
    
    if len(anomaly) > 1 and len(pre) > 1:
        t_stat, p_value = stats.ttest_ind(anomaly, pre)
        print(f"\nAnomaly vs Pre-anomaly age t-test: p = {p_value:.4f}")
    
    if len(anomaly) > 1 and len(post) > 1:
        t_stat, p_value = stats.ttest_ind(anomaly, post)
        print(f"Anomaly vs Post-anomaly age t-test: p = {p_value:.4f}")

def plot_individual_objects(data):
    """Plot specific interesting objects"""
    
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    
    # Most massive
    most_massive = data.nlargest(10, 'mass')
    axes[0].scatter(most_massive['R_over_RS'], most_massive['RS_over_R'], 
                   c='red', s=50, alpha=0.7)
    axes[0].set_xscale('log')
    axes[0].set_yscale('log')
    axes[0].set_xlabel('R/R$_S$')
    axes[0].set_ylabel('R$_S$/R')
    axes[0].set_title('10 Most Massive White Dwarfs')
    axes[0].grid(True, alpha=0.3)
    
    # Oldest in anomaly zone
    anomaly = data[(data['R_over_RS'] >= 800) & (data['R_over_RS'] < 1500) & (data['age'] > 0)]
    if len(anomaly) > 10:
        oldest = anomaly.nlargest(10, 'age')
    else:
        oldest = anomaly
    
    axes[1].scatter(oldest['mass'], oldest['age'], c=oldest['R_over_RS'], 
                   s=50, cmap='coolwarm', alpha=0.7)
    axes[1].set_xlabel('Mass (M$_⊙$)')
    axes[1].set_ylabel('Age (Gyr)')
    axes[1].set_title('Oldest in Anomaly Zone')
    axes[1].axvline(1.36, color='red', linestyle='--', alpha=0.3)
    axes[1].grid(True, alpha=0.3)
    
    # Extreme R/R_S
    extreme = pd.concat([data.nsmallest(10, 'R_over_RS'), data.nlargest(10, 'R_over_RS')])
    colors = ['blue'] * 10 + ['green'] * 10
    axes[2].scatter(extreme['mass'], extreme['R_over_RS'], c=colors, s=50, alpha=0.7)
    axes[2].set_yscale('log')
    axes[2].set_xlabel('Mass (M$_⊙$)')
    axes[2].set_ylabel('R/R$_S$')
    axes[2].set_title('Extreme R/R$_S$ Objects')
    axes[2].axhline(1000, color='red', linestyle='--', alpha=0.3)
    axes[2].grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()

# Main execution
print("Upload MWDDexport.csv file...")
uploaded = files.upload()

for filename in uploaded.keys():
    # Read CSV
    df = pd.read_csv(io.BytesIO(uploaded[filename]))
    
    print(f"\nProcessing {len(df)} white dwarfs...")
    
    # Process data
    processed_data = process_white_dwarf_data(df)
    
    print(f"Valid entries with mass and log(g): {len(processed_data)}")
    print(f"R/R_S range: {processed_data['R_over_RS'].min():.1f} to {processed_data['R_over_RS'].max():.1f}")
    print(f"Orders of magnitude spanned: {np.log10(processed_data['R_over_RS'].max()/processed_data['R_over_RS'].min()):.1f}")
    
    # Generate visualizations
    create_visualizations(processed_data)
    
    # Analyze anomaly zone
    analyze_anomaly_zone(processed_data)
    
    # Plot interesting objects
    plot_individual_objects(processed_data)
    
    # Export processed data
    export_cols = ['wdid', 'mass', 'logg', 'R_km', 'R_S', 'R_over_RS', 'RS_over_R', 'age', 'teff']
    export_df = processed_data[export_cols].copy()
    export_df.to_csv('processed_wd_scaling.csv', index=False)
    print("\nProcessed data saved to 'processed_wd_scaling.csv'")
    
    # Summary statistics
    print("\n" + "="*60)
    print("SUMMARY STATISTICS")
    print("="*60)
    print(f"Total white dwarfs analyzed: {len(processed_data)}")
    print(f"Mean mass: {processed_data['mass'].mean():.2f} M_sun")
    print(f"Mean R/R_S: {processed_data['R_over_RS'].mean():.0f}")
    
    anomaly_zone = processed_data[(processed_data['R_over_RS'] >= 800) & 
                                  (processed_data['R_over_RS'] < 1500)]
    print(f"\nAnomaly zone (R/R_S ~ 10^3):")
    print(f"  Count: {len(anomaly_zone)}")
    print(f"  Mean mass: {anomaly_zone['mass'].mean():.2f} M_sun")
    print(f"  Mean R_S/R: {anomaly_zone['RS_over_R'].mean():.2e}")