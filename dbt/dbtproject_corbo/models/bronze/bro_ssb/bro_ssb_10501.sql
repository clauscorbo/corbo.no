with stg_ssb_10501 as (

    select * from {{ source('stg_ssb', 'stg_ssb_10501') }}

),

bro_ssb_10501 AS (

select
    "first name",
    "contents",
    "year",
    "value"
from stg_ssb_10501

)

SELECT * FROM bro_ssb_10501
