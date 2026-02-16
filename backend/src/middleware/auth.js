const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    console.log('🔐 Auth header received:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log('❌ No valid auth header format');
        return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token || token === 'null' || token === 'undefined') {
        console.log('❌ Token is empty or invalid');
        return res.status(401).json({ message: "Invalid token format" });
    }

    console.log('📦 Token received, length:', token.length);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token verified successfully');
        console.log('👤 Decoded token:', decoded);

        // DON'T override with "Agent" - use the actual name from the token
        req.user = {
            id: decoded.id || decoded._id,
            name: decoded.name,  // Use the actual name from token
            email: decoded.email,
            role: decoded.role || 'support'
        };
        
        console.log('👤 User set in request:', req.user);
        return next();
    } catch (err) {
        console.error('❌ JWT Verification Error:', err.message);
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        
        return res.status(401).json({ message: "Authentication failed" });
    }
}

function requireRole(roles = []) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
        if (!req.user) {
            console.log('❌ No user found in request');
            return res.status(401).json({ message: "Not authenticated" });
        }

        console.log('👤 Checking role:', req.user.role, 'against allowed:', allowedRoles);

        if (!allowedRoles.includes(req.user.role)) {
            console.log('❌ Insufficient permissions');
            return res.status(403).json({ message: "Forbidden: insufficient permissions" });
        }

        console.log('✅ Role check passed');
        return next();
    };
}

module.exports = {
    authenticate,
    requireRole,
};