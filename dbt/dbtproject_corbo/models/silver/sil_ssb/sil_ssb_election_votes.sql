WITH
  bro AS (
    SELECT
      "region",
      "political parties",
      "contents",
      "every 4th year",
      "value"
    FROM
      {{ ref('bro_ssb_08092') }}
  ),
  cleaned AS (
    SELECT
      "region"                        AS region,
      "political parties"             AS party,
      "every 4th year"::integer       AS election_year,
      "contents"                      AS contents,
      "value"::numeric                AS value
    FROM
      bro
  ),
  sil_ssb_election_votes AS (
    SELECT
      region,
      party,
      election_year,
      max(CASE WHEN contents = 'Valid votes'              THEN value END) AS valid_votes,
      max(CASE WHEN contents = 'Valid votes (per cent)'   THEN value END) AS valid_votes_pct
    FROM
      cleaned
    GROUP BY
      region, party, election_year
  )
SELECT
  region,
  party,
  election_year,
  valid_votes,
  valid_votes_pct
FROM
  sil_ssb_election_votes
ORDER BY
  election_year, region, party
