import JWT from 'jsonwebtoken';

//check user is authenticated or not
export const requiredSignIn = async (req, res, next) => {
    try {
        let token = req.cookies.access_token;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

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
    const role = req.user.role;
    if (role !== 0) {
        return res.status(403).json({
            success: false,
            message: "Access denied"
        });
    }
    next();
};

// admin check
export const isAdmin = (req, res, next) => {
    const role = req.user.role;
    if (role !== 2) {
        return res.status(403).json({
            success: false,
            message: "Access denied: Admin only",
        });
    }
    next();
};

// receptionist check
export const isReceptionist = (req, res, next) => {
    const role = req.user.role;
    // console.log(role);
    if (role !== 1) {
        return res.status(403).json({
            success: false,
            message: "Access denied: Receptionist only",
        });
    }
    next();
};