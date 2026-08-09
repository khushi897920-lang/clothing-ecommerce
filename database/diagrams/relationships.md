# Database Entity Relationships

17 tables across 5 domains. Full column-level detail lives in `database/sql/init.sql`
and `database/prisma/schema.prisma` — this file documents the relationships and the
business rules enforced at the database level.

## Domains
- **User/Auth**: users, refresh_tokens, email_verification_tokens, password_reset_tokens, addresses
- **Product**: categories, products, product_images, product_variants
- **Wishlist**: wishlist_items
- **Cart**: carts, cart_items
- **Order**: orders, order_items
- **Payment**: payments, refunds
- **Notification**: notifications

## Key relationships
users 1—* refresh_tokens / email_verification_tokens / password_reset_tokens / addresses / wishlist_items / carts / orders / payments / notifications
categories 1—* products
products 1—* product_images (ON DELETE CASCADE) / product_variants
product_variants *—* orders via order_items, *—* carts via cart_items
orders 1—* order_items / payments / refunds
payments 1—* refunds

## Rules enforced at the DB level (not just app-level validation)
- One primary image per product (partial unique index)
- One default address per user (partial unique index)
- One ACTIVE cart per user (partial unique index)
- One variant per (product, size, color) combination
- One wishlist entry per (user, product)
- One cart_item per (cart, variant) — re-adding increments quantity instead of duplicating
- Orders/payments/refunds are never hard-deleted — FKs block it by default (no CASCADE)
- Products/product_images: deleting a product cascades to its images only (ON DELETE CASCADE)

See the full progress report doc shared with the team for validation steps and Prisma-specific notes.
