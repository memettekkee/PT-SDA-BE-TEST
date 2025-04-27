import prisma from '../../database/connection'

export const allSizes = async () => {
    const sizes = await prisma.size.findMany()
    return sizes
}

export const sizeById = async (id: string) => {
    const size = await prisma.size.findUnique({
        where: {
            id: id
        }
    })
    return size
}

export const createSize = async (name: string, length: number, width: number, height: number) => {
    const size = await prisma.size.create({
        data: {
            name: name,
            length: length,
            width: width,
            height: height
        }
    })
    return size
}

export const updateSize = async (id: string, name: string, length: number, width: number, height: number) => {
    const size = await prisma.size.update({
        where: {
            id: id
        },
        data: {
            name: name,
            length: length,
            width: width,
            height: height
        }
    })
    return size
}

export const deleteSize = async (id: string) => {
    const size = await prisma.size.delete({
        where: {
            id: id
        }
    })
    return size
}