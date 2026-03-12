with stg_ssb_05803 as (

    select * from {{ source('stg_ssb', 'stg_ssb_05803') }}

),

bro_ssb_05803 AS (

select
    "statistikkvariabel",
    "år",
    "value"
from stg_ssb_05803

)

SELECT * FROM bro_ssb_05803
