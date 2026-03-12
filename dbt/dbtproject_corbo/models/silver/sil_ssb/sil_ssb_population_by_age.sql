WITH
  bro AS (
    SELECT
      "age",
      "sex",
      "contents",
      "year",
      "value"
    FROM
      {{ ref('bro_ssb_10211') }}
  ),
  sil_ssb_population_by_age AS (
    SELECT
      "year"::integer                 AS year,
      "age"                           AS age,
      "sex"                           AS sex,
      "value"::integer                AS persons
    FROM
      bro
  )
SELECT
  year,
  age,
  sex,
  persons
FROM
  sil_ssb_population_by_age
ORDER BY
  year, age, sex
