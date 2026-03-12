WITH
  bro_ssb_05803 AS (
    SELECT
      bro_ssb_05803.contents,
      bro_ssb_05803.year,
      bro_ssb_05803.value
    FROM
      {{ref('bro_ssb_05803')}}
  ),
  cleaned AS (
    SELECT
      bro_ssb_05803.year::integer AS year,
      bro_ssb_05803.contents,
      bro_ssb_05803.value::numeric AS value
    FROM
      bro_ssb_05803
  ),
  sil_ssb_population AS (
    SELECT
      cleaned.year,
      max(
        CASE
          WHEN cleaned.contents = 'Population 1 January'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS population_jan1,
      max(
        CASE
          WHEN cleaned.contents = 'Livebirths, total'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS livebirths_total,
      max(
        CASE
          WHEN cleaned.contents = 'Livebirths out of wedlock'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS livebirths_out_of_wedlock,
      max(
        CASE
          WHEN cleaned.contents = 'Late fetal deaths'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS late_fetal_deaths,
      max(
        CASE
          WHEN cleaned.contents = 'Death, total'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS deaths_total,
      max(
        CASE
          WHEN cleaned.contents = 'Death under 1 year'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS deaths_under_1yr,
      max(
        CASE
          WHEN cleaned.contents = 'Marriages contracted'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS marriages_contracted,
      max(
        CASE
          WHEN cleaned.contents = 'Divorces'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS divorces,
      max(
        CASE
          WHEN cleaned.contents = 'In-migration'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS in_migration,
      max(
        CASE
          WHEN cleaned.contents = 'Emigration'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS emigration,
      max(
        CASE
          WHEN cleaned.contents = 'Livebirth (per 1000)'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS livebirth_rate_per_1000,
      max(
        CASE
          WHEN cleaned.contents = 'Death (per 1000)'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS death_rate_per_1000,
      max(
        CASE
          WHEN cleaned.contents = 'Population increase, absolute figures'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS population_increase_abs,
      max(
        CASE
          WHEN cleaned.contents = 'Population increase (per cent)'::text THEN cleaned.value
          ELSE NULL::numeric
        END
      ) AS population_increase_pct
    FROM
      cleaned
    GROUP BY
      cleaned.year
  )
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
  sil_ssb_population
ORDER BY
  year