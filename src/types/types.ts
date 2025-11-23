import { Request, Response, NextFunction } from "express";

export interface NewUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: Date;
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

export interface BaseQuery{
    name?:{
        $regex: string,
        $options:string
    };
    price:{
        $lte:number;
    }
    category: string
}