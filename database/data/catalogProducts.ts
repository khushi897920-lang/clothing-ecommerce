export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  gender: string;
  subType: string;
  color: string;
  pattern: string;
  fit: string;
  price: number;
  formattedPrice: string;
  image: string;
  sizes: string[];
  inStock: boolean;
  stockQuantity: number;
  swatches: string[];
  colors?: string[];
}

export const catalogProducts: CatalogProduct[] = [
  {
    "id": "m-acti-0001",
    "sku": "M-ACTI-0001",
    "name": "Black Men's Tank Top",
    "slug": "m-acti-0001",
    "category": "Activewear",
    "gender": "Men",
    "subType": "Tank Top",
    "color": "Black",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 28.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-ACTI-0001.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#1A1A1A",
      "#333333",
      "#E3D7C5"
    ]
  },
  {
    "id": "m-acti-0002",
    "sku": "M-ACTI-0002",
    "name": "White Men's Shorts",
    "slug": "m-acti-0002",
    "category": "Activewear",
    "gender": "Men",
    "subType": "Shorts",
    "color": "White",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 28.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-ACTI-0002.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-oute-0003",
    "sku": "M-OUTE-0003",
    "name": "Beige Men's Overshirt",
    "slug": "m-oute-0003",
    "category": "Outerwear",
    "gender": "Men",
    "subType": "Overshirt",
    "color": "Beige",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 50.25,
    "formattedPrice": "",
    "image": "/dataset/images/M-OUTE-0003.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E3D7C5",
      "#6B4A37",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-oute-0004",
    "sku": "M-OUTE-0004",
    "name": "Blue Men's Jacket",
    "slug": "m-oute-0004",
    "category": "Outerwear",
    "gender": "Men",
    "subType": "Jacket",
    "color": "Blue",
    "pattern": "Graphic",
    "fit": "Regular",
    "price": 79.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-OUTE-0004.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-oute-0005",
    "sku": "M-OUTE-0005",
    "name": "Brown Men's Jacket",
    "slug": "m-oute-0005",
    "category": "Outerwear",
    "gender": "Men",
    "subType": "Jacket",
    "color": "Brown",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 52.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-OUTE-0005.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#6B4A37",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-over-0006",
    "sku": "M-OVER-0006",
    "name": "Purple Men's Oversized Tshirt",
    "slug": "m-over-0006",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Purple",
    "pattern": "Striped",
    "fit": "Oversized",
    "price": 19.75,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0006.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#8E44AD",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-over-0007",
    "sku": "M-OVER-0007",
    "name": "Beige Men's Oversized Tshirt",
    "slug": "m-over-0007",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Beige",
    "pattern": "Solid",
    "fit": "Oversized",
    "price": 22.25,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0007.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E3D7C5",
      "#6B4A37",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-over-0008",
    "sku": "M-OVER-0008",
    "name": "Pink Men's Oversized Tshirt",
    "slug": "m-over-0008",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Pink",
    "pattern": "Tie-Dye",
    "fit": "Oversized",
    "price": 18.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0008.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E8A7B8",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-over-0009",
    "sku": "M-OVER-0009",
    "name": "Pink Men's Oversized Tshirt",
    "slug": "m-over-0009",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Pink",
    "pattern": "Graphic",
    "fit": "Oversized",
    "price": 15.25,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0009.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E8A7B8",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-over-0010",
    "sku": "M-OVER-0010",
    "name": "Black Men's Oversized Tshirt",
    "slug": "m-over-0010",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Black",
    "pattern": "Graphic",
    "fit": "Oversized",
    "price": 20.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0010.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#1A1A1A",
      "#333333",
      "#E3D7C5"
    ]
  },
  {
    "id": "m-over-0011",
    "sku": "M-OVER-0011",
    "name": "Black Men's Oversized Tshirt",
    "slug": "m-over-0011",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Black",
    "pattern": "Graphic",
    "fit": "Oversized",
    "price": 15.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0011.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#1A1A1A",
      "#333333",
      "#E3D7C5"
    ]
  },
  {
    "id": "m-over-0012",
    "sku": "M-OVER-0012",
    "name": "Grey Men's Oversized Tshirt",
    "slug": "m-over-0012",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Grey",
    "pattern": "Tie-Dye",
    "fit": "Oversized",
    "price": 19.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0012.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#888888",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-over-0013",
    "sku": "M-OVER-0013",
    "name": "Grey Men's Oversized Tshirt",
    "slug": "m-over-0013",
    "category": "Oversized Tshirts",
    "gender": "Men",
    "subType": "Tshirts",
    "color": "Grey",
    "pattern": "Solid",
    "fit": "Oversized",
    "price": 18.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-OVER-0013.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#888888",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-pant-0014",
    "sku": "M-PANT-0014",
    "name": "Grey Men's Trousers",
    "slug": "m-pant-0014",
    "category": "Pants",
    "gender": "Men",
    "subType": "Trousers",
    "color": "Grey",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 39.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-PANT-0014.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#888888",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-pant-0015",
    "sku": "M-PANT-0015",
    "name": "Blue Men's Trousers",
    "slug": "m-pant-0015",
    "category": "Pants",
    "gender": "Men",
    "subType": "Trousers",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 36.25,
    "formattedPrice": "",
    "image": "/dataset/images/M-PANT-0015.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-pant-0016",
    "sku": "M-PANT-0016",
    "name": "Green Men's Trousers",
    "slug": "m-pant-0016",
    "category": "Pants",
    "gender": "Men",
    "subType": "Trousers",
    "color": "Green",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 44.25,
    "formattedPrice": "",
    "image": "/dataset/images/M-PANT-0016.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#556B2F",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-pant-0017",
    "sku": "M-PANT-0017",
    "name": "Brown Men's Trousers",
    "slug": "m-pant-0017",
    "category": "Pants",
    "gender": "Men",
    "subType": "Trousers",
    "color": "Brown",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 39.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-PANT-0017.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#6B4A37",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-pant-0018",
    "sku": "M-PANT-0018",
    "name": "White Men's Trousers",
    "slug": "m-pant-0018",
    "category": "Pants",
    "gender": "Men",
    "subType": "Trousers",
    "color": "White",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 31.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-PANT-0018.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-pant-0019",
    "sku": "M-PANT-0019",
    "name": "Grey Men's Trousers",
    "slug": "m-pant-0019",
    "category": "Pants",
    "gender": "Men",
    "subType": "Trousers",
    "color": "Grey",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 45.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-PANT-0019.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#888888",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-shir-0020",
    "sku": "M-SHIR-0020",
    "name": "Red Men's Shirt",
    "slug": "m-shir-0020",
    "category": "Shirts",
    "gender": "Men",
    "subType": "Shirt",
    "color": "Red",
    "pattern": "Plaid",
    "fit": "Regular",
    "price": 44.75,
    "formattedPrice": "",
    "image": "/dataset/images/M-SHIR-0020.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#C0392B",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-shir-0021",
    "sku": "M-SHIR-0021",
    "name": "Blue Men's Shirt",
    "slug": "m-shir-0021",
    "category": "Shirts",
    "gender": "Men",
    "subType": "Shirt",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 22.5,
    "formattedPrice": "",
    "image": "/dataset/images/M-SHIR-0021.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-shir-0022",
    "sku": "M-SHIR-0022",
    "name": "Blue Men's Shirt",
    "slug": "m-shir-0022",
    "category": "Shirts",
    "gender": "Men",
    "subType": "Shirt",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 27.75,
    "formattedPrice": "",
    "image": "/dataset/images/M-SHIR-0022.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-shir-0023",
    "sku": "M-SHIR-0023",
    "name": "Brown Men's Shirt",
    "slug": "m-shir-0023",
    "category": "Shirts",
    "gender": "Men",
    "subType": "Shirt",
    "color": "Brown",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 34.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-SHIR-0023.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#6B4A37",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "m-shir-0024",
    "sku": "M-SHIR-0024",
    "name": "Black Men's Shirt",
    "slug": "m-shir-0024",
    "category": "Shirts",
    "gender": "Men",
    "subType": "Shirt",
    "color": "Black",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 30.75,
    "formattedPrice": "",
    "image": "/dataset/images/M-SHIR-0024.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#1A1A1A",
      "#333333",
      "#E3D7C5"
    ]
  },
  {
    "id": "m-shir-0025",
    "sku": "M-SHIR-0025",
    "name": "White Men's Shirt",
    "slug": "m-shir-0025",
    "category": "Shirts",
    "gender": "Men",
    "subType": "Shirt",
    "color": "White",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 38.0,
    "formattedPrice": "",
    "image": "/dataset/images/M-SHIR-0025.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-bott-0026",
    "sku": "W-BOTT-0026",
    "name": "Blue Women's Jeans",
    "slug": "w-bott-0026",
    "category": "Bottomwear",
    "gender": "Women",
    "subType": "Jeans",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 43.75,
    "formattedPrice": "",
    "image": "/dataset/images/W-BOTT-0026.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-bott-0027",
    "sku": "W-BOTT-0027",
    "name": "Blue Women's Skirt",
    "slug": "w-bott-0027",
    "category": "Bottomwear",
    "gender": "Women",
    "subType": "Skirt",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 46.0,
    "formattedPrice": "",
    "image": "/dataset/images/W-BOTT-0027.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-bott-0028",
    "sku": "W-BOTT-0028",
    "name": "Blue Women's Jeans",
    "slug": "w-bott-0028",
    "category": "Bottomwear",
    "gender": "Women",
    "subType": "Jeans",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Flared",
    "price": 25.75,
    "formattedPrice": "",
    "image": "/dataset/images/W-BOTT-0028.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-bott-0029",
    "sku": "W-BOTT-0029",
    "name": "Blue Women's Trousers",
    "slug": "w-bott-0029",
    "category": "Bottomwear",
    "gender": "Women",
    "subType": "Trousers",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 26.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-BOTT-0029.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-bott-0030",
    "sku": "W-BOTT-0030",
    "name": "Blue Women's Jeans",
    "slug": "w-bott-0030",
    "category": "Bottomwear",
    "gender": "Women",
    "subType": "Jeans",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 35.0,
    "formattedPrice": "",
    "image": "/dataset/images/W-BOTT-0030.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-bott-0031",
    "sku": "W-BOTT-0031",
    "name": "White Women's Trousers",
    "slug": "w-bott-0031",
    "category": "Bottomwear",
    "gender": "Women",
    "subType": "Trousers",
    "color": "White",
    "pattern": "Solid",
    "fit": "Wide-Leg",
    "price": 36.75,
    "formattedPrice": "",
    "image": "/dataset/images/W-BOTT-0031.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-co-o-0032",
    "sku": "W-CO-O-0032",
    "name": "Beige Women's Co-ord Set",
    "slug": "w-co-o-0032",
    "category": "Co-ord",
    "gender": "Women",
    "subType": "Co-ord Set",
    "color": "Beige",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 63.0,
    "formattedPrice": "",
    "image": "/dataset/images/W-CO-O-0032.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E3D7C5",
      "#6B4A37",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-co-o-0033",
    "sku": "W-CO-O-0033",
    "name": "Pink Women's Co-ord Set",
    "slug": "w-co-o-0033",
    "category": "Co-ord",
    "gender": "Women",
    "subType": "Co-ord Set",
    "color": "Pink",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 68.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-CO-O-0033.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E8A7B8",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-dres-0034",
    "sku": "W-DRES-0034",
    "name": "Blue Women's Dress",
    "slug": "w-dres-0034",
    "category": "Dresses",
    "gender": "Women",
    "subType": "Dress",
    "color": "Blue",
    "pattern": "Floral",
    "fit": "Regular",
    "price": 63.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-DRES-0034.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-dres-0035",
    "sku": "W-DRES-0035",
    "name": "Black Women's Dress",
    "slug": "w-dres-0035",
    "category": "Dresses",
    "gender": "Women",
    "subType": "Dress",
    "color": "Black",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 39.25,
    "formattedPrice": "",
    "image": "/dataset/images/W-DRES-0035.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#1A1A1A",
      "#333333",
      "#E3D7C5"
    ]
  },
  {
    "id": "w-dres-0036",
    "sku": "W-DRES-0036",
    "name": "Blue Women's Dress",
    "slug": "w-dres-0036",
    "category": "Dresses",
    "gender": "Women",
    "subType": "Dress",
    "color": "Blue",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 41.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-DRES-0036.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-dres-0037",
    "sku": "W-DRES-0037",
    "name": "Brown Women's Dress",
    "slug": "w-dres-0037",
    "category": "Dresses",
    "gender": "Women",
    "subType": "Dress",
    "color": "Brown",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 55.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-DRES-0037.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#6B4A37",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-dres-0038",
    "sku": "W-DRES-0038",
    "name": "White Women's Dress",
    "slug": "w-dres-0038",
    "category": "Dresses",
    "gender": "Women",
    "subType": "Dress",
    "color": "White",
    "pattern": "Floral",
    "fit": "Regular",
    "price": 50.0,
    "formattedPrice": "",
    "image": "/dataset/images/W-DRES-0038.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-dres-0039",
    "sku": "W-DRES-0039",
    "name": "Red Women's Dress",
    "slug": "w-dres-0039",
    "category": "Dresses",
    "gender": "Women",
    "subType": "Dress",
    "color": "Red",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 42.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-DRES-0039.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#C0392B",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-jack-0040",
    "sku": "W-JACK-0040",
    "name": "White Women's Jacket",
    "slug": "w-jack-0040",
    "category": "Jacket",
    "gender": "Women",
    "subType": "Jacket",
    "color": "White",
    "pattern": "Colorblock",
    "fit": "Cropped",
    "price": 63.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-JACK-0040.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-jack-0041",
    "sku": "W-JACK-0041",
    "name": "Brown Women's Jacket",
    "slug": "w-jack-0041",
    "category": "Jacket",
    "gender": "Women",
    "subType": "Jacket",
    "color": "Brown",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 51.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-JACK-0041.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#6B4A37",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-jack-0042",
    "sku": "W-JACK-0042",
    "name": "Blue Women's Jacket",
    "slug": "w-jack-0042",
    "category": "Jacket",
    "gender": "Women",
    "subType": "Jacket",
    "color": "Blue",
    "pattern": "Graphic",
    "fit": "Regular",
    "price": 56.25,
    "formattedPrice": "",
    "image": "/dataset/images/W-JACK-0042.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0043",
    "sku": "W-SHIR-0043",
    "name": "Red Women's Cami Top",
    "slug": "w-shir-0043",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Cami Top",
    "color": "Red",
    "pattern": "Printed",
    "fit": "Regular",
    "price": 42.75,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0043.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#C0392B",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0044",
    "sku": "W-SHIR-0044",
    "name": "Blue Women's Vest Top",
    "slug": "w-shir-0044",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Vest Top",
    "color": "Blue",
    "pattern": "Printed",
    "fit": "Regular",
    "price": 34.75,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0044.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0045",
    "sku": "W-SHIR-0045",
    "name": "Green Women's Crop Top",
    "slug": "w-shir-0045",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Crop Top",
    "color": "Green",
    "pattern": "Graphic",
    "fit": "Cropped",
    "price": 28.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0045.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#556B2F",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0046",
    "sku": "W-SHIR-0046",
    "name": "Beige Women's Sweater Vest",
    "slug": "w-shir-0046",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Sweater Vest",
    "color": "Beige",
    "pattern": "Argyle",
    "fit": "Regular",
    "price": 23.25,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0046.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E3D7C5",
      "#6B4A37",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0047",
    "sku": "W-SHIR-0047",
    "name": "White Women's Polo Top",
    "slug": "w-shir-0047",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Polo Top",
    "color": "White",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 38.0,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0047.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#FFFFFF",
      "#E3D7C5",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0048",
    "sku": "W-SHIR-0048",
    "name": "Beige Women's Sweater Vest",
    "slug": "w-shir-0048",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Sweater Vest",
    "color": "Beige",
    "pattern": "Solid",
    "fit": "Regular",
    "price": 23.75,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0048.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#E3D7C5",
      "#6B4A37",
      "#1A1A1A"
    ]
  },
  {
    "id": "w-shir-0049",
    "sku": "W-SHIR-0049",
    "name": "Black Women's Top",
    "slug": "w-shir-0049",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Top",
    "color": "Black",
    "pattern": "Solid",
    "fit": "Slim",
    "price": 31.0,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0049.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#1A1A1A",
      "#333333",
      "#E3D7C5"
    ]
  },
  {
    "id": "w-shir-0050",
    "sku": "W-SHIR-0050",
    "name": "Blue Women's Polo Top",
    "slug": "w-shir-0050",
    "category": "Shirts",
    "gender": "Women",
    "subType": "Polo Top",
    "color": "Blue",
    "pattern": "Colorblock",
    "fit": "Regular",
    "price": 26.5,
    "formattedPrice": "",
    "image": "/dataset/images/W-SHIR-0050.jpg",
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "inStock": true,
    "stockQuantity": 50,
    "swatches": [
      "#3B5998",
      "#E3D7C5",
      "#1A1A1A"
    ]
  }
];
