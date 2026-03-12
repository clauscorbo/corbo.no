WITH
  bro AS (
    SELECT
      "political parties",
      "level of education",
      "sex",
      "contents",
      "every 4th year",
      "value"
    FROM
      {{ ref('bro_ssb_13555') }}
  ),
  sil_ssb_election_party_support AS (
    SELECT
      "political parties"             AS party,
      "level of education"            AS education_level,
      "sex"                           AS sex,
      "every 4th year"::integer       AS election_year,
      "value"::numeric                AS support_pct
    FROM
      bro
  )
SELECT
  party,
  education_level,
  sex,
  election_year,
  support_pct
FROM
  sil_ssb_election_party_support
ORDER BY
  election_year, party, education_level, sex
