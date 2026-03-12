WITH
  bro AS (
    SELECT
      "first name",
      "contents",
      "year",
      "value"
    FROM
      {{ ref('bro_ssb_10467') }}
  ),
  cleaned AS (
    SELECT
      "first name"                    AS first_name,
      "year"::integer                 AS year,
      "contents"                      AS contents,
      "value"::numeric                AS value
    FROM
      bro
  ),
  sil_ssb_names_born AS (
    SELECT
      first_name,
      year,
      max(CASE WHEN contents = 'Born persons'               THEN value END) AS born_persons,
      max(CASE WHEN contents = 'Per cent of born persons'   THEN value END) AS born_persons_pct
    FROM
      cleaned
    GROUP BY
      first_name, year
  )
SELECT
  first_name,
  year,
  born_persons,
  born_persons_pct
FROM
  sil_ssb_names_born
ORDER BY
  year, first_name
