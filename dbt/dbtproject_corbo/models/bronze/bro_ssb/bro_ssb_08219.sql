with stg_ssb_08219 as (

    select * from {{ source('stg_ssb', 'stg_ssb_08219') }}

),

bro_ssb_08219 AS (

select
    "region",
    "kjønn",
    "politisk parti",
    "statistikkvariabel",
    "fireårlig",
    "value"
from stg_ssb_08219

)

SELECT * FROM bro_ssb_08219
