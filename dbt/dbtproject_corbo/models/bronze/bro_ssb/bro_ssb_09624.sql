with stg_ssb_09624 as (

    select * from {{ source('stg_ssb', 'stg_ssb_09624') }}

),

bro_ssb_09624 AS (

select
    "political parties",
    "sex",
    "contents",
    "every 4th year",
    "value"
from stg_ssb_09624

)

SELECT * FROM bro_ssb_09624
