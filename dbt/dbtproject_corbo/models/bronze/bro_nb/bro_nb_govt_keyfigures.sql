with stg_nb_govt_keyfigures as (

    select * from {{ source('stg_nb', 'stg_nb_govt_keyfigures') }}

),

bro_nb_govt_keyfigures as (

select
    "UNIT_MEASURE",
    "QUARTER",
    "FREQ",
    "INSTRUMENT_TYPE",
    "TIME_PERIOD",
    "OBS_VALUE"
from stg_nb_govt_keyfigures

)

select * from bro_nb_govt_keyfigures
