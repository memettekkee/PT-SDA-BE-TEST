import express from 'express'
import { 
    allMerchants,
    createMerchant,
    deleteMerchant,
    isMerchantOwnedByUser,
    merchantById, 
    updateMerchant
} from '../models/merchantModel'
import { isPhoneNumberValid } from '../utils/helpers';

export const getAllMerchantsCtrl = async (
    req: express.Request,
    res: express.Response   
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await allMerchants(page, limit)

        res.status(201).json({
            error: false,
            message: "Successfully get all merchants !",
            merchants: result.data,
            pagination: result.pagination
        })
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e
        })
        return
    }
}

export const createMerchantCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const {
            name,
            email,
            address,
            phone,
            type
        } = req.body
        const userId = req.user?.id;

        let avatar = 'default-merch.png' 
        
        if (req.file) {
            avatar = req.file.filename;
        }

        if (phone) {
            if (!isPhoneNumberValid(phone)) {
                res.status(422).json({
                    error: true,
                    message: "Phone number is not valid !"
                })
                return
            }
        }

        if (!name || !address) {
            res.status(422).json({
                error: true,
                message: "Please atleast provide name and address !"
            })
            return
        }

        const merchantData = {
            name,
            email: email?.trim() ? email : `${name.toLowerCase().replace(/\s/g, '')}@mail.com`,
            address,
            phone,
            avatar,
            type: type?.trim() ? type : 'Merchant'
        }

        const data = await createMerchant(userId as string, merchantData)

        res.status(201).json({
            error: false,
            message: "Successfully create merchant !",
            merchant: data
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

export const getMerchantByIdCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const data = await merchantById(id)

        res.status(201).json({
            error: false,
            message: "Successfully get spesific merchant!",
            merchant: data
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

export const updateMerchantCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const {
            name,
            email,
            address,
            phone,
            type,
            status
        } = req.body
        const { id } = req.params
        const userId = req.user?.id

        let avatar = 'default-merch.png' 
        
        if (req.file) {
            avatar = req.file.filename;
        }

        if (phone) {
            if (!isPhoneNumberValid(phone)) {
                res.status(422).json({
                    error: true,
                    message: "Phone number is not valid !"
                })
                return
            }
        }

        if (!name || !address) {
            res.status(422).json({
                error: true,
                message: "Please atleast provide name and address !"
            })
            return
        }

        const checkMerchant = await merchantById(id)
        if (!checkMerchant) {
            res.status(404).json({
                error: true,
                message: "Merchant not found !"
            })
            return
        }

        const userMerchant = await isMerchantOwnedByUser(id, userId as string)
        if (!userMerchant) {
            res.status(403).json({
                error: true,
                message: "Can't update merchant that not owned by this user !"
            })
            return
        }

        const merchantData = {
            name,
            email: email?.trim() ? email : `${name.toLowerCase().replace(/\s/g, '')}@mail.com`,
            address,
            phone,
            avatar,
            status,
            type: type?.trim() ? type : 'Merchant'
        }

        const data = await updateMerchant(id, merchantData)
        res.status(201).json({
            error: false,
            message: "Successfully update merchant !",
            merchant: data
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

export const deleteMerchantCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const userId = req.user?.id

        const checkMerchant = await merchantById(id)
        if (!checkMerchant) {
            res.status(404).json({
                error: true,
                message: "Merchant not found !"
            })
            return
        }

        const userMerchant = await isMerchantOwnedByUser(id, userId as string)
        if (!userMerchant) {
            res.status(403).json({
                error: true,
                message: "Can't delete merchant that not owned by this user !"
            })
            return
        }

        await deleteMerchant(id)
        res.status(201).json({
            error: false,
            message: "Merchant successfully deleted !",
            merchant_id: id
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