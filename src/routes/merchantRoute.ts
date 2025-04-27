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

/**
 * @swagger
 * tags:
 *   name: Merchants
 *   description: Merchant management
 */

/**
 * @swagger
 * /merchants:
 *   get:
 *     summary: Get all merchants with pagination
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       201:
 *         description: Successfully retrieved merchants
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
 *                   example: "Successfully get all merchants !"
 *                 merchants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Merchant'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/merchants', verifyToken, getAllMerchantsCtrl) // Get all merchants

/**
 * @swagger
 * /merchant:
 *   post:
 *     summary: Create a new merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Merchant created successfully
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
 *                   example: "Successfully create merchant !"
 *                 merchant:
 *                   $ref: '#/components/schemas/Merchant'
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/merchant', verifyToken, upload.merchant.single('avatar'), createMerchantCtrl) // Create merchant

/**
 * @swagger
 * /merchant/{id}:
 *   get:
 *     summary: Get a merchant by ID
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     responses:
 *       201:
 *         description: Successfully retrieved merchant
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
 *                   example: "Successfully get specific merchant!"
 *                 merchant:
 *                   $ref: '#/components/schemas/Merchant'
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Internal server error
 */
router.get('/merchant/:id', verifyToken, getMerchantByIdCtrl) // Get merchant by id

/**
 * @swagger
 * /merchant/{id}:
 *   put:
 *     summary: Update a merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Merchant updated successfully
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
 *                   example: "Successfully update merchant !"
 *                 merchant:
 *                   $ref: '#/components/schemas/Merchant'
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Merchant not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/merchant/:id', verifyToken, upload.merchant.single('avatar'), updateMerchantCtrl) // Update merchant

/**
 * @swagger
 * /merchant/{id}:
 *   delete:
 *     summary: Delete a merchant
 *     tags: [Merchants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Merchant ID
 *     responses:
 *       201:
 *         description: Merchant deleted successfully
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
 *                   example: "Merchant successfully deleted !"
 *                 merchant_id:
 *                   type: string
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Merchant not found
 *       500:
 *         description: Internal server error
 */
router.delete('/merchant/:id', verifyToken, deleteMerchantCtrl) // Delete merchant

export default router