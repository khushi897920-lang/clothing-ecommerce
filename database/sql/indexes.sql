-- Clothing E-Commerce Platform: Indexes
-- Run after init.sql. Skips indexes Postgres already creates automatically
-- for PRIMARY KEY / UNIQUE columns (users.email, product_variants.sku, etc.)

-- ===== Regular indexes =====
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_audience ON products(audience);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_is_active ON products(is_active);

CREATE INDEX idx_variants_product ON product_variants(product_id);

CREATE INDEX idx_product_images_product ON product_images(product_id);

CREATE INDEX idx_addresses_user ON addresses(user_id);

CREATE INDEX idx_wishlist_user ON wishlist_items(user_id);

CREATE INDEX idx_carts_user_status ON carts(user_id, status);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ===== Partial unique indexes (business rules, not just performance) =====
CREATE UNIQUE INDEX one_primary_image_per_product
ON product_images(product_id)
WHERE is_primary = TRUE;

CREATE UNIQUE INDEX one_default_address_per_user
ON addresses(user_id)
WHERE is_default = TRUE;

CREATE UNIQUE INDEX one_active_cart_per_user
ON carts(user_id)
WHERE status = 'ACTIVE';
