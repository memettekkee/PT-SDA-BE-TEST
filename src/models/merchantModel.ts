import prisma from '../database/connection'
import type { Merchant, UpdateMerchant } from '../utils/interface'

export const allMerchants = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    const merchant = await prisma.merchant.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            name: 'asc',
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    avatar: true,
                    phone: true
                }
            },
            products: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
    const totalMerchants = await prisma.merchant.count();
    return {
        data: merchant,
        pagination: {
            total: totalMerchants,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalMerchants / limit)
        }
    };
}

export const merchantById = async (id: string) => {
    const merchant = await prisma.merchant.findUnique({
        where: {id: id},
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    avatar: true,
                    phone: true
                }
            }
        }
    })
    return merchant
}

export const createMerchant = async (userId: string, merchantData: Merchant) => {
    const merchant = await prisma.merchant.create({
        data: {
            ...merchantData,
            userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    avatar: true,
                    phone: true
                }
            }
        }
    })
    return merchant
}

export const isMerchantOwnedByUser = async (merchantId: string, userId: string) => {
    const merchant = await prisma.merchant.findFirst({
        where: {
            id: merchantId,
            userId: userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    avatar: true,
                    phone: true
                }
            }
        }
    });
    
    return merchant; 
}

export const updateMerchant = async (merchantId: string, merchantData: UpdateMerchant) => {
    const merchant = await prisma.merchant.update({
        where: {
            id: merchantId
        },
        data: {
            ...merchantData
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullname: true,
                    avatar: true,
                    phone: true
                }
            }
        }
    })
    return merchant
}

export const deleteMerchant = async (merchantId: string) => {
    const merchant = await prisma.merchant.delete({
        where: {
            id: merchantId
        }
    })
    return merchant
}