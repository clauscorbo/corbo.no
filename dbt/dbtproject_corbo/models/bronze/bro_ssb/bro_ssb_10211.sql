with stg_ssb_10211 as (

    select * from {{ source('stg_ssb', 'stg_ssb_10211') }}

),

bro_ssb_10211 AS (

select
    "age",
    "sex",
    "contents",
    "year",
    "value"
from stg_ssb_10211

)

SELECT * FROM bro_ssb_10211
