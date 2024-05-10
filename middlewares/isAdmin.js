const getUserIdFromToken = require("./verifyUser")
const User = require("../models/UserModel")


const isAdmin = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return false; 
        }
        if(user.role === 'admin'){
            return true;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false; 
    }
};


const adminMiddleware = async (req, res, next) => {
    try {
        const userId = getUserIdFromToken(req.cookies.accessToken); 
        const isAdminUser = await isAdmin(userId);
        if (isAdminUser) {        
            next();
        } else {        
            res.status(403).json({ error: 'Unauthorized access' });
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = adminMiddleware;
