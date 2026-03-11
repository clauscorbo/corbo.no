SELECT
    c.customer_name,
    c.first_order_date,
    c.last_order_date,
    c.total_orders,
    COALESCE(SUM(o.total_amount), 0) AS total_revenue,
    COALESCE(AVG(o.total_amount), 0) AS avg_order_value
FROM {{ ref('sil_customers') }} c
LEFT JOIN {{ ref('sil_orders') }} o
    ON c.customer_name = o.customer_name
GROUP BY
    c.customer_name,
    c.first_order_date,
    c.last_order_date,
    c.total_orders
