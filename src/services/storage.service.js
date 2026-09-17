const  ImageKit  = require("@imagekit/nodejs")

const client = new ImageKit({
  privateKey: process.env.Private_key
});


 async  function uploadfiles({fileName,buffer,folder = "snitch"}){

    const result = await client.files.upload({
        file:await ImageKit.toFile(buffer),
        fileName,
        folder
    })

    return result

}

module.exports = {
    uploadfiles
}