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

// user check
export const isUser = (req, res, next) => {
    const userId = req.headers["user-id"];
    const role = req.headers["user-role"];
    if (role !== 0) {
        return res.status(403).json({
        message: "Access denied",
        });
    }
    next();
};

// admin check
export const isAdmin = (req, res, next) => {
    const userId = req.headers["user-id"];
    const role = req.headers["user-role"];
    if (role !== 2) {
        return res.status(403).json({
        message: "Access denied: Admin only",
        });
    }
    next();
};

// receptionist check
export const isReceptionist = (req, res, next) => {
    const userId = req.headers["user-id"];
    const role = req.headers["user-role"];
    if (role !== 1) {
        return res.status(403).json({
        message: "Access denied: Receptionist only",
        });
    }
    next();
};