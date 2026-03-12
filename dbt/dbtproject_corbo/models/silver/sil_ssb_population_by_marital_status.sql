WITH
  bro AS (
    SELECT
      "sex",
      "marital status",
      "contents",
      "year",
      "value"
    FROM
      {{ ref('bro_ssb_05813') }}
  ),
  sil_ssb_population_by_marital_status AS (
    SELECT
      "year"::integer                 AS year,
      "sex"                           AS sex,
      "marital status"                AS marital_status,
      "value"::integer                AS persons
    FROM
      bro
  )
SELECT
  year,
  sex,
  marital_status,
  persons
FROM
  sil_ssb_population_by_marital_status
ORDER BY
  year, sex, marital_status
