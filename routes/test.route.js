import express from 'express';
import { shouldBeLoggedIn, shouldBeAdmin } from '../controllers/test.controller.js';
import { verifytoken } from '../middleware/verifyToken.js';
const router = express.Router();

// Check if user is logged in

router.get('/shouldBeLoggedIn', verifytoken, shouldBeLoggedIn);
// Check if user is an admin
router.get("/shouldBeAdmin", shouldBeLoggedIn, shouldBeAdmin, (req, res) => {
    res.json({ message: "Admin Access Granted" });
});

export default router;
