WITH
  bro AS (
    SELECT
      "political parties",
      "sex",
      "contents",
      "every 4th year",
      "value"
    FROM
      {{ ref('bro_ssb_09624') }}
  ),
  sil_ssb_election_voters AS (
    SELECT
      "political parties"             AS party,
      "sex"                           AS sex,
      "every 4th year"::integer       AS election_year,
      "value"::numeric                AS voters_pct
    FROM
      bro
  )
SELECT
  party,
  sex,
  election_year,
  voters_pct
FROM
  sil_ssb_election_voters
ORDER BY
  election_year, party, sex
