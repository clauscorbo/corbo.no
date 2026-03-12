with stg_ssb_09624 as (

    select * from {{ source('stg_ssb', 'stg_ssb_09624') }}

),

bro_ssb_09624 AS (

select
    "politisk parti",
    "kjønn",
    "statistikkvariabel",
    "fireårlig",
    "value"
from stg_ssb_09624

)

SELECT * FROM bro_ssb_09624
