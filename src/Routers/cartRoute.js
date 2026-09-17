const express = require("express")
const middileware = require("../middileware/middileware")
const {addtocart} = require("../controllers/cartcontroller")
const {getcartdetails,  updatequantity, createordercontroller} = require("../controllers/cartcontroller")

const CartauthRouter = express.Router()


CartauthRouter.post("/addcart" , middileware ,addtocart)
CartauthRouter.get("/getdetails" ,middileware ,getcartdetails)
CartauthRouter.patch("/updatequantity", middileware,updatequantity);
CartauthRouter.post("/payment" , middileware, createordercontroller)
module.exports = CartauthRouter