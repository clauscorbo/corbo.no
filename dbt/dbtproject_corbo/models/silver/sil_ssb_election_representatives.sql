WITH
  bro AS (
    SELECT
      "region",
      "sex",
      "political parties",
      "contents",
      "every 4th year",
      "value"
    FROM
      {{ ref('bro_ssb_08219') }}
  ),
  sil_ssb_election_representatives AS (
    SELECT
      "region"                        AS electoral_district,
      "sex"                           AS sex,
      "political parties"             AS party,
      "every 4th year"::integer       AS election_year,
      "value"::integer                AS representatives
    FROM
      bro
  )
SELECT
  electoral_district,
  sex,
  party,
  election_year,
  representatives
FROM
  sil_ssb_election_representatives
ORDER BY
  election_year, electoral_district, party, sex
