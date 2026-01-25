const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { findUserByEmail, createUser,getApi } = require("../models/user.model");

const generateApiKey = require("../utils/generateApiKey");

//Jwt generation
const generateJwt = (id,role) => {
  const token = jwt.sign({ userId: id,role:role }, process.env.JWT_SECRET,  {
    expiresIn: "1h",
  });
  return token;
};


//SignUpController
const SignUpController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Missing Credentials" });
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const apiKey = generateApiKey();
    const user = await createUser(email, passwordHash,apiKey);
    if (user) {
        const token=generateJwt(user.id,"USER");
      return res.status(201).json({
        msg: "User created successfully",
        "api-key": apiKey,
        token
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server error" });
  }
};


//login controller
const LoginController = async (req, res) => {
  try {
    const { email, password,role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Missing Credentials" });
    }
    const validUser = await findUserByEmail(email);
    if (!validUser && !(validUser.role==role)) {
      return res.status(404).json({ msg: "Invalid Email/Role" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      validUser.password_hash,
    );
    if (isPasswordValid) {
        const token=generateJwt(validUser.id,validUser.role);
      return res.status(200).json({
        msg: "Login Successful",
        "api-key": validUser.api_key,
        token
      });
    }
    return res.status(400).json({"msg":"Invalid Password"});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server error" });
  }
};


const getApiKey = async(req,res)=>{
  try{
    const userId=req.user.userId;
    const apiKey=await getApi(userId);
    if(apiKey){
      return res.status(200).json({"api-key":apiKey});
    }
    return res.status(404).json({"msg":"Not found"});
  }catch(e){
     console.log(e);
    return res.status(500).json({ msg: "Internal Server error" });
  }
}
module.exports = {
  SignUpController,
  LoginController,
  getApiKey
};
