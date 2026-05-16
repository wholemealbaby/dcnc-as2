# Skill: Add RMIT Harvard Citations to `main.py` Sections 1-4 & Report Files

## Description

When adding or updating citations in [`main.py`](../main.py) (Sections 1-4) and corresponding files in [`notebook-content/sections/`](../notebook-content/sections/), all references must follow the **RMIT Harvard author-date style** as defined in [`docs/rmit-harvard-citation-guideline.md`](../docs/rmit-harvard-citation-guideline.md). This skill ensures every decision justification includes a corresponding reference, citations are formatted correctly, and a reference list is maintained.

---

## 1. Citation Style Rules (RMIT Harvard)

### 1.1 In-Text Citation Format

| Scenario | Format | Example |
|----------|--------|---------|
| Paraphrasing (end of sentence) | `(Author Year)` | `... (Giglio et al. 2016).` |
| Paraphrasing (author in sentence) | `Author (Year)` | `Giglio et al. (2016) explain that ...` |
| Two authors | `(Author and Author Year)` | `... (Schroeder and Giglio 2018).` |
| Three or more authors | `(Author et al. Year)` | `... (Giglio et al. 2016).` |
| Multiple sources | `(Author Year; Author Year)` | `... (Giglio et al. 2016; Schroeder and Giglio 2018).` |
| Organisation as author | `(Organisation Year)` | `... (NASA 2023).` |
| No date | `(Author n.d.)` | `... (Wotton n.d.).` |

### 1.2 Reference List Format

Entries appear in a **References** section at the end, alphabetically by author surname:

```
Author Surname, Initials Year *Title*, Publisher, accessed Day Month Year. URL
```

**Examples:**

```
Giglio L, Schroeder W and Justice CO 2016, 'The collection 6 MODIS active fire detection algorithm and fire products', *Remote Sensing of Environment*, vol. 178, pp. 31-41, accessed 3 May 2026. https://doi.org/10.1016/j.rse.2016.02.054

Prajapati A 2025, 'Understanding Decision Trees: A Complete Guide', *Medium*, accessed 13 May 2026. https://medium.com/@prajapatiashish3180/understanding-decision-trees-a-complete-guide-7cbcc2fb8ca8

Schroeder W and Giglio L 2018, 'NASA VIIRS Land Surface Active Fire Product', *NASA Technical Report*, accessed 3 May 2026. https://viirsland.gsfc.nasa.gov/PDF/VIIRS_activefire_User_Guide.pdf
```

### 1.3 Prohibited Characters

- **Do not use em dashes** (`---` or `--` or Unicode `--`) in markdown cells. Replace with colons, semicolons, or restructured sentences.
- The only allowed `---` is the horizontal rule divider in its own `# %% [markdown]` cell.

---

## 2. Citation Integration Pattern for `main.py`

Each subsection in Sections 1-4 follows the **Title-Code-Observations-Divider** pattern (see [`.agents/main-py-notebook-pattern.skill.md`](main-py-notebook-pattern.skill.md)). Citations must be placed in the **Observations cell** (`# %% [markdown]`) as part of the analytical text.

### 2.1 Where to Place Citations

| Cell Type | Citation Placement |
|-----------|-------------------|
| **Title cell** (`# %% [markdown]`) | No citations. Heading only. |
| **Code cell** (`# %%`) | No citations. Code only. |
| **Observations cell** (`# %% [markdown]`) | **Yes** — inline citations in analytical text. |
| **Divider** (`# %% [markdown]` with `---`) | No citations. Separator only. |

### 2.2 Citation Placement in Observations

Citations should appear inline within the analytical text, not as footnotes or endnotes. Every **decision justification** must include a reference.

**Correct example:**

```markdown
# %% [markdown]
# ### Observations: 4.3 Chosen Strategy Justification
#
# Median imputation is selected for numeric columns due to its robustness
# to the right skew observed in `wind_max_kmh` (skewness = 1.79) and
# `brightness_k` (skewness = 1.21) (Little and Rubin 2019).
# For `month`, median (7 = July) avoids seasonal bias that mode imputation
# (1 = January) would introduce (van Buuren 2018).
```

### 2.3 Decision Justification Checklist

For each observation in Sections 1-4, verify that **every decision** has a corresponding citation:

| Section | Decision Points | Suggested Reference Topics |
|---------|----------------|---------------------------|
| **1. Data Loading** | Dtype specification, memory efficiency, missing value detection, class imbalance, anomaly detection | Pandas documentation; data type optimisation; missing data mechanisms; class imbalance |
| **2. Univariate EDA** | Distribution shape analysis, skewness/kurtosis interpretation, outlier detection (IQR method), categorical balance assessment | Statistical distribution analysis; IQR method; skewness interpretation; EDA methodology |
| **3. Bivariate EDA** | Correlation heatmap interpretation, box plot analysis, point-biserial correlation, Cramér's V, feature selection | Correlation analysis; effect size measures; feature selection methodology |
| **4. Missing Values** | Missingness mechanism (MCAR/MAR/MNAR), imputation strategy comparison, median vs mean vs mode, data leakage prevention | Missing data theory; imputation methodology; data leakage prevention |

---

## 3. Citation Integration Pattern for `notebook-content/sections/` Files

Files in [`notebook-content/sections/`](../notebook-content/sections/) contain the written report content corresponding to each section of the notebook. Citations in these files follow the same RMIT Harvard style but use standard Markdown (no `# %%` cell markers).

### 3.1 In-Text Citations in Report Files

```markdown
The dataset exhibits moderate class imbalance, with the Moderate class
dominating at 44.3% while Extreme is the least represented at 8.8%
(Giglio et al. 2016). This imbalance necessitates careful evaluation
metric selection, as accuracy alone would be misleading (He and Ma 2013).
```

### 3.2 Reference List in Report Files

Each report section file may include its own references, OR a consolidated reference list can be maintained in [`notebook-content/references.md`](../notebook-content/references.md). The preferred approach is a **single consolidated reference list** at [`notebook-content/references.md`](../notebook-content/references.md).

---

## 4. Cross-File Citation Consistency

Citations must be consistent across both [`main.py`](../main.py) and [`notebook-content/sections/`](../notebook-content/sections/) files:

1. **Same source, same citation format** — A source cited as `(Giglio et al. 2016)` in `main.py` must use the same format in report files.
2. **Single reference list** — All sources cited across both locations must appear in [`notebook-content/references.md`](../notebook-content/references.md).
3. **No orphan citations** — Every in-text citation must have a corresponding entry in the reference list, and every reference list entry must be cited at least once.

---

## 5. Automatic Validation Checklist

Before completing work on citations, run through this checklist:

### 5.1 Per-Subsection Check

- [ ] Every decision justification in the Observations cell has at least one inline citation.
- [ ] Citations use correct RMIT Harvard format: `(Author Year)` or `Author (Year)`.
- [ ] Three+ authors use `et al.` format.
- [ ] Two authors use `and` between names.
- [ ] No em dashes used in markdown text.
- [ ] Citations are integrated naturally into the sentence, not tacked on.

### 5.2 Cross-File Check

- [ ] All citations in `main.py` Sections 1-4 have matching entries in `notebook-content/references.md`.
- [ ] All citations in `notebook-content/sections/` files have matching entries in `notebook-content/references.md`.
- [ ] No orphan citations exist (cited in text but missing from reference list).
- [ ] No orphan references exist (in reference list but never cited in text).

### 5.3 Reference List Check

- [ ] Reference list is alphabetically ordered by author surname.
- [ ] Each entry follows RMIT Harvard format: `Author Year, *Title*, Publisher, accessed Date. URL`.
- [ ] Journal articles include volume, issue, and page numbers where available.
- [ ] URLs are accessible and correctly formatted.
- [ ] Access dates are current and consistent.

---

## 6. Suggested Reference Sources for Sections 1-4

Below are reference categories relevant to each section. Actual references should be sourced from the provided documentation and academic literature.

| Section | Suggested Reference Topics |
|---------|--------------------------|
| **1. Data Loading** | Pandas/pyarrow documentation; McKinney (2017) *Python for Data Analysis*; missing data mechanisms (Little and Rubin 2019) |
| **2. Univariate EDA** | Tukey (1977) *Exploratory Data Analysis*; IQR outlier method; distribution analysis (skewness/kurtosis) |
| **3. Bivariate EDA** | Correlation analysis (Pearson, point-biserial); Cramér's V (Cramér 1946); feature selection (Guyon and Elisseeff 2003) |
| **4. Missing Values** | Little and Rubin (2019) *Statistical Analysis with Missing Data*; van Buuren (2018) *Flexible Imputation of Missing Data*; data leakage (Kaufman et al. 2012) |

---

## 7. Example: Citation-Enhanced Observations Cell

Here is a complete example showing how a citation-enhanced Observations cell should look:

```markdown
# %% [markdown]
# ### Observations: 4.3 Chosen Strategy Justification
#
# The final imputation strategy applies median imputation for numeric
# columns (`brightness_k`, `wind_max_kmh`) and ordinal columns (`month`),
# and most-frequent (mode) imputation for categorical columns.
#
# **Numeric columns (`brightness_k`, `wind_max_kmh`):** Median imputation
# is chosen because both features exhibit right skew (skewness 1.21 and
# 1.79 respectively). The median is robust to the outliers present in
# these features, whereas the mean would be pulled upward by extreme
# values (Little and Rubin 2019). This aligns with best practices for
# handling skewed data in environmental datasets (van Buuren 2018).
#
# **Ordinal column (`month`):** Median (7 = July) is preferred over mode
# (1 = January) to avoid seasonal bias. If missing months are not
# predominantly January, mode imputation would systematically shift the
# distribution toward a single month (van Buuren 2018).
#
# **Categorical columns:** Most-frequent (mode) imputation is the only
# valid strategy for string-typed nominal data, as mean and median are
# undefined (Little and Rubin 2019).
#
# **Row deletion rejected:** Discarding up to 950 rows (21.9% of training
# data) for only 1.09% missing cells would constitute an unacceptable
# loss of statistical power (Graham 2009).
#
# **Data leakage prevention:** The imputer is fitted exclusively on the
# training set and then applied to transform validation and test sets.
# This ensures no information from held-out data influences imputation
# values (Kaufman et al. 2012).
```

---

## 8. Source

This skill is designed to work alongside [`.agents/main-py-notebook-pattern.skill.md`](main-py-notebook-pattern.skill.md). The RMIT Harvard citation guidelines are documented in [`docs/rmit-harvard-citation-guideline.md`](../docs/rmit-harvard-citation-guideline.md). The target sections for citation enhancement are:

- Section 1 (Data Loading & Initial Inspection): [`main.py`](../main.py:69)
- Section 2 (Univariate EDA): [`main.py`](../main.py:446)
- Section 3 (Bivariate EDA & Feature-Target Correlations): [`main.py`](../main.py:741)
- Section 4 (Handling Missing Values): [`main.py`](../main.py:976)

Supporting documentation for each section is available in [`docs/`](../docs/):
- [`docs/data_loading.md`](../docs/data_loading.md)
- [`docs/univariate-eda.md`](../docs/univariate-eda.md)
- [`docs/bivariate-eda.md`](../docs/bivariate-eda.md)
- [`docs/missing-value-analysis.md`](../docs/missing-value-analysis.md)
