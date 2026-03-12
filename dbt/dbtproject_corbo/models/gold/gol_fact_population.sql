-- Grain: year × sex
-- Combines national demographic stats, age-band population counts,
-- and marital-status population counts into a single wide fact table.

WITH
  -- National-level demographic stats (one row per year, no sex breakdown)
  national AS (
    SELECT
      year,
      population_jan1,
      livebirths_total,
      livebirths_out_of_wedlock,
      late_fetal_deaths,
      deaths_total,
      deaths_under_1yr,
      marriages_contracted,
      divorces,
      in_migration,
      emigration,
      livebirth_rate_per_1000,
      death_rate_per_1000,
      population_increase_abs,
      population_increase_pct
    FROM
      {{ ref('sil_ssb_population') }}
  ),

  -- Population by age → summarised into bands per year × sex
  age_bands AS (
    SELECT
      year,
      sex,
      sum(CASE WHEN age BETWEEN '0' AND '17'  THEN persons END) AS persons_0_17,
      sum(CASE WHEN age BETWEEN '18' AND '29' THEN persons END) AS persons_18_29,
      sum(CASE WHEN age BETWEEN '30' AND '49' THEN persons END) AS persons_30_49,
      sum(CASE WHEN age BETWEEN '50' AND '66' THEN persons END) AS persons_50_66,
      sum(CASE WHEN age >= '67'               THEN persons END) AS persons_67_plus,
      sum(persons)                                               AS persons_total
    FROM
      {{ ref('sil_ssb_population_by_age') }}
    GROUP BY
      year, sex
  ),

  -- Population by marital status → pivoted per year × sex
  marital AS (
    SELECT
      year,
      sex,
      sum(CASE WHEN marital_status = 'Unmarried'              THEN persons END) AS persons_unmarried,
      sum(CASE WHEN marital_status = 'Married'                THEN persons END) AS persons_married,
      sum(CASE WHEN marital_status = 'Widowed/widower'        THEN persons END) AS persons_widowed,
      sum(CASE WHEN marital_status = 'Divorced'               THEN persons END) AS persons_divorced,
      sum(CASE WHEN marital_status = 'Separated'              THEN persons END) AS persons_separated,
      sum(CASE WHEN marital_status = 'Registered partner'     THEN persons END) AS persons_reg_partner,
      sum(CASE WHEN marital_status = 'Separated partner'      THEN persons END) AS persons_sep_partner,
      sum(CASE WHEN marital_status = 'Surviving partner'      THEN persons END) AS persons_surv_partner
    FROM
      {{ ref('sil_ssb_population_by_marital_status') }}
    GROUP BY
      year, sex
  ),

  gol_fact_population AS (
    SELECT
      a.year,
      a.sex,

      -- age-band counts
      a.persons_0_17,
      a.persons_18_29,
      a.persons_30_49,
      a.persons_50_66,
      a.persons_67_plus,
      a.persons_total,

      -- marital-status counts
      m.persons_unmarried,
      m.persons_married,
      m.persons_widowed,
      m.persons_divorced,
      m.persons_separated,
      m.persons_reg_partner,
      m.persons_sep_partner,
      m.persons_surv_partner,

      -- national demographic stats (same for both sexes)
      n.population_jan1,
      n.livebirths_total,
      n.livebirths_out_of_wedlock,
      n.late_fetal_deaths,
      n.deaths_total,
      n.deaths_under_1yr,
      n.livebirths_total - n.deaths_total   AS natural_growth,
      n.livebirth_rate_per_1000,
      n.death_rate_per_1000,
      n.marriages_contracted,
      n.divorces,
      n.in_migration,
      n.emigration,
      n.in_migration - n.emigration         AS net_migration,
      n.population_increase_abs,
      n.population_increase_pct
    FROM
      age_bands a
    LEFT JOIN marital m
      ON  a.year = m.year
      AND a.sex  = m.sex
    LEFT JOIN national n
      ON  a.year = n.year
  )
SELECT
  year,
  sex,
  persons_0_17,
  persons_18_29,
  persons_30_49,
  persons_50_66,
  persons_67_plus,
  persons_total,
  persons_unmarried,
  persons_married,
  persons_widowed,
  persons_divorced,
  persons_separated,
  persons_reg_partner,
  persons_sep_partner,
  persons_surv_partner,
  population_jan1,
  livebirths_total,
  livebirths_out_of_wedlock,
  late_fetal_deaths,
  deaths_total,
  deaths_under_1yr,
  natural_growth,
  livebirth_rate_per_1000,
  death_rate_per_1000,
  marriages_contracted,
  divorces,
  in_migration,
  emigration,
  net_migration,
  population_increase_abs,
  population_increase_pct
FROM
  gol_fact_population
ORDER BY
  year, sex
