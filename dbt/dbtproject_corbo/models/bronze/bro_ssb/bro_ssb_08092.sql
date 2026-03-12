with stg_ssb_08092 as (

    select * from {{ source('stg_ssb', 'stg_ssb_08092') }}

),

bro_ssb_08092 AS (

select
    "region",
    "politisk parti",
    "statistikkvariabel",
    "fireårlig",
    "value"
from stg_ssb_08092

)

SELECT * FROM bro_ssb_08092
