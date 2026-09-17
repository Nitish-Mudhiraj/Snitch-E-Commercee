const productmodel = require("../schema/product.model")
const {uploadfiles}= require("../services/storage.service")

 async function createProduct(req,res){

    const { title, description, price } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadfiles({
            buffer: file.buffer,
            fileName: file.originalname
        });
    }));



    const product = await productmodel.create({

        title,
        description,
        price,
        images,
        seller:seller


    })

    res.status(201).json({
        message:"product posted sucessfulluy",
        product
    })
}


async function getsellerproduct(req,res){

    const seller = req.user

    const products = await productmodel.find({
        seller:seller._id
    })
    
   

    res.status(200).json({
        message:"products fecthed sucessfully",
        products
    })
}

async function getproducts(req,res){

    const product = await productmodel.find()

    res.status(200).json({
        message:"products fecthed sucessfully",
        product
    })

}

async function getsingleproduct(req,res){

    
   const productId = req.params.productId

    const singleproductid = await productmodel.findById(productId)

    if(!singleproductid){
        return res.status(401).json({
            message:"product is not available"
        })
    }

    res.status(200).json({
        message:"products are fetched",
        singleproductid
    })

        


}

async function addvariant(req, res) {
    try {
        const files = req.files;
        const { size, color, stock, price } = req.body;

        const productId = req.params.productId;

        const product = await productmodel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const images = await Promise.all(
            files.map(async (file) => {
                const results = await uploadfiles({
                    buffer: file.buffer,
                    fileName: file.originalname
                });

                return {
                    url: results.url
                };
            })
        );

        const variant = {
            size,
            color,
            stock,
            price,
            images
        };

        product.variants.push(variant);

        const savedProduct = await product.save();

        console.log("Saved product:", savedProduct);

        // 🔴 THIS WAS MISSING
        return res.status(201).json({
            message: "Variant added successfully",
            product: savedProduct
        });

    } catch (error) {
        console.error("Add variant error:", error);

        return res.status(500).json({
            message: "Failed to add variant",
            error: error.message
        });
    }
}


async function searchProducts(req, res) {

    const query = req.query.q;

    if (!query || !query.trim()) {
        return res.status(200).json({
            message: "no search query provided",
            product: []
        });
    }

    const product = await productmodel.find({
        title: { $regex: query, $options: "i" }
    });

    res.status(200).json({
        message: "products fetched successfully",
        product
    });

}
module.exports = {
    createProduct,
    getsellerproduct,
    getproducts,
    getsingleproduct,
    addvariant,
    searchProducts
    
}