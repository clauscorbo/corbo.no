with stg_ssb_13555 as (

    select * from {{ source('stg_ssb', 'stg_ssb_13555') }}

),

bro_ssb_13555 AS (

select
    "political parties",
    "level of education",
    "sex",
    "contents",
    "every 4th year",
    "value"
from stg_ssb_13555

)

SELECT * FROM bro_ssb_13555
