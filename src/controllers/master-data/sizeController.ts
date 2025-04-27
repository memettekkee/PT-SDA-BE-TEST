import express from 'express'

import { 
    allSizes,
    createSize,
    sizeById,
    updateSize,
    deleteSize
 } from '../../models/master-data/sizeModel'

export const getAllSizesCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const sizes = await allSizes()
        res.status(201).json({
            error: false,
            message: "Successfully get all sizes!",
            sizes: sizes
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

export const createSizeCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, length, width, height } = req.body
        if (!name && !length && !width && !height) {
            res.status(422).json({
                error: true,
                message: "Please provide all required fields !"
            })
            return
        }

        const size = await createSize(name, length, width, height) 
        res.status(201).json({
            error: false,
            message: "Successfully create size!",
            size: size
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

export const getSizeByIdCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const size = await sizeById(id)

        if (!size) {
            res.status(404).json({
                error: true,
                message: "Size not found !"
            })
            return
        }

        res.status(201).json({
            error: false,
            message: "Successfully get spesific size!",
            size: size
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

export const updateSizeCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const { name, length, width, height } = req.body
        if (!name && !length && !width && !height) {
            res.status(422).json({
                error: true,
                message: "Please provide all required fields !"
            })
            return
        }

        const checkSize = await sizeById(id)

        if (!checkSize) {
            res.status(404).json({
                error: true,
                message: "Size not found !"
            })
            return
        }

        const size = await updateSize(id, name, length, width, height)
        res.status(201).json({
            error: false,
            message: "Successfully update size!",
            size: size
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

export const deleteSizeCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const checkSize = await sizeById(id)

        if (!checkSize) {
            res.status(404).json({
                error: true,
                message: "Size not found !"
            })
            return
        }

        await deleteSize(id)
        res.status(201).json({
            error: false,
            message: "Successfully delete size!",
            size_id: id
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
