-- Grain: year × first_name
-- Combines born-count and living-count for each name per year.
-- Adds popularity rankings and year-over-year changes.

WITH
  born AS (
    SELECT
      first_name,
      year,
      born_persons,
      born_persons_pct
    FROM
      {{ ref('sil_ssb_names_born') }}
  ),

  living AS (
    SELECT
      first_name,
      year,
      persons                         AS living_persons
    FROM
      {{ ref('sil_ssb_names_living') }}
  ),

  combined AS (
    SELECT
      coalesce(b.first_name, l.first_name)  AS first_name,
      coalesce(b.year, l.year)              AS year,
      b.born_persons,
      b.born_persons_pct,
      l.living_persons
    FROM
      born b
    FULL OUTER JOIN living l
      ON  b.first_name = l.first_name
      AND b.year       = l.year
  ),

  gol_fact_name AS (
    SELECT
      first_name,
      year,
      born_persons,
      born_persons_pct,
      living_persons,

      -- Year-over-year change in living persons
      living_persons - lag(living_persons) OVER (
        PARTITION BY first_name ORDER BY year
      ) AS living_persons_yoy_change,

      -- Rank by born count within each year
      rank() OVER (
        PARTITION BY year
        ORDER BY born_persons DESC NULLS LAST
      ) AS rank_by_born,

      -- Rank by living count within each year
      rank() OVER (
        PARTITION BY year
        ORDER BY living_persons DESC NULLS LAST
      ) AS rank_by_living
    FROM
      combined
  )
SELECT
  first_name,
  year,
  born_persons,
  born_persons_pct,
  living_persons,
  living_persons_yoy_change,
  rank_by_born,
  rank_by_living
FROM
  gol_fact_name
ORDER BY
  year, first_name
