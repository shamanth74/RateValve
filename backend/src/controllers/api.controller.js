const crypto = require("crypto");

const apiDataController=async (req,res) =>{
    return res.status(200).json({
    message: "API request successful",
    user :{
      id:req.user.id,
      email:req.user.email,
    },
    data: {
      info: "This is protected API data",
    },
    val:crypto.randomBytes(8).toString("hex")
  });
}

module.exports = apiDataController;