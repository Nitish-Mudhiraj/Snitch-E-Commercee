const express = require("express")
const productmiddileware = require("../middileware/productmiddileware")
const multer = require("multer")
const {createProduct} = require("../controllers/product.controller")
const {getsellerproduct} = require("../controllers/product.controller")
const {getproducts} = require("../controllers/product.controller")
const { getsingleproduct} = require("../controllers/product.controller")
const middileware = require("../middileware/middileware")
const {searchProducts} = require("../controllers/product.controller")
const {addvariant} = require("../controllers/product.controller")
 





const upload = multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:5 * 1024 * 1024
    }
})



const productRouter = express.Router()


productRouter.post("/post/image", productmiddileware,upload.array("image"),createProduct)

productRouter.get("/getallproducts" ,productmiddileware,getsellerproduct)
productRouter.get("/getproducts",getproducts)
productRouter.get("/getsingle/:productId",middileware,getsingleproduct)
productRouter.post("/products/:productId/variants",productmiddileware,upload.array("images", 5),addvariant);
productRouter.get("/search", searchProducts)
module.exports = productRouter



