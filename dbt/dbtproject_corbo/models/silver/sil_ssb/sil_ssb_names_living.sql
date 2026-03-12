WITH
  bro AS (
    SELECT
      "first name",
      "contents",
      "year",
      "value"
    FROM
      {{ ref('bro_ssb_10501') }}
  ),
  sil_ssb_names_living AS (
    SELECT
      "first name"                    AS first_name,
      "year"::integer                 AS year,
      "value"::integer                AS persons
    FROM
      bro
  )
SELECT
  first_name,
  year,
  persons
FROM
  sil_ssb_names_living
ORDER BY
  year, first_name
