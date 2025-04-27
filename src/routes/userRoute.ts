import express from 'express';
import upload from '../utils/multer';
import verifyToken from '../middlewares/auth';

import {
    getAllUserCtrl,
    getUserById,
    loginCtrl, 
    registerCtrl,
    updateUserCtrl,
} from '../controllers/userController';

const router = express.Router();

router.post('/register', upload.user.none(), registerCtrl)
router.post('/login', upload.user.none(), loginCtrl)

// PRIVATE ENDPOINT
router.get('/users', verifyToken, getAllUserCtrl)
router.get('/user/:id', verifyToken, getUserById)
router.put('/user/update', verifyToken, upload.user.single('avatar'), updateUserCtrl)

export default router