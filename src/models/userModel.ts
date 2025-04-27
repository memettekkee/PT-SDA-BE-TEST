import crypto from 'crypto';
import bcrypt from 'bcrypt';

import prisma from '../database/connection'
import type { User, UpdateUser } from '../utils/interface'

export const registerUser = async (userData: User) => {
    const user = await prisma.user.create({ 
        data: userData 
    })
    return user
}

export const resetPassword = async (email: string) => {
    const user = await prisma.user.findFirst({
      where: { email }
    });
  
    if (!user) {
      return null;
    }
  
    // New password
    const newPassword = crypto.randomBytes(4).toString('hex'); 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    });
  
    return {
      success: true,
      username: user.username,
      email: user.email,
      newPassword: newPassword
    };
  };

export const existingUser = async (username: string, email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { username: username },
                { email: email }
              ]
        }
    })
    return user
}

export const userLogin = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: { username: username }
    })
    return user
}

export const allUsers = async (page: number = 1, limit: number = 10) => {
    const skip = (page - 1) * limit;
    
    const user = await prisma.user.findMany({
        skip: skip,
        take: limit,
        orderBy: {
            username: 'asc',
        },
        include: {
            merchants: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    
    const totalUsers = await prisma.user.count();
    
    return {
        data: user,
        pagination: {
            total: totalUsers,
            page: page,
            limit: limit,
            totalPages: Math.ceil(totalUsers / limit)
        }
    };
}

export const userById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        include: {
            merchants: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })
    return user
}

export const updateUser = async (userId: string, updateForm: UpdateUser) => {
    const user = await prisma.user.update({
        where: {id: userId},
        data: {
            username: updateForm.username,
            fullname: updateForm.fullname,
            email: updateForm.email,
            gender: updateForm.gender,
            birth: updateForm.birth,
            address: updateForm.address,
            phone: updateForm.phone,
            avatar: updateForm.avatar
        }
    })
    return user
}