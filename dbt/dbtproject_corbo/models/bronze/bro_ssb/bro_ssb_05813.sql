with stg_ssb_05813 as (

    select * from {{ source('stg_ssb', 'stg_ssb_05813') }}

),

bro_ssb_05813 AS (

select
    "kjønn",
    "sivilstand",
    "statistikkvariabel",
    "år",
    "value"
from stg_ssb_05813

)

SELECT * FROM bro_ssb_05813
