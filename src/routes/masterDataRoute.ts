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

/**
 * @swagger
 * tags:
 *   - name: Master Data
 *     description: System master data management
 *   - name: Categories
 *     description: Product category management
 *   - name: Sizes
 *     description: Product size management
 *   - name: Colours
 *     description: Product colour management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Size:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         length:
 *           type: number
 *         width:
 *           type: number
 *         height:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Colour:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         hex:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Categories
/**
 * @swagger
 * /master-data/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully retrieved categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully get all categories!"
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Internal server error
 */
router.get('/master-data/categories', verifyToken, getAllCategoriesCtrl) // Get all categories

/**
 * @swagger
 * /master-data/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully create category!"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       422:
 *         description: Validation error (missing required fields)
 *       500:
 *         description: Internal server error
 */
router.post('/master-data/category', verifyToken, upload.product.none(), createCategoryCtrl) // Create category

/**
 * @swagger
 * /master-data/category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       201:
 *         description: Successfully retrieved category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully get specific category!"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get('/master-data/category/:id', verifyToken, getCategoryByIdCtrl) // Get category by id

/**
 * @swagger
 * /master-data/category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully update category!"
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       422:
 *         description: Validation error (missing required fields)
 *       500:
 *         description: Internal server error
 */
router.put('/master-data/category/:id', verifyToken, upload.product.none(), updateCategoryCtrl) // Update category

/**
 * @swagger
 * /master-data/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       201:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully delete category!"
 *                 category_id:
 *                   type: string
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete('/master-data/category/:id', verifyToken, deleteCategoryCtrl) // Delete category

// Sizes

/**
 * @swagger
 * /master-data/sizes:
 *   get:
 *     summary: Get all sizes
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully retrieved sizes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully get all sizes!"
 *                 sizes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Size'
 *       500:
 *         description: Internal server error
 */
router.get('/master-data/sizes', verifyToken, getAllSizesCtrl) // Get all sizes

/**
 * @swagger
 * /master-data/size:
 *   post:
 *     summary: Create a new size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *     responses:
 *       201:
 *         description: Size created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully create size!"
 *                 size:
 *                   $ref: '#/components/schemas/Size'
 *       422:
 *         description: Validation error (missing required fields)
 *       500:
 *         description: Internal server error
 */
router.post('/master-data/size', verifyToken, upload.product.none(), createSizeCtrl) // Create size

/**
 * @swagger
 * /master-data/size/{id}:
 *   get:
 *     summary: Get a size by ID
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     responses:
 *       201:
 *         description: Successfully retrieved size
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully get specific size!"
 *                 size:
 *                   $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
 *       500:
 *         description: Internal server error
 */
router.get('/master-data/size/:id', verifyToken, getSizeByIdCtrl) // Get size by id

/**
 * @swagger
 * /master-data/size/{id}:
 *   put:
 *     summary: Update a size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               length:
 *                 type: number
 *               width:
 *                 type: number
 *               height:
 *                 type: number
 *     responses:
 *       201:
 *         description: Size updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully update size!"
 *                 size:
 *                   $ref: '#/components/schemas/Size'
 *       404:
 *         description: Size not found
 *       422:
 *         description: Validation error (missing required fields)
 *       500:
 *         description: Internal server error
 */
router.put('/master-data/size/:id', verifyToken, upload.product.none(), updateSizeCtrl) // Update size

/**
 * @swagger
 * /master-data/size/{id}:
 *   delete:
 *     summary: Delete a size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Size ID
 *     responses:
 *       201:
 *         description: Size deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully delete size!"
 *                 size_id:
 *                   type: string
 *       404:
 *         description: Size not found
 *       500:
 *         description: Internal server error
 */
router.delete('/master-data/size/:id', verifyToken, deleteSizeCtrl) // Delete size

// Colours

/**
 * @swagger
 * /master-data/colours:
 *   get:
 *     summary: Get all colours
 *     tags: [Colours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully retrieved colours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully get all colours!"
 *                 colours:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Colour'
 *       500:
 *         description: Internal server error
 */
router.get('/master-data/colours', verifyToken, getAllColoursCtrl) // Get all colours

/**
 * @swagger
 * /master-data/colour:
 *   post:
 *     summary: Create a new colour
 *     tags: [Colours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hex:
 *                 type: string
 *     responses:
 *       201:
 *         description: Colour created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully create colour!"
 *                 colour:
 *                   $ref: '#/components/schemas/Colour'
 *       500:
 *         description: Internal server error
 */
router.post('/master-data/colour', verifyToken, upload.product.none(), createColourCtrl) // Create colour

/**
 * @swagger
 * /master-data/colour/{id}:
 *   get:
 *     summary: Get a colour by ID
 *     tags: [Colours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Colour ID
 *     responses:
 *       201:
 *         description: Successfully retrieved colour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully get specific colour!"
 *                 colour:
 *                   $ref: '#/components/schemas/Colour'
 *       404:
 *         description: Colour not found
 *       500:
 *         description: Internal server error
 */
router.get('/master-data/colour/:id', verifyToken, getColourByIdCtrl) // Get colour by id

/**
 * @swagger
 * /master-data/colour/{id}:
 *   put:
 *     summary: Update a colour
 *     tags: [Colours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Colour ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hex:
 *                 type: string
 *     responses:
 *       201:
 *         description: Colour updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully update colour!"
 *                 colour:
 *                   $ref: '#/components/schemas/Colour'
 *       404:
 *         description: Colour not found
 *       422:
 *         description: Validation error (missing required fields)
 *       500:
 *         description: Internal server error
 */
router.put('/master-data/colour/:id', verifyToken, upload.product.none(), updateColourCtrl) // Update colour

/**
 * @swagger
 * /master-data/colour/{id}:
 *   delete:
 *     summary: Delete a colour
 *     tags: [Colours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Colour ID
 *     responses:
 *       201:
 *         description: Colour deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Successfully delete colour!"
 *                 colour_id:
 *                   type: string
 *       404:
 *         description: Colour not found
 *       500:
 *         description: Internal server error
 */
router.delete('/master-data/colour/:id', verifyToken, deleteColourCtrl) // Delete colour

export default router