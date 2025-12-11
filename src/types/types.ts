import { Request, Response, NextFunction } from "express";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: Date;
    password: string;
}
export interface NewProductRequestBody {
    name: string;
    category: string;     // ✔️ FIXED — should be string
    price: number;
    stock: number;
    description: string;
}


export type ControllerType = (
    req: Request<any>,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any>>;


export type SearchRequestQuery ={
    search ?: string;
    price?:string;
    category?: string;
    sort?:string;
    page?: string;
}
export interface BaseQuery {
  name?: {
    $regex: string | RegExp;
    $options: string;
  };
  category?: string;
  price?: {
    $lte: number;
  };
}


export type InvalidateCacheProps ={
    product?:boolean;
    order?:boolean;
    admin?:boolean;
    userID?:string;
    orderId?:string;
    productId?:string|string[];
}
export type OrderItemType = {
    name: String;
    photo:String;
    price:number;
    quantity:number;
    productId: string;
}
export type ShippingInfoType = {
    address:String;
    city:String;
    state:string;
    country:string;
    pinCode:Number;
    
}
export interface NewOrderRequestBody {
  shippingInfo:{};
  user:string;
  subtotal:number;
  tax:number;
  shippingCharges:number;
  discount:number;
  total:number;
  orderItems:OrderItemType[]

}