import express from 'express'

import { 
    allCategories,
    createCategory,
    categoryById,
    updateCategory,
    deleteCategory
 } from '../../models/master-data/categoryModel'

export const getAllCategoriesCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const categories = await allCategories()
        res.status(201).json({
            error: false,
            message: "Successfully get all categories!",
            categories: categories
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

export const createCategoryCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { name, type } = req.body
        if (!name || !type) {
            res.status(422).json({
                error: true,
                message: "Please provide all fields !"
            })
            return
        }

        const category = await createCategory(name, type)
        res.status(201).json({
            error: false,
            message: "Successfully create category!",
            category: category
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

export const getCategoryByIdCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const category = await categoryById(id)

        if (!category) {
            res.status(404).json({
                error: true,
                message: "Category not found !"
            })
            return
        }

        res.status(201).json({
            error: false,
            message: "Successfully get spesific category!",
            category: category
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

export const updateCategoryCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const { name, type } = req.body
        if (!name || !type) {
            res.status(422).json({
                error: true,
                message: "Please provide all fields !"
            })
            return
        }
        const checkCategory = await categoryById(id)

        if (!checkCategory) {
            res.status(404).json({
                error: true,
                message: "Category not found !"
            })
            return
        }

        const category = await updateCategory(id, name, type)
        res.status(201).json({
            error: false,
            message: "Successfully update category!",
            category: category
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

export const deleteCategoryCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const checkCategory = await categoryById(id)

        if (!checkCategory) {
            res.status(404).json({
                error: true,
                message: "Category not found !"
            })
            return
        }
        await deleteCategory(id)
        res.status(201).json({
            error: false,
            message: "Successfully delete category!",
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