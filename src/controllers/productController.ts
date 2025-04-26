import express from 'express'

import { 
    isMerchantOwnedByUser 
} from '../models/merchantModel';
import { 
    allProducts, 
    createProduct, 
    productById, 
    deleteProduct, 
    isProductOwnedByUser, 
    updateProduct 
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
            avatar
        } = req.body;
        
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
        
        const product = await deleteProduct(id);
        res.status(200).json({
            error: false,
            message: "Successfully delete product",
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
            avatar
        } = req.body;

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

