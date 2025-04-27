import prisma from '../../database/connection'

export const allCategories = async () => {
    const categories = await prisma.category.findMany()
    return categories
}

export const categoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id: id
        }
    })
    return category
}

export const createCategory = async (name: string, type: string) => {
    const category = await prisma.category.create({
        data: {
            name: name,
            type: type
        }
    })
    return category
}

export const updateCategory = async (id: string, name: string, type: string) => {
    const category = await prisma.category.update({
        where: {
            id: id
        },
        data: {
            name: name,
            type: type
        }
    })
    return category
}

export const deleteCategory = async (id: string) => {
    const category = await prisma.category.delete({
        where: {
            id: id
        }
    })
    return category
}