const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createorder = async ({amount ,currency}) =>{

    const options = {
        amount: amount*100,
        currency
    }

    const order = await razorpay.orders.create(options)

    return order

}

module.exports = {
    createorder
}