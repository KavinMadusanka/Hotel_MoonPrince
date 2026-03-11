import JWT from 'jsonwebtoken';

//check user is authenticated or not
export const requiredSignIn = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access."
            })
        }
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized access."
        })
    }
}