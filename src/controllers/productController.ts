import express from 'express'

import type { VariantProduct } from '../utils/interface';

import { 
    isMerchantOwnedByUser 
} from '../models/merchantModel';

import { 
    allProducts, 
    createProduct, 
    productById, 
    deleteProduct, 
    isProductOwnedByUser, 
    updateProduct, 
    getProductVariants,
    addProductVariant,
    existingSku,
    updateProductVariant,
    variantInProduct,
    deleteProductVariant,
    getProductsByCategory,
    searchProductsByName
} from '../models/productModel';

export const createProductCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const userId = req.user?.id;
        const { merchantId } = req.body; 
        
        if (!merchantId) {
            res.status(422).json({
                error: true,
                message: 'Merchant ID is required!'
            });
            return
        }
        
        const merchant = await isMerchantOwnedByUser(merchantId, userId as string);
        
        if (!merchant) {
            res.status(403).json({
                error: true,
                message: 'You do not have access to this merchant or merchant does not exist'
            });
            return
        }
        
        const {
            name,
            price,
            description,
            discount,
            weight,
            categoryId,
            variants,
            has_variant,
        } = req.body;

        let avatar = 'default-product.png' 
        
        if (req.file) {
            avatar = req.file.filename;
        }
        
        if (!name || !price) {
            res.status(422).json({
                error: true,
                message: "Product name and price are required!"
            });
            return
        }
        
        if (isNaN(price) || price <= 0) {
            res.status(422).json({
                error: true,
                message: "Price must be a positive number!"
            });
            return
        }
        
        const productData = {
            name,
            price: Number(price),
            description,
            discount: discount ? Number(discount) : 0,
            weight: weight ? Number(weight) : 0,
            categoryId: categoryId || null,
            merchantId: merchant.id,
            has_variant: has_variant || false, 
            avatar: avatar 
        };

        // Validasi konsistensi has_variant
        if (has_variant === true && (!variants || variants.length === 0)) {
            res.status(422).json({
                error: true,
                message: "Product marked as having variants but no variants provided"
            });
            return
        }

        if (has_variant === false && variants && variants.length > 0) {
            res.status(422).json({
                error: true,
                message: "Product marked as not having variants but variants were provided"
            });
            return
        }
        
        // Validasi variants jika ada
        if (variants && Array.isArray(variants)) {
            // Cek apakah setiap variant memiliki sku dan stock
            for (const variant of variants) {
                if (!variant.sku) {
                    res.status(422).json({
                        error: true,
                        message: "Each variant must have an SKU!"
                    });
                    return
                }
                
                if (isNaN(variant.stock) || variant.stock < 0) {
                    res.status(422).json({
                        error: true,
                        message: "Stock must be a non-negative number!"
                    });
                    return
                }
            }
        }
        
        const product = await createProduct(productData, variants);
        
        res.status(201).json({
            error: false,
            message: 'Product created successfully',
            data: product
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
};

export const getProductByIdCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const product = await productById(id);
        
        res.status(200).json({
            error: false,
            message: "Successfully get product by id",
            product: product
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
};

export const getAllProductsCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await allProducts(page, limit)
        
        res.status(200).json({
            error: false,
            message: "Successfully get all products",
            products: result.data,
            pagination: result.pagination
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
};

export const deleteProductCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const checkProduct = await productById(id);
        if (!checkProduct) {
            res.status(404).json({
                error: true,
                message: "Product not found"
            });
            return
        }

        const userProduct = await isProductOwnedByUser(id, userId as string);
        if (!userProduct) {
            res.status(403).json({
                error: true,
                message: "Can't delete product that not owned by this user !"
            });
            return
        }
        
        await deleteProduct(id);
        res.status(200).json({
            error: false,
            message: "Successfully delete product",
            product_id: id
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
};

export const updateProductCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const {
            name,
            price,
            description,
            discount,
            weight,
            categoryId,
            has_variant,
            variants,
        } = req.body;

        let avatar = 'default-product.png' 
        
        if (req.file) {
            avatar = req.file.filename;
        }

        const checkProduct = await productById(id);
        if (!checkProduct) {
            res.status(404).json({
                error: true,
                message: "Product not found"
            });
            return
        }

        const userProduct = await isProductOwnedByUser(id, userId as string);
        if (!userProduct) {
            res.status(403).json({
                error: true,
                message: "Can't update product that not owned by this user !"
            });
            return
        }

        const productData = {
            name,
            price,
            description,
            discount,
            weight,
            categoryId,
            has_variant,
            avatar
        };

        let variantData;
        if (variants) {
            variantData = {
                create: variants.create || [],
                update: variants.update || [],
                delete: variants.delete || []
            };
            
            // Validasi data variasi
            if (variantData.create.length > 0) {
                for (const variant of variantData.create) {
                    if (!variant.sku) {
                        res.status(422).json({
                            error: true,
                            message: "Each new variant must have an SKU"
                        });
                        return
                    }
                    if (variant.stock === undefined || isNaN(variant.stock)) {
                        res.status(422).json({
                            error: true,
                            message: "Each new variant must have valid stock"
                        });
                        return
                    }
                }
            }
            
            if (variantData.update.length > 0) {
                for (const variant of variantData.update) {
                    if (!variant.id) {
                        res.status(422).json({
                            error: true,
                            message: "Each variant to update must specify its ID"
                        });
                        return
                    }
                }
            }
        }
        
        const data = await updateProduct(id, productData, variantData);
        res.status(200).json({
            error: false,
            message: "Successfully update product",
            product: data
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
};

export const getAllProductVariantsCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        
        const result = await getProductVariants(id);
        
        if (!result) {
            res.status(404).json({
                error: true,
                message: "Product not found"
            });
            return
        }
        
        res.status(200).json({
            error: false,
            message: "Product variants retrieved successfully",
            data: result
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
}

export const addProductVariantCtrl = async (
    req: express.Request, 
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        const product = await isProductOwnedByUser(id, userId as string);
        if (!product) {
            res.status(403).json({
                error: true,
                message: "You don't have permission to modify this product or product doesn't exist"
            });
            return
        }
        
        const { sku, stock, colourId, sizeId } = req.body;
        if (!sku) {
            res.status(422).json({
                error: true,
                message: "SKU is required for product variant"
            });
            return
        }
        
        const checkSku = await existingSku(sku);
        if (checkSku) {
            res.status(422).json({
                error: true,
                message: "SKU already exists, must be unique"
            });
            return
        }
        
        // Validate stock
        if (stock !== undefined && (isNaN(stock) || stock < 0)) {
            res.status(422).json({
                error: true,
                message: "Stock must be a non-negative number"
            });
            return
        }
        
        const variantData: Partial<VariantProduct> = {
            sku,
            stock: stock ? Number(stock) : 0,
            colourId,
            sizeId
        };
        
        // Add variant
        const result = await addProductVariant(id, variantData);
        if (!result) {
            res.status(404).json({
                error: true,
                message: "Product not found"
            });
            return
        }
        
        res.status(201).json({
            error: false,
            message: "Product variant added successfully",
            data: result
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return
    }
};

/**
 * Update a product variant
 */
export const updateProductVariantCtrl = async (
    req: express.Request, 
    res: express.Response
) => {
    try {
        const { id, variantId } = req.params;
        const userId = req.user?.id;
        
        const product = await isProductOwnedByUser(id, userId as string);
        if (!product) {
            res.status(403).json({
                error: true,
                message: "You don't have permission to modify this product or product doesn't exist"
            });
            return;
        }
        
        const checkVariantInProduct = await variantInProduct(variantId, id);
        if (!checkVariantInProduct) {
            res.status(404).json({
                error: true,
                message: "Variant not found or doesn't belong to this product"
            });
            return;
        }
        
        const { sku, stock, colourId, sizeId } = req.body;
        
        // Validate stock if provided
        if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
            res.status(422).json({
                error: true,
                message: "Stock must be a non-negative number"
            });
            return;
        }
        
        const updateData: Partial<VariantProduct> = {
            sku,
            stock: stock ? Number(stock) : undefined,
            colourId,
            sizeId
        };
        
        // If nothing to update
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({
                error: true,
                message: "No update data provided"
            });
            return;
        }
        
        const updatedVariant = await updateProductVariant(variantId, updateData);
        res.status(200).json({
            error: false,
            message: "Product variant updated successfully",
            data: updatedVariant
        });
        return;
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return;
    }
};

export const deleteProductVariantCtrl = async (
    req: express.Request, 
    res: express.Response
) => {
    try {
        const { id, variantId } = req.params;
        const userId = req.user?.id;
        
        const product = await isProductOwnedByUser(id, userId as string);
        if (!product) {
            res.status(403).json({
                error: true,
                message: "You don't have permission to modify this product or product doesn't exist"
            });
            return;
        }
        
        const result = await deleteProductVariant(id, variantId);
        if (!result.success) {
            switch (result.reason) {
                case 'product_not_found':
                    res.status(404).json({
                        error: true,
                        message: "Product not found"
                    });
                    return;
                    
                case 'variant_not_found':
                    res.status(404).json({
                        error: true,
                        message: "Variant not found or doesn't belong to this product"
                    });
                    return;
                    
                case 'cannot_delete_last_variant':
                    res.status(422).json({
                        error: true,
                        message: result.message
                    });
                    return;
                    
                default:
                    res.status(500).json({
                        error: true,
                        message: "Failed to delete variant"
                    });
                    return;
            }
        }
        
        res.status(200).json({
            error: false,
            message: "Product variant deleted successfully",
            data: {
                deletedVariantId: result.deletedVariantId,
                remainingVariantCount: result.remainingVariantCount,
                productHasVariant: result.productHasVariant
            }
        });
        return;
        
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return;
    }
};

export const getProductsByCategoryCtrl = async (
    req: express.Request, 
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        if (page < 1) {
            res.status(400).json({
                error: true,
                message: "Page number must be at least 1"
            });
            return;
        }
        
        if (limit < 1 || limit > 50) {
            res.status(400).json({
                error: true,
                message: "Limit must be between 1 and 50"
            });
            return;
        }
        
        const result = await getProductsByCategory(id, page, limit);
        
        if (!result) {
            res.status(404).json({
                error: true,
                message: "Category not found"
            });
            return;
        }
        
        res.status(200).json({
            error: false,
            message: "Products retrieved successfully",
            data: {
                category: {
                    id: result.category.id,
                    name: result.category.name,
                    type: result.category.type
                },
                products: result.products,
                pagination: result.pagination
            }
        });
        return;
        
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return;
    }
};

export const searchProductsCtrl = async (
    req: express.Request, 
    res: express.Response
) => {
    try {
        const searchTerm = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        if (!searchTerm) {
            res.status(400).json({
                error: true,
                message: "Search term (q) is required"
            });
            return;
        }
        
        if (page < 1) {
            res.status(400).json({
                error: true,
                message: "Page number must be at least 1"
            });
            return;
        }
        
        if (limit < 1 || limit > 50) {
            res.status(400).json({
                error: true,
                message: "Limit must be between 1 and 50"
            });
            return;
        }
        
        const result = await searchProductsByName(searchTerm, page, limit);
        res.status(200).json({
            error: false,
            message: "Search completed successfully",
            data: {
                searchTerm,
                products: result.products,
                pagination: result.pagination
            }
        });
        return;
        
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        });
        return;
    }
};

