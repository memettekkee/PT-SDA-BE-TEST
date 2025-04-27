import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { 
    existingUser, 
    registerUser, 
    userById,
    allUsers, 
    userLogin,
    updateUser
} from '../models/userModel'

import { 
    isPasswordValid,
    isEmailValid,
    isPhoneNumberValid
} from '../utils/helpers'

export const registerCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { 
            username,
            fullname,
            email, 
            password,
            gender,
            birth,
            address,
            phone,
        } = req.body

        if (!username || !fullname || !email || !password || !phone) {
            res.status(422).json({
                error: true,
                message: "Please provide all required fields !"
            })
            return
        }

        if (!isPasswordValid(password)) {
            res.status(422).json({
                error: true,
                message: "Password is not strong enough !"
            })
            return
        }

        if (!isEmailValid(email)) {
            res.status(422).json({
                error: true,
                message: "Email is not valid !"
            })
            return
        }

        if (!isPhoneNumberValid(phone)) {
            res.status(422).json({
                error: true,
                message: "Phone number is not valid !"
            })
            return
        }

        if ( await existingUser(username, email)) {
            res.status(409).json({
                error: true,
                message: "User already exist !"
            })
            return
        }

        let hashedPass = await bcrypt.hashSync(password, 10)

        const userData = {
            username,
            fullname,
            email,
            password: hashedPass,
            gender,
            birth,
            address,
            phone,
            avatar: 'default-user.png'
        }

        await registerUser(userData)

        res.status(201).json({
            error: false,
            message: "User created !",
            user: userData
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

export const loginCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { username, password } = req.body

        const checkUser = await userLogin(username)
        const validPassword = await bcrypt.compare(password, checkUser?.password?.toString() || '')

        if ( !checkUser && !validPassword) {
            res.status(401).json({
                error: true,
                message: "Wrong Username or Password !"
            })
            return
        }

        const token = jwt.sign(
            { 
                id: checkUser?.id, 
                email: checkUser?.email 
            },
            process.env.JWT_SECRET || 'default_jwt_secret',
            { expiresIn: '24h' } 
        );

        res.status(200).json({
            error: false,
            message: "Login success !",
            user: checkUser,
            token: token
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

export const getAllUserCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await allUsers(page, limit);
        
        res.status(200).json({
            error: false,
            message: "Success get all users",
            users: result.data,
            pagination: result.pagination
        });
        return
    } catch (e: any) {
        res.status(500).json({
            error: true,
            message: e
        })
        return
    }
}

export const getUserById = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params
        const user = await userById(id)

        if (!user) {
            res.status(404).json({
                error: true,
                message: "User not found !"
            })
            return
        }

        res.status(201).json({
            error: false,
            message: "Successfully get user by id !",
            user: user
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

export const updateUserCtrl = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { 
            username,
            fullname,
            email, 
            gender,
            birth,
            address,
            phone,
        } = req.body
        const userId = req.user?.id;
    
        const checkUser = await userById(userId as string)
    
        if (userId != checkUser?.id) {
            res.status(403).json({
                error: true,
                message: "Can't update different user !"
            })
            return;
        }

        let avatar = 'default-user.png' 
        
        if (req.file) {
            avatar = req.file.filename;
        }

        const updateForm = {
            username,
            fullname,
            email,
            gender,
            birth,
            address,
            phone,
            avatar
        }

        const updatedData = await updateUser(userId as string, updateForm)

        res.status(200).json({
            error: false,
            message: "User updated !",
            user: updatedData
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