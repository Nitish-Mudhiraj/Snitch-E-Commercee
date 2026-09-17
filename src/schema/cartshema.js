const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

          variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    default: null
},

            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]

});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;