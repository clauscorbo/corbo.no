SELECT
    order_id,
    customer_name,
    product,
    quantity,
    unit_price,
    quantity * unit_price AS total_amount,
    order_date,
    status
FROM {{ ref('bro_orders') }}
WHERE status != 'cancelled'
