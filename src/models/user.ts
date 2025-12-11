import mongoose from 'mongoose'
import validator from 'validator'


interface IUser extends Document{
    _id:string;
    photo:string;
    name:string;
    email:string;
    role:"admin" | "user";
    gender:"male" | "female";
    dob:Date;
    password:string;
    createedAt:Date;
    updatedAt:Date; 
    //virtual attribute
    age:number;
}//interface for user model ye kya hai ki document k andar kya kya fields hone chahiye
const schema = new mongoose.Schema(
    {
        _id:{
            type:String,
            required: [true,"please enter ID"],
        },

        photo:{ 
            type:String,
            required: [true,"please enter photo"],
        },

        name:{ 
            type:String,
            required: [true,"please enter name"],
        },

        email:{ 
            type:String,
            unique:[true,"email already exists"],
            required: [true,"please enter email"],
            validate:validator.isEmail,
        },

        role:{ 
            type:String,
            enum:["admin","user"],
            default:"user",
        },

        gender:{ 
            type:String,
            enum:["male","female"],
            required:[true,"please enter gender"],
        },

        dob:{
            type:Date,
            required: [true,"please enter date of birth"],
        },

        password: {
            type: String,
            required: [true, "please enter password"],
            select: false
        }
    },
    { timestamps: true }
);


schema.virtual("age").get(function(){
    const today =new Date();
    const dob = this.dob;
    let age =today.getFullYear() - dob.getFullYear();

    if(today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())){
        age--;
    }
    return age;
})//year calculate krta hai

export const User = mongoose.model<IUser>('User', schema);

