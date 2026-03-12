-- Norwegian national parliamentary election (Stortingsvalget)
-- Grain: election_year × party
-- Survey-based voter percentages and party support by education level,
-- with sex pivoted into columns. Covers the ~10 major parties in SSB surveys.

WITH
  voters AS (
    SELECT
      election_year,
      party,
      sex,
      voters_pct
    FROM
      {{ ref('sil_ssb_election_voters') }}
  ),

  support AS (
    SELECT
      election_year,
      party,
      sex,
      max(CASE WHEN education_level = 'Basic school level'        THEN support_pct END) AS support_pct_basic,
      max(CASE WHEN education_level = 'Upper secondary level'     THEN support_pct END) AS support_pct_upper_secondary,
      max(CASE WHEN education_level = 'Higher education, short'   THEN support_pct END) AS support_pct_higher_short,
      max(CASE WHEN education_level = 'Higher education, long'    THEN support_pct END) AS support_pct_higher_long
    FROM
      {{ ref('sil_ssb_election_party_support') }}
    GROUP BY
      election_year, party, sex
  ),

  combined AS (
    SELECT
      coalesce(v.election_year, s.election_year) AS election_year,
      coalesce(v.party, s.party)                 AS party,
      coalesce(v.sex, s.sex)                     AS sex,
      v.voters_pct,
      s.support_pct_basic,
      s.support_pct_upper_secondary,
      s.support_pct_higher_short,
      s.support_pct_higher_long
    FROM
      voters v
    FULL OUTER JOIN support s
      ON  v.election_year = s.election_year
      AND v.party         = s.party
      AND v.sex           = s.sex
  ),

  gol_fact_election_voters AS (
    SELECT
      election_year,
      party,

      -- Voter percentage by sex
      max(CASE WHEN sex = 'Both sexes' THEN voters_pct END) AS voters_pct,
      max(CASE WHEN sex = 'Males'      THEN voters_pct END) AS voters_pct_male,
      max(CASE WHEN sex = 'Females'    THEN voters_pct END) AS voters_pct_female,

      -- Support by education — total
      max(CASE WHEN sex = 'Both sexes' THEN support_pct_basic             END) AS support_pct_basic,
      max(CASE WHEN sex = 'Both sexes' THEN support_pct_upper_secondary   END) AS support_pct_upper_secondary,
      max(CASE WHEN sex = 'Both sexes' THEN support_pct_higher_short      END) AS support_pct_higher_short,
      max(CASE WHEN sex = 'Both sexes' THEN support_pct_higher_long       END) AS support_pct_higher_long,

      -- Support by education — male
      max(CASE WHEN sex = 'Males'      THEN support_pct_basic             END) AS support_pct_basic_male,
      max(CASE WHEN sex = 'Males'      THEN support_pct_upper_secondary   END) AS support_pct_upper_secondary_male,
      max(CASE WHEN sex = 'Males'      THEN support_pct_higher_short      END) AS support_pct_higher_short_male,
      max(CASE WHEN sex = 'Males'      THEN support_pct_higher_long       END) AS support_pct_higher_long_male,

      -- Support by education — female
      max(CASE WHEN sex = 'Females'    THEN support_pct_basic             END) AS support_pct_basic_female,
      max(CASE WHEN sex = 'Females'    THEN support_pct_upper_secondary   END) AS support_pct_upper_secondary_female,
      max(CASE WHEN sex = 'Females'    THEN support_pct_higher_short      END) AS support_pct_higher_short_female,
      max(CASE WHEN sex = 'Females'    THEN support_pct_higher_long       END) AS support_pct_higher_long_female
    FROM
      combined
    GROUP BY
      election_year, party
  )
SELECT
  election_year,
  party,
  voters_pct,
  voters_pct_male,
  voters_pct_female,
  support_pct_basic,
  support_pct_upper_secondary,
  support_pct_higher_short,
  support_pct_higher_long,
  support_pct_basic_male,
  support_pct_upper_secondary_male,
  support_pct_higher_short_male,
  support_pct_higher_long_male,
  support_pct_basic_female,
  support_pct_upper_secondary_female,
  support_pct_higher_short_female,
  support_pct_higher_long_female
FROM
  gol_fact_election_voters
ORDER BY
  election_year, party
