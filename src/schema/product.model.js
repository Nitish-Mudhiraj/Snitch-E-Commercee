const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Main product details
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Base / general product images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],

    // Seller who created the product
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Product variants
    variants: [
      {
        // Images specifically for this variant
        images: [
          {
            url: {
              type: String,
              required: true,
            },
          },
        ],

        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL"],
          required: true,
        },

        color: {
          type: String,
          enum: ["Red", "Blue", "Yellow", "Black", "White"],
          required: true,
        },

        stock: {
          type: Number,
          required: true,
          min: 0,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;