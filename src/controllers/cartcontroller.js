const cartmodel = require("../schema/cartshema");
const productmodel = require("../schema/product.model");
const {createorder} = require("../services/payment.service")

// ===============================
// ADD TO CART
// ===============================

async function addtocart(req, res) {
    try {
        const user = req.user;

        const {
            productId,
            variantId,
            quantity = 1
        } = req.body;


        // ==========================================
        // 1. Find product
        // ==========================================

        const product = await productmodel.findById(productId);

        if (!product) {
            return res.status(400).json({
                message: "Product not found"
            });
        }


        // ==========================================
        // 2. If variantId is provided
        // ==========================================

        let selectedVariant = null;

        if (variantId) {

            selectedVariant = product.variants.find(
                (variant) =>
                    variant._id.toString() === variantId.toString()
            );

            if (!selectedVariant) {
                return res.status(400).json({
                    message: "Variant not found"
                });
            }


            // Check variant stock
            if (selectedVariant.stock <= 0) {
                return res.status(400).json({
                    message: "Variant is out of stock"
                });
            }


            // Check requested quantity
            if (quantity > selectedVariant.stock) {
                return res.status(400).json({
                    message: `Only ${selectedVariant.stock} items available`
                });
            }
        }


        // ==========================================
        // 3. Find user's existing cart
        // ==========================================

        let existingCart = await cartmodel.findOne({
            user: user.id
        });


        // ==========================================
        // 4. Cart doesn't exist
        // ==========================================

        if (!existingCart) {

            existingCart = await cartmodel.create({
                user: user.id,

                items: [
                    {
                        productId: productId,
                        variantId: variantId || null,
                        quantity: quantity
                    }
                ]
            });


            return res.status(201).json({
                message: "Product added to cart",
                cart: existingCart
            });
        }


        // ==========================================
        // 5. Find existing product + variant
        // ==========================================

        const existingItem = existingCart.items.find(
            (item) => {

                const sameProduct =
                    item.productId.toString() === productId.toString();

                const sameVariant =
                    variantId
                        ? item.variantId &&
                          item.variantId.toString() === variantId.toString()
                        : !item.variantId;

                return sameProduct && sameVariant;
            }
        );


        // ==========================================
        // 6. Existing item found
        // ==========================================

        if (existingItem) {

            const newQuantity =
                existingItem.quantity + Number(quantity);


            // Check variant stock
            if (
                variantId &&
                newQuantity > selectedVariant.stock
            ) {
                return res.status(400).json({
                    message: `Only ${selectedVariant.stock} items available`
                });
            }


            existingItem.quantity = newQuantity;

        }


        // ==========================================
        // 7. New product/variant combination
        // ==========================================

        else {

            existingCart.items.push({
                productId: productId,
                variantId: variantId || null,
                quantity: quantity
            });
        }


        // ==========================================
        // 8. Save cart
        // ==========================================

        await existingCart.save();


        // ==========================================
        // 9. Send response
        // ==========================================

        return res.status(200).json({
            message: "Cart updated",
            cart: existingCart
        });


    } catch (error) {

        console.log("Add to cart error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



// ===============================
// GET CART DETAILS
// ===============================

async function getcartdetails(req, res) {

    try {

        const user = req.user;


        // ==========================================
        // 1. Find user's cart
        // ==========================================

        const cart = await cartmodel
            .findOne({
                user: user.id
            })
            .populate("items.productId");


        // ==========================================
        // 2. Cart doesn't exist
        // ==========================================

        if (!cart) {

            return res.status(200).json({
                message: "Cart is empty",
                cartItems: []
            });
        }


        // ==========================================
        // 3. Convert cart items
        // ==========================================

        const cartItems = cart.items.map((item) => {

            const product = item.productId;


            // ==========================================
            // Normal product
            // ==========================================

            if (!item.variantId) {

                return {
                    cartItemId: item._id,

                    product: product,

                    variant: null,

                    quantity: item.quantity
                };
            }


            // ==========================================
            // Variant product
            // ==========================================

            const selectedVariant = product.variants.find(
                (variant) =>
                    variant._id.toString() ===
                    item.variantId.toString()
            );


            return {
                cartItemId: item._id,

                product: product,

                variant: selectedVariant || null,

                quantity: item.quantity
            };
        });


        // ==========================================
        // 4. Send response
        // ==========================================

        return res.status(200).json({

            message: "Cart details fetched",

            cartItems
        });

    } catch (error) {

        console.log("Get cart details error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}



// ===============================
// UPDATE QUANTITY
// ===============================

async function updatequantity(req, res) {

    try {

        // ==========================================
        // 1. Get logged-in user
        // ==========================================

        const user = req.user;


        // ==========================================
        // 2. Get data from frontend
        // ==========================================

        const {
            cartItemId,
            quantity
        } = req.body;


        // ==========================================
        // 3. Validate quantity
        // ==========================================

        if (!quantity || quantity < 1) {

            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }


        // ==========================================
        // 4. Find user's cart
        // ==========================================

        const cart = await cartmodel.findOne({
            user: user.id
        });


        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });
        }


        // ==========================================
        // 5. Find particular cart item
        // ==========================================

        const cartItem = cart.items.find(
            (item) =>
                item._id.toString() ===
                cartItemId.toString()
        );


        if (!cartItem) {

            return res.status(404).json({
                message: "Cart item not found"
            });
        }


        // ==========================================
        // 6. Find product
        // ==========================================

        const product = await productmodel.findById(
            cartItem.productId
        );


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }


        // ==========================================
        // 7. If cart item has variant
        // ==========================================

        if (cartItem.variantId) {

            const variant = product.variants.find(
                (variant) =>
                    variant._id.toString() ===
                    cartItem.variantId.toString()
            );


            if (!variant) {

                return res.status(404).json({
                    message: "Variant not found"
                });
            }


            // ==========================================
            // 8. Check stock
            // ==========================================

            if (quantity > variant.stock) {

                return res.status(400).json({
                    message: `Only ${variant.stock} items available`
                });
            }
        }


        // ==========================================
        // 9. Update quantity
        // ==========================================

        cartItem.quantity = quantity;


        // ==========================================
        // 10. Save cart
        // ==========================================

        await cart.save();


        // ==========================================
        // 11. Send response
        // ==========================================

        return res.status(200).json({

            message: "Quantity updated",

            cart
        });

    } catch (error) {

        console.log("Update quantity error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function createordercontroller(req,res){

    const order = await  createorder({amount:1000,currency:"INR"})

    return res.status(200).json({
        message:"order created succesfully",
        order
    })

}



module.exports = {
    addtocart,
    getcartdetails,
    updatequantity,
     createordercontroller
};