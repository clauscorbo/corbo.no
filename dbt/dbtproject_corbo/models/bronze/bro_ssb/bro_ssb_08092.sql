with stg_ssb_08092 as (

    select * from {{ source('stg_ssb', 'stg_ssb_08092') }}

),

bro_ssb_08092 AS (

select
    "region",
    "political parties",
    "contents",
    "every 4th year",
    "value"
from stg_ssb_08092

)

SELECT * FROM bro_ssb_08092
