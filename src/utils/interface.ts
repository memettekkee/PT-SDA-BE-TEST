export interface User {
    username: string,
    fullname: string,
    email: string,
    password: string,
    gender?: string,
    birth?: Date,
    address?: string,
    phone?: string,
    avatar?: string
}

export interface Merchant {
    name: string,
    email: string,
    address: string,
    phone: string,
    avatar?: string,
    type?: string,
    status?: string
}

export interface UpdateUser {
    username?: string,
    fullname?: string,
    email?: string,
    gender?: string,
    birth?: Date,
    address?: string,
    phone?: string,
    avatar?: string
}

export interface UpdateMerchant {
    name?: string,
    email?: string,
    address?: string,
    phone?: string,
    avatar?: string,
    type?: string,
    status?: string
}

export interface Product {
  name: string;        
  price: number; 
  categoryId: string;   
  description?: string;  
  discount?: number;   
  weight?: number;       
  has_variant?: boolean; 
  merchantId?: string;   
  avatar?: string;        
}

export interface VariantProduct {
    sku: string;        
    stock: number;     
    colourId?: string;    
    sizeId?: string;    
  }