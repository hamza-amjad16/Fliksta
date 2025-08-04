import jwt from "jsonwebtoken"

export const isAuthenticated = async (req , res, next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                message: "User not Authenticated",
                success: true
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decode){
             return res.status(401).json({
                message: "Invalid Token",
                success: true
            })
        }

        req.id = decode.userId
        next()
    } catch (error) {
        console.log("Authentication Middle ware error", error);
        
    }
}