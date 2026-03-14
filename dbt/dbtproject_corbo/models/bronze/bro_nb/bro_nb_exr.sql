with stg_nb_exr as (

    select * from {{ source('stg_nb', 'stg_nb_exr') }}

),

bro_nb_exr as (

select
    "FREQ",
    "BASE_CUR",
    "QUOTE_CUR",
    "TENOR",
    "TIME_PERIOD",
    "OBS_VALUE"
from stg_nb_exr

)

select * from bro_nb_exr
