-- Norwegian national parliamentary election (Stortingsvalget)
-- Grain: election_year × region × party
-- Official results: votes cast and seats won per party in each
-- electoral district. Every column is a hard fact from the same event.

WITH
  votes AS (
    SELECT
      election_year,
      region,
      party,
      valid_votes,
      valid_votes_pct
    FROM
      {{ ref('sil_ssb_election_votes') }}
  ),

  region_totals AS (
    SELECT
      election_year,
      region,
      sum(valid_votes)                AS region_total_votes
    FROM
      {{ ref('sil_ssb_election_votes') }}
    GROUP BY
      election_year, region
  ),

  representatives AS (
    SELECT
      election_year,
      region,
      party,
      sum(CASE WHEN sex = 'Males'   THEN representatives END) AS representatives_male,
      sum(CASE WHEN sex = 'Females' THEN representatives END) AS representatives_female,
      sum(representatives)                                     AS representatives_total
    FROM
      {{ ref('sil_ssb_election_representatives') }}
    GROUP BY
      election_year, region, party
  ),

  gol_fact_election AS (
    SELECT
      v.election_year,
      v.region,
      v.party,
      v.valid_votes,
      v.valid_votes_pct,
      rt.region_total_votes,
      r.representatives_male,
      r.representatives_female,
      r.representatives_total,
      rank() OVER (
        PARTITION BY v.election_year, v.region
        ORDER BY v.valid_votes DESC NULLS LAST
      ) AS party_rank_in_region
    FROM
      votes v
    LEFT JOIN representatives r
      ON  v.election_year = r.election_year
      AND v.region        = r.region
      AND v.party         = r.party
    LEFT JOIN region_totals rt
      ON  v.election_year = rt.election_year
      AND v.region        = rt.region
  )
SELECT
  election_year,
  region,
  party,
  valid_votes,
  valid_votes_pct,
  region_total_votes,
  representatives_male,
  representatives_female,
  representatives_total,
  party_rank_in_region
FROM
  gol_fact_election
WHERE
  valid_votes IS NOT NULL
ORDER BY
  election_year, region, party_rank_in_region
