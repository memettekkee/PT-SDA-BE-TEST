import prisma from '../../database/connection'

export const allColours = async () => {
    const colours = await prisma.colour.findMany()
    return colours
}

export const colourById = async (id: string) => {
    const colour = await prisma.colour.findUnique({
        where: {
            id: id
        }
    })
    return colour
}

export const createColour = async (name: string, hex: string) => {
    const colour = await prisma.colour.create({
        data: {
            name: name,
            hex: hex
        }
    })
    return colour
}

export const updateColour = async (id: string, name: string, hex: string) => {
    const colour = await prisma.colour.update({
        where: {
            id: id
        },
        data: {
            name: name,
            hex: hex
        }
    })
    return colour
}

export const deleteColour = async (id: string) => {
    const colour = await prisma.colour.delete({
        where: {
            id: id
        }
    })
    return colour
}