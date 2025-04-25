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

router.post('/register', upload.none(), registerCtrl)
router.post('/login', upload.none(), loginCtrl)
// endpoint forget password kirim phone

// PRIVATE ENDPOINT
router.get('/users', verifyToken, getAllUserCtrl)
router.get('/user/:id', verifyToken, getUserById)
router.put('/user/update', verifyToken, upload.none(), updateUserCtrl)

export default router