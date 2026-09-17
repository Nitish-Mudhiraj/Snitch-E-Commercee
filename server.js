
const dotenv = require("dotenv")
dotenv.config()
const app = require("./src/app")
const connectToDb = require("./src/config/database")

connectToDb()

app.listen(3000,()=>{
    console.log("port  is running on 3000 port")
})

