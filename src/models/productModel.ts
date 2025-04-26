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