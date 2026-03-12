SELECT
    order_id,
    customer_name,
    product,
    quantity,
    unit_price,
    order_date::DATE AS order_date,
    status
FROM {{ source('staging', 'orders') }}
