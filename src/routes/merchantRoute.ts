import express from 'express';
import upload from '../utils/multer';
import verifyToken from '../middlewares/auth';

import { 
    getAllMerchantsCtrl, 
    createMerchantCtrl, 
    getMerchantByIdCtrl, 
    updateMerchantCtrl, 
    deleteMerchantCtrl 
} from '../controllers/merchantController';

const router = express.Router();

router.get('/merchants', verifyToken, getAllMerchantsCtrl)
router.post('/merchant', verifyToken, upload.merchant.single('avatar'), createMerchantCtrl)
router.get('/merchant/:id', verifyToken, getMerchantByIdCtrl)
router.put('/merchant/:id', verifyToken, upload.merchant.single('avatar'), updateMerchantCtrl)
router.delete('/merchant/:id', verifyToken, deleteMerchantCtrl)

export default router