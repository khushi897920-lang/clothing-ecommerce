"""
generate_seed_sql.py

Reads products.csv and generates seed_data.sql containing INSERT statements
for: categories, products, product_sizes, product_images.

Run this, then open the generated seed_data.sql in pgAdmin's Query Tool
(or `psql -f seed_data.sql`) against your database.

Usage:
    python generate_seed_sql.py
"""

import csv
import os

CSV_PATH = "products.csv"
OUTPUT_SQL = "seed_data.sql"

# Local path prefix for images for now (swap to Cloudinary URLs later
# once images are uploaded - see image_url column comment below)
IMAGE_URL_PREFIX = "dataset/images/"


def sql_escape(value: str) -> str:
    """Escape single quotes for safe SQL string literals."""
    if value is None:
        return ""
    return value.replace("'", "''")


def slugify(gender: str, category: str) -> str:
    return f"{gender}-{category}".lower().replace(" ", "-")


def main():
    if not os.path.isfile(CSV_PATH):
        print(f"ERROR: could not find {CSV_PATH}")
        return

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    if not rows:
        print("No rows found in CSV.")
        return

    # ---- 1. Collect distinct (category, gender) pairs for categories table ----
    seen_categories = {}  # (gender, category) -> None, preserves first-seen order
    for row in rows:
        key = (row["gender"].strip(), row["category"].strip())
        if key not in seen_categories:
            seen_categories[key] = True

    lines = []
    lines.append("-- Auto-generated seed data from products.csv")
    lines.append("-- Run this in pgAdmin's Query Tool against your target database\n")

    lines.append("-- ===== CATEGORIES =====")
    for gender, category in seen_categories:
        slug = slugify(gender, category)
        lines.append(
            f"INSERT INTO categories (name, gender, slug) VALUES "
            f"('{sql_escape(category)}', '{sql_escape(gender)}', '{sql_escape(slug)}');"
        )

    # ---- 2. Products ----
    lines.append("\n-- ===== PRODUCTS =====")
    for row in rows:
        sku = sql_escape(row["sku"].strip())
        name = sql_escape(row["product_name"].strip())
        gender = sql_escape(row["gender"].strip())
        category = sql_escape(row["category"].strip())
        sub_type = sql_escape(row["sub_type"].strip())
        color = sql_escape(row["color"].strip())
        pattern = sql_escape(row["pattern"].strip())
        fit = sql_escape(row["fit"].strip())
        price = row["price_inr"].strip()
        is_active = row["is_active"].strip().upper()  # TRUE / FALSE

        lines.append(
            "INSERT INTO products "
            "(sku, name, category_id, sub_type, color, pattern, fit, price, is_active) "
            "VALUES ("
            f"'{sku}', '{name}', "
            f"(SELECT category_id FROM categories WHERE name = '{category}' AND gender = '{gender}'), "
            f"'{sub_type}', '{color}', '{pattern}', '{fit}', {price}, {is_active});"
        )

    # ---- 3. Product sizes (split comma-separated available_sizes) ----
    lines.append("\n-- ===== PRODUCT SIZES =====")
    for row in rows:
        sku = sql_escape(row["sku"].strip())
        sizes = [s.strip() for s in row["available_sizes"].split(",") if s.strip()]
        for size in sizes:
            lines.append(
                "INSERT INTO product_sizes (product_id, size) VALUES "
                f"((SELECT product_id FROM products WHERE sku = '{sku}'), '{sql_escape(size)}');"
            )

    # ---- 4. Product images ----
    lines.append("\n-- ===== PRODUCT IMAGES =====")
    for row in rows:
        sku = sql_escape(row["sku"].strip())
        image_filename = row["image_filename"].strip()
        image_url = f"{IMAGE_URL_PREFIX}{image_filename}"
        lines.append(
            "INSERT INTO product_images (product_id, image_url, is_primary) VALUES "
            f"((SELECT product_id FROM products WHERE sku = '{sku}'), '{sql_escape(image_url)}', TRUE);"
        )

    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Wrote {OUTPUT_SQL} with {len(seen_categories)} categories and {len(rows)} products.")
    print("Open it in pgAdmin's Query Tool (File > Open) and run it.")


if __name__ == "__main__":
    main()
