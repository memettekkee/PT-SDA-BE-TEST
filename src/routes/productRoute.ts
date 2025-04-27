import express from 'express';
import upload from '../utils/multer';
import verifyToken from '../middlewares/auth';
import { 
    createProductCtrl, 
    deleteProductCtrl, 
    getAllProductsCtrl, 
    getProductByIdCtrl, 
    updateProductCtrl 
} from '../controllers/productController';

const router = express.Router();

router.post('/product', verifyToken, upload.product.single('avatar'), createProductCtrl)
router.get('/product/:id', verifyToken, getProductByIdCtrl)
router.get('/products', verifyToken, getAllProductsCtrl)
router.delete('/product/:id', verifyToken, deleteProductCtrl)
router.put('/product/:id', verifyToken, upload.product.single('avatar'), updateProductCtrl)

export default router