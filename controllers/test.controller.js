import jwt from 'jsonwebtoken';

export const shouldBeLoggedIn = (req, res, next) => {
    console.log( req.userId); 
    res.status(200).json({ message: 'User logged in' }); }

export const shouldBeAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'You are not logged in' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Not authorized" });
        }
        if (payload.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }
        req.user = payload; // Attach user data to request object
        next(); // Proceed to next middleware
    });
};
