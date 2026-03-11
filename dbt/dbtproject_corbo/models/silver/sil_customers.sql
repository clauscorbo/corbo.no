SELECT
    DISTINCT customer_name,
    MIN(order_date) AS first_order_date,
    MAX(order_date) AS last_order_date,
    COUNT(*) AS total_orders
FROM {{ ref('bro_orders') }}
GROUP BY customer_name
