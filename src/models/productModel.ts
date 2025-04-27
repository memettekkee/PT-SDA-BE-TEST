import prisma from '../database/connection'
import type { Product, VariantProduct } from '../utils/interface'

export const createProduct = async (productData: Product, variants?: VariantProduct[]) => {
    let newProductId;
    return await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.create({
            data: {
                name: productData.name,
                price: productData.price,
                description: productData.description,
                discount: productData.discount,
                weight: productData.weight,
                avatar: productData.avatar,
                has_variant: variants && variants.length > 0 ? true : false,
                
                merchant: {
                    connect: {
                        id: productData.merchantId
                    }
                },
                
                ...(productData.categoryId ? {
                    category: {
                        connect: {
                            id: productData.categoryId
                        }
                    }
                } : {})
            }
        });

        newProductId = product.id;

        // Jika ada variasi, buat variasi produk
        if (variants && variants.length > 0) {
            await Promise.all(
                variants.map(variant => 
                    prisma.variantProduct.create({
                        data: {
                            sku: variant.sku,
                            stock: variant.stock,
                            product: {
                                connect: {
                                    id: product.id
                                }
                            },
                            // Connect colour jika ada
                            ...(variant.colourId ? {
                                colour: {
                                    connect: {
                                        id: variant.colourId
                                    }
                                }
                            } : {}),
                            // Connect size jika ada
                            ...(variant.sizeId ? {
                                size: {
                                    connect: {
                                        id: variant.sizeId
                                    }
                                }
                            } : {})
                        }
                    })
                )
            );
        } else {
            // Jika tidak ada variasi, buat satu variasi default
            await prisma.variantProduct.create({
                data: {
                    sku: `${product.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
                    stock: 0,
                    product: {
                        connect: {
                            id: product.id
                        }
                    }
                }
            });
        }

        if (newProductId) {
            await new Promise(resolve => setTimeout(resolve, 50));
            
            return await prisma.product.findUnique({
                where: { id: newProductId },
                include: {
                    merchant: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    category: true,
                    variantProducts: {
                        include: {
                            colour: true,
                            size: true
                        }
                    }
                }
            });
        }
    });
};

export const productById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            merchant: {
                select: {
                    id: true,
                    name: true,
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    type: true
                }
            },
            variantProducts: {
                include: {
                    colour: true,
                    size: true
                }
            }
        }
    });

    return product;
};

export const allProducts = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const product = await prisma.product.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            name: 'asc',
        },
        include: {
            merchant: {
                select: {
                    id: true,
                    name: true,
                }
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    type: true
                }
            },
            variantProducts: {
                include: {
                    colour: true,
                    size: true
                }
            }
        }
    })
    const totalProducts = await prisma.product.count();
    return {
        data: product,
        pagination: {
            total: totalProducts,
            page: page,
            limit: limit
        }
    }
}

export const isProductOwnedByUser = async (productId: string, userId: string) => {
    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            merchant: {
                userId: userId
            }
        },
        include: {
            merchant: {
                select: {
                    id: true,
                    name: true
                }
            },
            category: true,
            variantProducts: {
                include: {
                    colour: true,
                    size: true
                }
            }
        }
    });
    
    return product; 
}

export const deleteProduct = async (id: string) => {
    return await prisma.$transaction(async (prisma) => {
        await prisma.variantProduct.deleteMany({
            where: {
                productId: id
            }
        });
        
        return await prisma.product.delete({
            where: {
                id
            }
        });
    });
};

export const updateProduct = async (
    id: string, 
    productData: Partial<Product>, 
    variants?: {
        create?: VariantProduct[], 
        update?: Array<{ id: string } & Partial<VariantProduct>>,
        delete?: string[]
    }
) => {
    let updatedProductId = id;
    
    await prisma.$transaction(async (prisma) => {
        await prisma.product.update({
            where: { id },
            data: productData
        });
        
        // 2. Proses variasi jika ada
        if (variants) {
            // Tambahkan variasi baru
            if (variants.create && variants.create.length > 0) {
                await Promise.all(
                    variants.create.map(variant => 
                        prisma.variantProduct.create({
                            data: {
                                sku: variant.sku,
                                stock: variant.stock,
                                product: {
                                    connect: { id }
                                },
                                ...(variant.colourId ? {
                                    colour: {
                                        connect: { id: variant.colourId }
                                    }
                                } : {}),
                                ...(variant.sizeId ? {
                                    size: {
                                        connect: { id: variant.sizeId }
                                    }
                                } : {})
                            }
                        })
                    )
                );
            }
            
            // Update variasi yang sudah ada
            if (variants.update && variants.update.length > 0) {
                await Promise.all(
                    variants.update.map(variant => {
                        const { id: variantId, ...updateData } = variant;
                        return prisma.variantProduct.update({
                            where: { id: variantId },
                            data: {
                                ...(updateData.sku ? { sku: updateData.sku } : {}),
                                ...(updateData.stock !== undefined ? { stock: updateData.stock } : {}),
                                ...(updateData.colourId ? {
                                    colour: {
                                        connect: { id: updateData.colourId }
                                    }
                                } : {}),
                                ...(updateData.sizeId ? {
                                    size: {
                                        connect: { id: updateData.sizeId }
                                    }
                                } : {})
                            }
                        });
                    })
                );
            }
            
            // Hapus variasi yang tidak diperlukan
            if (variants.delete && variants.delete.length > 0) {
                await prisma.variantProduct.deleteMany({
                    where: {
                        id: {
                            in: variants.delete
                        }
                    }
                });
            }
        }
        
        // 3. Update flag has_variant berdasarkan jumlah variasi
        const variantCount = await prisma.variantProduct.count({
            where: { productId: id }
        });
        
        // Jika tidak ada variasi tersisa, buat satu variasi default
        if (variantCount === 0) {
            const product = await prisma.product.findUnique({
                where: { id }
            });
            
            if (product) {
                await prisma.variantProduct.create({
                    data: {
                        sku: `${product.name.substring(0, 3).toUpperCase()}-${Date.now()}`,
                        stock: 0,
                        product: {
                            connect: { id }
                        }
                    }
                });
                
                await prisma.product.update({
                    where: { id },
                    data: { has_variant: false }
                });
            }
        } else {
            // Update has_variant (true jika > 1 variasi, false jika hanya 1)
            await prisma.product.update({
                where: { id },
                data: { has_variant: variantCount > 1 }
            });
        }
    });
    
    // Query produk yang sudah diupdate
    return await prisma.product.findUnique({
        where: { id: updatedProductId },
        include: {
            merchant: {
                select: {
                    id: true,
                    name: true
                }
            },
            category: true,
            variantProducts: {
                include: {
                    colour: true,
                    size: true
                }
            }
        }
    });
};

export const getProductVariants = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        select: {
            id: true,
            name: true,
            has_variant: true
        }
    });
    
    if (!product) {
        return null;
    }
    
    const variants = await prisma.variantProduct.findMany({
        where: {
            productId
        },
        include: {
            colour: true,
            size: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    
    return {
        product: {
            id: product.id,
            name: product.name,
            has_variant: product.has_variant
        },
        variants
    };
};

export const addProductVariant = async (productId: string, variantData: Partial<VariantProduct>) => {
    return await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });
        
        if (!product) {
            return null;
        }
        
        const newVariant = await prisma.variantProduct.create({
            data: {
                sku: variantData.sku!,
                stock: variantData.stock || 0,
                product: {
                    connect: { id: productId }
                },
                ...(variantData.colourId ? {
                    colour: {
                        connect: { id: variantData.colourId }
                    }
                } : {}),
                ...(variantData.sizeId ? {
                    size: {
                        connect: { id: variantData.sizeId }
                    }
                } : {})
            },
            include: {
                colour: true,
                size: true
            }
        });
        
        // Count number of variants for this product
        const variantCount = await prisma.variantProduct.count({
            where: { productId }
        });
        
        // Update product has_variant flag if there's more than one variant
        if (variantCount > 1 && !product.has_variant) {
            await prisma.product.update({
                where: { id: productId },
                data: { has_variant: true }
            });
        }
        
        return {
            product: {
                id: product.id,
                name: product.name,
                has_variant: variantCount > 1
            },
            variant: newVariant
        };
    });
};

export const existingSku = async (sku: string) => {
    const existingSku = await prisma.variantProduct.findFirst({
        where: { sku }
    });
    return existingSku
}

export const updateProductVariant = async (variantId: string, updateData: Partial<VariantProduct>) => {
    const existingVariant = await prisma.variantProduct.findUnique({
        where: { id: variantId },
        include: { product: true }
    });
    
    if (!existingVariant) {
        return null;
    }
    
    const data: any = {};
    
    if (updateData.stock !== undefined) {
        data.stock = updateData.stock;
    }
    
    if (updateData.sku) {
        // Check if the new SKU is already used (excluding this variant)
        const duplicateSku = await prisma.variantProduct.findFirst({
            where: {
                sku: updateData.sku,
                id: { not: variantId }
            }
        });
        
        if (duplicateSku) {
            throw new Error('SKU already exists');
        }
        
        data.sku = updateData.sku;
    }
    
    // Handle colour update if provided
    if (updateData.colourId) {
        data.colour = {
            connect: { id: updateData.colourId }
        };
    }
    
    // Handle size update if provided
    if (updateData.sizeId) {
        data.size = {
            connect: { id: updateData.sizeId }
        };
    }

    if (Object.keys(data).length === 0) {
        return existingVariant;
    }
    
    const updatedVariant = await prisma.variantProduct.update({
        where: { id: variantId },
        data,
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    has_variant: true
                }
            },
            colour: true,
            size: true
        }
    });
    
    return updatedVariant;
};

export const variantInProduct = async (variantId: string, id: string) => {
    const variant = await prisma.variantProduct.findFirst({
        where: {
            id: variantId,
            productId: id
        }
    });
    return variant
}

export const deleteProductVariant = async (productId: string, variantId: string) => {
    return await prisma.$transaction(async (prisma) => {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });
        
        if (!product) {
            return { success: false, reason: 'product_not_found' };
        }
        
        // Check if variant exists and belongs to this product
        const variant = await prisma.variantProduct.findFirst({
            where: {
                id: variantId,
                productId: productId
            }
        });
        
        if (!variant) {
            return { success: false, reason: 'variant_not_found' };
        }
        
        const variantCount = await prisma.variantProduct.count({
            where: { productId }
        });
        
        if (variantCount === 1) {
            return { 
                success: false, 
                reason: 'cannot_delete_last_variant',
                message: 'Cannot delete the last variant of a product. Create a new variant first or delete the entire product.'
            };
        }
        
        await prisma.variantProduct.delete({
            where: { id: variantId }
        });
        
        // Update has_variant flag if only one variant in the product
        const remainingCount = variantCount - 1;
        if (remainingCount === 1 && product.has_variant) {
            await prisma.product.update({
                where: { id: productId },
                data: { has_variant: false }
            });
        }
        
        return { 
            success: true, 
            deletedVariantId: variantId,
            remainingVariantCount: remainingCount,
            productHasVariant: remainingCount > 1
        };
    });
};

export const getProductsByCategory = async (categoryId: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const category = await prisma.category.findUnique({
        where: { id: categoryId }
    });
    
    if (!category) {
        return null;
    }
    
    const products = await prisma.product.findMany({
        where: {
            categoryId
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            merchant: {
                select: {
                    id: true,
                    name: true,
                }
            },
            category: true,
            variantProducts: {
                include: {
                    colour: true,
                    size: true
                }
            }
        }
    });

    const totalProducts = await prisma.product.count({
        where: {
            categoryId
        }
    });

    return {
        category,
        products,
        pagination: {
            total: totalProducts,
            page,
            limit,
            totalPages: Math.ceil(totalProducts / limit)
        }
    };
};

export const searchProductsByName = async (searchTerm: string, page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    if (!searchTerm || searchTerm.trim() === '') {
        return {
            products: [],
            pagination: {
                total: 0,
                page,
                limit,
                totalPages: 0
            }
        };
    }
    
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: searchTerm,
                mode: 'insensitive' 
            }
        },
        skip,
        take: limit,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            merchant: {
                select: {
                    id: true,
                    name: true,
                }
            },
            category: true,
            variantProducts: {
                include: {
                    colour: true,
                    size: true
                }
            }
        }
    });

    const totalProducts = await prisma.product.count({
        where: {
            name: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        }
    });

    return {
        products,
        pagination: {
            total: totalProducts,
            page,
            limit,
            totalPages: Math.ceil(totalProducts / limit)
        }
    };
};