# Information Physics: Notation & Symbols

A unified glossary of notation for **Collision Theory**, **Electromagnetic Voxel Lattice (EVL)**, **Information Physics (IP)**, and **Entropic Mechanics (EM)**.

---

## Global Conventions

* **Scalars:** italic Roman (e.g., $t, x, y, z, E, S$).
* **Vectors:** bold lowercase/uppercase (e.g., $\mathbf{x}, \mathbf{V}$).
* **Matrices / Linear maps:** bold uppercase (e.g., $\mathbf{A}$).
* **Operators (sets/classes):** calligraphic $\mathcal{O}$.
* **Specific operator instances:** hatted lowercase (e.g., $\hat{o}$).
* **Fields / continuous densities:** Greek letters ($\phi, \psi, \rho$).
* **Random variables / stochastic terms:** sans serif or $\xi, \eta$ where standard.
* **Units:** SI unless stated; use $[\cdot]$ to denote dimensions.

**Examples:**

* Vector: $\mathbf{V}$
* Operator class: $\mathcal{O}$
* Specific operator: $\hat{o}$

---

## Core Symbols (Cross-Framework)

| Symbol                         | Meaning                           | Type         | Units                                     |
| ------------------------------ | --------------------------------- | ------------ | ----------------------------------------- |
| $c$                          | Speed of light                    | constant     | $m\cdot s^{-1}$                         |
| $G$                          | Newtonian gravitational constant  | constant     | $m^3\cdot kg^{-1}\cdot s^{-2}$          |
| $k_B$                       | Boltzmann constant                | constant     | $J\cdot K^{-1}$                         |
| $\hbar$                      | Reduced Planck constant           | constant     | $J\cdot s$                              |
| $H_0$                       | Hubble constant (today)           | parameter    | $s^{-1}$                                |
| $\Omega_m, \Omega_\Lambda$ | Density parameters                | parameters   | —                                         |
| $p_c$                       | Percolation threshold             | parameter    | —                                         |
| $\ell_P$                    | Planck length                     | constant     | m                                         |
| $t_P$                       | Planck time                       | constant     | s                                         |
| $\ell_v$                    | Voxel spacing                     | model param. | m                                         |
| $\tau_v$                    | Voxel hop time                    | model param. | s                                         |
| $\eta$                       | Positional energy multiplier (EM) | scalar       | —                                         |
| $\mathbf{V}$                 | Intent vector (EM)                | vector       | —                                         |
| $\mathcal{O}$                | Operation class (COB)             | set          | —                                         |
| $\hat{o}$                    | Realized operation                | operator     | —                                         |
| $\phi$                       | Information density / potential   | field        | $bits\cdot m^{-3}$ or $J\cdot m^{-3}$ |
| $\rho_{\mathrm{info}}$      | Information-energy density        | field        | $J\cdot m^{-3}$                         |
| $\Gamma$                     | Bit processing rate density       | field        | $bits\cdot m^{-3}\cdot s^{-1}$          |
| $\beta_0$                    | Information-reaction normalization | parameter    | $s^{-1}$                                 |
| $z_c$                        | Peak reaction redshift            | parameter    | —                                         |
| $w$                          | Reaction epoch width              | parameter    | —                                         |
| $q$                          | Power-law scaling exponent        | parameter    | —                                         |

---

### 1. Collision Theory (CDE)

**Primary PDE (Collision–Diffusion Equation):**

$$
\frac{\partial \phi}{\partial t} = D(z)\,\nabla^2 \phi - R_{\mathrm{info}}(z)
$$

* $\phi$: information density (or potential)
* $D(z)$: effective diffusion coefficient vs. redshift
* $R_{\mathrm{info}}(z)$: information-reaction (Landauer-weighted) term

**Information–reaction (Gaussian-in-redshift example):**

$$
R_{\mathrm{info}}(z) = \beta_0\,\Big(\tfrac{1+z}{1+z_c}\Big)^{q}\,\exp\!\left[-\tfrac{(z-z_c)^2}{2w^2}\right]
$$

**Percolation threshold:** $p_c = 0.45$

**From reaction to energy density:**

$$
\Gamma \;\sim\; \frac{R_{\mathrm{info}}}{\tau_v}\,g(\lVert\nabla\phi\rVert),\qquad
\rho_{\mathrm{info}} \;=\; k_B T\ln 2\,\Gamma
$$

---

### 2. Electromagnetic Voxel Lattice (EVL)

**Kinematics:**

$$
c \;=\; \frac{\ell_v}{\tau_v}
$$

**Pattern maintenance (Landauer identity view):**

$$
E \;=\; mc^2 \;=\; N_{\mathrm{bits}}\,k_B T\ln 2
$$

**Conservation of Boundaries (COB):**

$$
\mathcal{O} \in \{\mathcal{O}_M^{(1)},\;\mathcal{O}_J^{(2)},\;\mathcal{O}_S^{(3)}\}
$$

---

### 3. Information Physics (IP)

**Memory compression efficiency:**

$$
\eta_{\mathrm{mem}} \;=\; \frac{I_{\mathrm{stored}}}{I_{\mathrm{total}}}
$$

**Bandwidth–capacity (informal scaling placeholder):**

$$
C_{\max} \;\propto\; B^{\alpha}\, T^{\beta}
$$

---

### 4. Entropic Mechanics (EM)

**System Entropy Change (scalar form):**

$$
\mathrm{SEC} \;=\; \frac{\mathcal{O}\,\cdot\,\mathbf{V}}{1+\eta}
$$

**Entropic Gap (cosine-sim form):**

$$
EG \;=\; 1 - \cos\theta\big(\mathbf{a},\mathbf{c}\big)
\;=\; 1 - \frac{\mathbf{a}\cdot\mathbf{c}}{\lVert\mathbf{a}\rVert\,\lVert\mathbf{c}\rVert}
$$

**Entropic Equilibrium (multi-agent):**

$$
\sum_i (\mathrm{SEC}_i\,W_i) \;\to\; \text{steady},\qquad
\frac{d}{dt}\sum_i (\mathrm{SEC}_i\,W_i) \approx 0
$$

---

### 5. EVL-Specific Notation Extensions

| Symbol                       | Meaning                                      | Type   | Units     |
| ---------------------------- | -------------------------------------------- | ------ | --------- |
| $\eta_{\mathrm{lattice}}$ | Positional energy multiplier due to lattice  | scalar | —         |
| $\theta_{\mathrm{lat}}$   | Angle of operation relative to lattice field | scalar | rad       |
| $B_{\mathrm{voxel}}$      | Local magnetic field strength of a voxel     | param. | Tesla (T) |
| $E_{\mathrm{trap}}$       | Trap energy to dislodge particle from voxel  | param. | J         |

### 6. CDE-EVL Model Parameters

| Symbol                       | Meaning                                      | Type   | Units     |
| ---------------------------- | -------------------------------------------- | ------ | --------- |
| $A(z)$                      | Activity kernel (unit peak)                 | function | —         |
| $E(z)$                      | Early chemistry gate                         | function | —         |
| $S(z)$                      | Percolation suppression factor               | function | —         |
| $D_0$                       | Diffusion scale (fitted parameter)          | param. | $m^2\cdot s^{-1}$ |
| $B$                         | Reaction normalization (fitted parameter)    | param. | $s^{-1}$  |
| $z_{\text{on}}, z_{\text{off}}$ | Early chemistry transition redshifts    | param. | —         |
| $k_{\text{chem}}$          | Chemistry transition steepness               | param. | —         |
| $z_t, w_t$                  | 2D→3D crossover redshift and width          | param. | —         |
| $p_{2D}, p_{3D}$            | Percolation thresholds (2D/3D)              | param. | —         |
| $\beta_{2D}, \beta_{3D}$   | Critical exponents (2D/3D)                   | param. | —         |
| $\alpha_{\text{hi}}, \alpha_{\text{lo}}$ | Diffusion power law exponents      | param. | —         |
| $z_{\text{break}}$         | Diffusion transition redshift               | param. | —         |
| $\lambda_{\text{obs}}$     | Observed pattern scales                      | data   | Mly       |

---

## Constants & Typical Numerical References

| Symbol      | Value                                                  |
| ----------- | ------------------------------------------------------ |
| $c$       | $2.99792458\times 10^8$ m·s⁻¹ (exact)    |
| $k_B$    | $1.380649\times 10^{-23}$ J·K⁻¹ (exact)  |
| $\hbar$   | $1.054571817\times 10^{-34}$ J·s          |
| $G$       | $6.67430\times 10^{-11}$ m³·kg⁻¹·s⁻²     |
| $\ell_P$ | $1.616255\times 10^{-35}$ m               |
| $t_P$    | $5.391247\times 10^{-44}$ s               |
| $\Omega_{m0}$ | $0.315$ (matter density parameter)    |
| $\Omega_{\Lambda 0}$ | $0.685$ (dark energy density)  |
| $H_0$    | $67.4$ km·s⁻¹·Mpc⁻¹ (Hubble constant)     |
| $p_c$    | $0.45$ (percolation threshold)            |
| $p_{2D}$ | $0.5000$ (2D percolation threshold)       |
| $p_{3D}$ | $0.2488$ (3D percolation threshold)       |
| $\beta_{2D}$ | $0.1600$ (2D critical exponent)       |
| $\beta_{3D}$ | $0.41$ (3D critical exponent)           |
| $\beta_0$ | $5.6234 \times 10^{-18}$ s⁻¹ (reaction norm.) |
| $z_c$ | $5.3$ (peak reaction redshift) |
| $w$ | $1.279$ (reaction epoch width) |
| $q$ | $1.2$ (power-law scaling) |

---

## Typographic Notes & LaTeX Snippets

* **Vectors:** $\mathbf{v}$, $\boldsymbol{\alpha}$
* **Operators:** $\mathcal{O}$, instances $\hat{o}$
* **Fields:** $\phi(\mathbf{x},t)$, gradient $\nabla\phi$, Laplacian $\nabla^2\phi$
* **Percolation threshold:** $p_c = 0.45$
* **Planck-scale lattice:** $c = \ell_v/\tau_v$

**Example block (copy/paste ready):**

$$
\textbf{SEC:}\quad \mathrm{SEC} = \dfrac{\mathcal{O}\,\cdot\,\mathbf{V}}{1+\eta},
\qquad f(\eta)=\dfrac{1}{1+\eta},
\qquad EG = 1 - \dfrac{\mathbf{a}\cdot\mathbf{c}}{\lVert\mathbf{a}\rVert\,\lVert\mathbf{c}\rVert}.
$$

---

## Versioning

* v1.0 — Initial consolidated notation for review.
* v1.1 — Added EVL-specific extensions.
* v1.2 — Updated CDE-EVL model parameters, added collision theory constants, corrected percolation formulas and parameter values to match implementation.
