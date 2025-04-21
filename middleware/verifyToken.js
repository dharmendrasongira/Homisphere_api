import jwt from 'jsonwebtoken';

export const verifytoken = (req, res, next) => {
        const token = req.cookies.token;
          if (!token) {
              return res.status(401).json({ message: 'You are not logged in' });
          }
      
          jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
              if (err) {
                  return res.status(401).json({ message: "Not authorized" });
              }
              req.userId = payload.userId;
           
              next(); // Proceed to next middleware
          });
        }