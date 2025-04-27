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

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product management
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - merchantId
 *               - name
 *               - price
 *             properties:
 *               merchantId:
 *                 type: string
 *                 description: ID of the merchant that owns this product
 *               name:
 *                 type: string
 *                 description: Product name
 *               price:
 *                 type: number
 *                 description: Product price (must be positive)
 *               description:
 *                 type: string
 *                 description: Product description
 *               discount:
 *                 type: number
 *                 description: Discount amount (optional)
 *               weight:
 *                 type: number
 *                 description: Product weight (optional)
 *               categoryId:
 *                 type: string
 *                 description: Category ID (optional)
 *               has_variant:
 *                 type: boolean
 *                 description: Whether the product has variants
 *               variants:
 *                 type: array
 *                 description: Product variants (required if has_variant=true)
 *                 items:
 *                   type: object
 *                   properties:
 *                     sku:
 *                       type: string
 *                     stock:
 *                       type: number
 *                     colourId:
 *                       type: string
 *                     sizeId:
 *                       type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Product image
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: "Product created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       403:
 *         description: Forbidden (user doesn't own the merchant)
 *       422:
 *         description: Validation error (missing required fields or invalid data)
 *       500:
 *         description: Internal server error
 */
router.post('/product', verifyToken, upload.product.single('avatar'), createProductCtrl) // Create product

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
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
 *                   example: "Successfully get product by id"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/product/:id', verifyToken, getProductByIdCtrl) // Get product by id

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
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
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: "Successfully get all products"
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
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
router.get('/products', verifyToken, getAllProductsCtrl) // Get all products

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *                   example: "Successfully delete product"
 *                 product_id:
 *                   type: string
 *       403:
 *         description: Forbidden (user doesn't own the product)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/product/:id', verifyToken, deleteProductCtrl) // Delete product

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               weight:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               has_variant:
 *                 type: boolean
 *               variants:
 *                 type: object
 *                 properties:
 *                   create:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/VariantInput'
 *                   update:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/VariantUpdateInput'
 *                   delete:
 *                     type: array
 *                     items:
 *                       type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: "Successfully update product"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       403:
 *         description: Forbidden (user doesn't own the product)
 *       404:
 *         description: Product not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/product/:id', verifyToken, upload.product.single('avatar'), updateProductCtrl) // Update product

// Manipulate product variant

/**
 * @swagger
 * /product/{id}/variants:
 *   get:
 *     summary: Get all variants of a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product variants retrieved successfully
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
 *                   example: "Product variants retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/product/:id/variants', verifyToken, getAllProductVariantsCtrl) // Get all product variants

/**
 * @swagger
 * /product/{id}/variant:
 *   post:
 *     summary: Add a variant to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *             properties:
 *               sku:
 *                 type: string
 *                 description: Unique SKU for the variant
 *               stock:
 *                 type: number
 *                 description: Initial stock count
 *               colourId:
 *                 type: string
 *                 description: Colour ID (optional)
 *               sizeId:
 *                 type: string
 *                 description: Size ID (optional)
 *     responses:
 *       201:
 *         description: Variant added successfully
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
 *                   example: "Product variant added successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       403:
 *         description: Forbidden (user doesn't own the product)
 *       404:
 *         description: Product not found
 *       422:
 *         description: Validation error (missing SKU or invalid stock)
 *       500:
 *         description: Internal server error
 */
router.post('/product/:id/variant', verifyToken, upload.product.none(), addProductVariantCtrl) // Add product variant

/**
 * @swagger
 * /product/{id}/variant/{variantId}:
 *   put:
 *     summary: Update a product variant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               stock:
 *                 type: number
 *               colourId:
 *                 type: string
 *               sizeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Variant updated successfully
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
 *                   example: "Product variant updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: No update data provided
 *       403:
 *         description: Forbidden (user doesn't own the product)
 *       404:
 *         description: Product or variant not found
 *       422:
 *         description: Validation error (invalid stock)
 *       500:
 *         description: Internal server error
 */
router.put('/product/:id/variant/:variantId', verifyToken, upload.product.none(), updateProductVariantCtrl) // Update product variant

/**
 * @swagger
 * /product/{id}/variant/{variantId}:
 *   delete:
 *     summary: Delete a product variant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
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
 *                   example: "Product variant deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedVariantId:
 *                       type: string
 *                     remainingVariantCount:
 *                       type: number
 *                     productHasVariant:
 *                       type: boolean
 *       403:
 *         description: Forbidden (user doesn't own the product)
 *       404:
 *         description: Product or variant not found
 *       422:
 *         description: Cannot delete last variant
 *       500:
 *         description: Internal server error
 */
router.delete('/product/:id/variant/:variantId', verifyToken, deleteProductVariantCtrl) // Delete product variant

// Filter product by category

/**
 * @swagger
 * /products/category/{id}:
 *   get:
 *     summary: Get products by category with pagination
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: "Products retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         type:
 *                           type: string
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid page or limit parameters
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get('/products/category/:id', verifyToken, getProductsByCategoryCtrl) // Get all products by category

// Search product by name

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by name
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
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
 *       200:
 *         description: Search completed successfully
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
 *                   example: "Search completed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     searchTerm:
 *                       type: string
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Missing search term or invalid page/limit
 *       500:
 *         description: Internal server error
 */
router.get('/products/search', verifyToken, searchProductsCtrl) // Search products

export default router