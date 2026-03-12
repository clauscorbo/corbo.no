with stg_ssb_10467 as (

    select * from {{ source('stg_ssb', 'stg_ssb_10467') }}

),

bro_ssb_10467 AS (

select
    "first name",
    "contents",
    "year",
    "value"
from stg_ssb_10467

)

SELECT * FROM bro_ssb_10467
