SELECT
    party_code,
    party_name,
    year,
    region_code,
    region_name,
    votes,
    loaded_at
FROM {{ source('stg_ssb', 'stg_ssb_08092') }}
