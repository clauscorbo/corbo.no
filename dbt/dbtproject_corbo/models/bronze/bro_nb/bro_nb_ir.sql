with stg_nb_ir as (

    select * from {{ source('stg_nb', 'stg_nb_ir') }}

),

bro_nb_ir as (

select
    "FREQ",
    "INSTRUMENT_TYPE",
    "TENOR",
    "UNIT_MEASURE",
    "TIME_PERIOD",
    "OBS_VALUE"
from stg_nb_ir

)

select * from bro_nb_ir
