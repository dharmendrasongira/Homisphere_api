import express from "express";
import { getUser, updateUser, deleteUser, getUsers ,savePost,profilePost} from "../controllers/user.controller.js"; 
import { verifytoken } from "../middleware/verifyToken.js";


const router = express.Router();
router.get('/profilePost',verifytoken,profilePost)
router.get('/', getUsers);
router.get("/:id", verifytoken, getUser);
router.put('/:id', verifytoken, updateUser);
router.delete('/:id', verifytoken, deleteUser);
router.post('/save', verifytoken,savePost);



export default router;
