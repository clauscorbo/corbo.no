with stg_ssb_13555 as (

    select * from {{ source('stg_ssb', 'stg_ssb_13555') }}

),

bro_ssb_13555 AS (

select
    "politisk parti",
    "utdanningsnivå",
    "kjønn",
    "statistikkvariabel",
    "fireårlig",
    "value"
from stg_ssb_13555

)

SELECT * FROM bro_ssb_13555
