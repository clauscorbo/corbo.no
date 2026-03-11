SELECT
    product,
    COUNT(*) AS times_ordered,
    SUM(quantity) AS total_quantity_sold,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS avg_order_amount
FROM {{ ref('sil_orders') }}
GROUP BY product
