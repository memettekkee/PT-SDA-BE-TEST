import express from 'express';
import upload from '../utils/multer';
import verifyToken from '../middlewares/auth';

import { 
    getAllCategoriesCtrl,
    createCategoryCtrl,
    getCategoryByIdCtrl,
    updateCategoryCtrl,
    deleteCategoryCtrl,
} from '../controllers/master-data/categoryController';

import { 
    getAllSizesCtrl,
    createSizeCtrl,
    getSizeByIdCtrl,
    updateSizeCtrl,
    deleteSizeCtrl,
} from '../controllers/master-data/sizeController';

import { 
    getAllColoursCtrl,
    createColourCtrl,
    getColourByIdCtrl,
    updateColourCtrl,
    deleteColourCtrl,
} from '../controllers/master-data/colourController';

const router = express.Router();

// Categories
router.get('/master-data/categories', verifyToken, getAllCategoriesCtrl)
router.post('/master-data/category', verifyToken, upload.product.none(), createCategoryCtrl)
router.get('/master-data/category/:id', verifyToken, getCategoryByIdCtrl)
router.put('/master-data/category/:id', verifyToken, upload.product.none(), updateCategoryCtrl)
router.delete('/master-data/category/:id', verifyToken, deleteCategoryCtrl)

// Sizes
router.get('/master-data/sizes', verifyToken, getAllSizesCtrl)
router.post('/master-data/size', verifyToken, upload.product.none(), createSizeCtrl)
router.get('/master-data/size/:id', verifyToken, getSizeByIdCtrl)
router.put('/master-data/size/:id', verifyToken, upload.product.none(), updateSizeCtrl)
router.delete('/master-data/size/:id', verifyToken, deleteSizeCtrl)

// Colours
router.get('/master-data/colours', verifyToken, getAllColoursCtrl)
router.post('/master-data/colour', verifyToken, upload.product.none(), createColourCtrl)
router.get('/master-data/colour/:id', verifyToken, getColourByIdCtrl)
router.put('/master-data/colour/:id', verifyToken, upload.product.none(), updateColourCtrl)
router.delete('/master-data/colour/:id', verifyToken, deleteColourCtrl)

export default router