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