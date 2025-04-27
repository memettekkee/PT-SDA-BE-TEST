import express from 'express';
import upload from '../utils/multer';
import verifyToken from '../middlewares/auth';
import { 
    addProductVariantCtrl,
    createProductCtrl, 
    deleteProductCtrl, 
    deleteProductVariantCtrl, 
    getAllProductsCtrl, 
    getAllProductVariantsCtrl, 
    getProductByIdCtrl, 
    getProductsByCategoryCtrl, 
    searchProductsCtrl, 
    updateProductCtrl, 
    updateProductVariantCtrl,
} from '../controllers/productController';

const router = express.Router();

router.post('/product', verifyToken, upload.product.single('avatar'), createProductCtrl)
router.get('/product/:id', verifyToken, getProductByIdCtrl)
router.get('/products', verifyToken, getAllProductsCtrl)
router.delete('/product/:id', verifyToken, deleteProductCtrl)
router.put('/product/:id', verifyToken, upload.product.single('avatar'), updateProductCtrl)

// Manipulate product variant
router.get('/product/:id/variants', verifyToken, getAllProductVariantsCtrl)
router.post('/product/:id/variant', verifyToken, upload.product.none(), addProductVariantCtrl)
router.put('/product/:id/variant/:variantId', verifyToken, upload.product.none(), updateProductVariantCtrl)
router.delete('/product/:id/variant/:variantId', verifyToken, deleteProductVariantCtrl)

// Filter product by category
router.get('/products/category/:id', verifyToken, getProductsByCategoryCtrl)

// Search product by name
router.get('/products/search', verifyToken, searchProductsCtrl) 

export default router