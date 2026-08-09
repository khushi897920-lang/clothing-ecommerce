-- Clothing E-Commerce Platform: Initial Database Setup
-- Enums, tables, foreign keys, unique constraints, check constraints, and the
-- updated_at trigger. Indexes (including partial unique indexes) live in indexes.sql.
-- Built + tested step-by-step in pgAdmin against database_plan.pdf.

-- ===== TRIGGER FUNCTION =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- ===== ENUMS =====
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE "ProductAudience" AS ENUM ('MEN', 'WOMEN', 'UNISEX');
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'CONVERTED', 'ABANDONED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE "OrderPaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE "NotificationType" AS ENUM (
  'ORDER_CONFIRMED', 'PAYMENT_CONFIRMED', 'PAYMENT_FAILED',
  'ORDER_SHIPPED', 'ORDER_DELIVERED', 'REFUND_COMPLETED'
);

-- ===== USER / AUTH DOMAIN =====
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    phone           VARCHAR(20),
    password_hash   TEXT NOT NULL,
    role            "UserRole" DEFAULT 'CUSTOMER',
    email_verified  BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    token_hash  TEXT UNIQUE NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    revoked_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE email_verification_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    token_hash  TEXT UNIQUE NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    token_hash  TEXT UNIQUE NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used_at     TIMESTAMP,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE addresses (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID,
    full_name      VARCHAR(150) NOT NULL,
    phone          VARCHAR(20) NOT NULL,
    address_line1  VARCHAR(255) NOT NULL,
    address_line2  VARCHAR(255),
    city           VARCHAR(100) NOT NULL,
    state          VARCHAR(100) NOT NULL,
    postal_code    VARCHAR(20) NOT NULL,
    country        VARCHAR(100) DEFAULT 'India',
    is_default     BOOLEAN DEFAULT FALSE,
    created_at     TIMESTAMP DEFAULT NOW(),
    updated_at     TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== PRODUCT DOMAIN =====
CREATE TABLE categories (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(100) UNIQUE NOT NULL,
    slug         VARCHAR(120) UNIQUE NOT NULL,
    description  TEXT,
    image_url    TEXT,
    is_active    BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) UNIQUE NOT NULL,
    description     TEXT NOT NULL,
    audience        "ProductAudience" NOT NULL,
    price           DECIMAL(10,2) NOT NULL,
    discount_price  DECIMAL(10,2),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE product_images (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID,
    image_url      TEXT NOT NULL,
    public_id      VARCHAR(255) NOT NULL,
    is_primary     BOOLEAN DEFAULT FALSE,
    display_order  INTEGER DEFAULT 0,
    created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE product_variants (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id         UUID,
    sku                VARCHAR(100) UNIQUE NOT NULL,
    size               VARCHAR(20) NOT NULL,
    color              VARCHAR(50) NOT NULL,
    stock_quantity     INTEGER DEFAULT 0,
    reserved_quantity  INTEGER DEFAULT 0,
    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== WISHLIST =====
CREATE TABLE wishlist_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    product_id  UUID,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ===== CART DOMAIN =====
CREATE TABLE carts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    status      "CartStatus" DEFAULT 'ACTIVE',
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id     UUID,
    variant_id  UUID,
    quantity    INTEGER NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== ORDER DOMAIN =====
CREATE TABLE orders (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number          VARCHAR(50) UNIQUE NOT NULL,
    user_id               UUID,
    status                "OrderStatus" NOT NULL,
    payment_status        "OrderPaymentStatus" DEFAULT 'PENDING',
    subtotal              DECIMAL(10,2) NOT NULL,
    discount_amount       DECIMAL(10,2) DEFAULT 0,
    shipping_amount       DECIMAL(10,2) DEFAULT 0,
    total_amount          DECIMAL(10,2) NOT NULL,
    shipping_name         VARCHAR(150) NOT NULL,
    shipping_phone        VARCHAR(20) NOT NULL,
    shipping_address1     VARCHAR(255) NOT NULL,
    shipping_address2     VARCHAR(255),
    shipping_city         VARCHAR(100) NOT NULL,
    shipping_state        VARCHAR(100) NOT NULL,
    shipping_postal_code  VARCHAR(20) NOT NULL,
    shipping_country      VARCHAR(100) NOT NULL,
    confirmed_at          TIMESTAMP,
    packed_at             TIMESTAMP,
    shipped_at            TIMESTAMP,
    delivered_at          TIMESTAMP,
    cancelled_at          TIMESTAMP,
    created_at            TIMESTAMP DEFAULT NOW(),
    updated_at            TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE order_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id      UUID,
    product_id    UUID,
    variant_id    UUID,
    product_name  VARCHAR(255) NOT NULL,
    sku           VARCHAR(100) NOT NULL,
    size          VARCHAR(20) NOT NULL,
    color         VARCHAR(50) NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    quantity      INTEGER NOT NULL,
    line_total    DECIMAL(10,2) NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- ===== PAYMENT DOMAIN =====
CREATE TABLE payments (
    id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                  UUID,
    user_id                   UUID,
    stripe_payment_intent_id  VARCHAR(255) UNIQUE,
    amount                    DECIMAL(10,2) NOT NULL,
    currency                  VARCHAR(10) DEFAULT 'INR',
    status                    "PaymentStatus" NOT NULL,
    payment_method            VARCHAR(50),
    created_at                TIMESTAMP DEFAULT NOW(),
    updated_at                TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE refunds (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id        UUID,
    order_id          UUID,
    stripe_refund_id  VARCHAR(255) UNIQUE,
    amount            DECIMAL(10,2) NOT NULL,
    reason            TEXT,
    status            "RefundStatus" NOT NULL,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);
CREATE TRIGGER trg_refunds_updated_at BEFORE UPDATE ON refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== NOTIFICATION =====
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID,
    type        "NotificationType" NOT NULL,
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ===== FOREIGN KEYS =====
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE email_verification_tokens ADD CONSTRAINT fk_evt_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE password_reset_tokens ADD CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE addresses ADD CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_variants ADD CONSTRAINT fk_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE wishlist_items
    ADD CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id),
    ADD CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE carts ADD CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_cart_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
    ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id),
    ADD CONSTRAINT fk_order_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id);
ALTER TABLE payments
    ADD CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id),
    ADD CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE refunds
    ADD CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments(id),
    ADD CONSTRAINT fk_refunds_order FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id);

-- ===== UNIQUE CONSTRAINTS (composite) =====
ALTER TABLE product_variants ADD CONSTRAINT uq_product_variant_size_color UNIQUE (product_id, size, color);
ALTER TABLE wishlist_items ADD CONSTRAINT uq_wishlist_user_product UNIQUE (user_id, product_id);
ALTER TABLE cart_items ADD CONSTRAINT uq_cart_item_cart_variant UNIQUE (cart_id, variant_id);

-- ===== CHECK CONSTRAINTS =====
ALTER TABLE products
    ADD CONSTRAINT chk_products_price CHECK (price >= 0),
    ADD CONSTRAINT chk_products_discount_price CHECK (discount_price >= 0),
    ADD CONSTRAINT chk_products_discount_le_price CHECK (discount_price <= price);
ALTER TABLE product_variants
    ADD CONSTRAINT chk_variants_stock CHECK (stock_quantity >= 0),
    ADD CONSTRAINT chk_variants_reserved CHECK (reserved_quantity >= 0),
    ADD CONSTRAINT chk_variants_reserved_le_stock CHECK (reserved_quantity <= stock_quantity);
ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity CHECK (quantity > 0);
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_subtotal CHECK (subtotal >= 0),
    ADD CONSTRAINT chk_orders_discount CHECK (discount_amount >= 0),
    ADD CONSTRAINT chk_orders_shipping CHECK (shipping_amount >= 0),
    ADD CONSTRAINT chk_orders_total CHECK (total_amount >= 0),
    ADD CONSTRAINT chk_orders_discount_le_subtotal CHECK (discount_amount <= subtotal);
ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    ADD CONSTRAINT chk_order_items_unit_price CHECK (unit_price >= 0),
    ADD CONSTRAINT chk_order_items_line_total CHECK (line_total >= 0);
ALTER TABLE payments ADD CONSTRAINT chk_payments_amount CHECK (amount >= 0);
ALTER TABLE refunds ADD CONSTRAINT chk_refunds_amount CHECK (amount > 0);
