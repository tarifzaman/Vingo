import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token; // cookie null safe check
    if (!token) return res.status(400).json({ message: "token not found" });

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    if(!decodeToken){
      return res.status(400).json({messege:"token not verify"})
    }
    console.log(decodeToken)
    req.userID = decodeToken.userID;
    next()
  } catch (err) {
    
    return res.status(500).json({ message: "isAuth error" });
  }
};

export default isAuth;