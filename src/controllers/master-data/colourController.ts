import express from 'express'

import { 
    allColours,
    createColour,
    colourById,
    updateColour,
    deleteColour
 } from '../../models/master-data/colourModel'

export const getAllColoursCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const colours = await allColours()
        res.status(201).json({
            error: false,
            message: "Successfully get all colours!",
            colours: colours
        })
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        })
        return
    }
}

export const getColourByIdCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const colour = await colourById(id)

        if (!colour) {
            res.status(404).json({
                error: true,
                message: "Colour not found !"
            })
            return
        }

        res.status(201).json({
            error: false,
            message: "Successfully get spesific colour!",
            colour: colour
        })
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        })
        return
    }
}

export const createColourCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, hex } = req.body
        const colour = await createColour(name, hex)
        res.status(201).json({
            error: false,
            message: "Successfully create colour!",
            colour: colour
        })
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        })
        return
    }
}

export const updateColourCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const { name, hex } = req.body

        if (!name && !hex) {
            res.status(422).json({
                error: true,
                message: "Please provide all required fields !"
            })
            return
        }
        const checkColour = await colourById(id)

        if (!checkColour) {
            res.status(404).json({
                error: true,
                message: "Colour not found !"
            })
            return
        }

        const colour = await updateColour(id, name, hex)
        res.status(201).json({
            error: false,
            message: "Successfully update colour!",
            colour: colour
        })
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        })
        return
    }
}

export const deleteColourCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const checkColour = await colourById(id)

        if (!checkColour) {
            res.status(404).json({
                error: true,
                message: "Colour not found !"
            })
            return
        }
        
        await deleteColour(id)
        res.status(201).json({
            error: false,
            message: "Successfully delete colour!",
        })
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e.message
        })
        return
    }
}
