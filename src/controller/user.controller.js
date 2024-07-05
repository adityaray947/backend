import { asyncHandler } from '../utils/asyncHandler.js';
import  {errorHandler} from "../utils/error.js";
import {user} from "../models/user.model.js";
import { ApiResoponse } from '../utils/response.js';

const registerUser = asyncHandler(async (req, res) => {
    
    const{username,email,fullname,password}=req.body
    console.log("fullname :",fullname);

    if(
        [fullname,email,username].some((field)=>
            field?.trim()===""
        )
    )
    {
            throw new errorHandler(400,"All fields are required")
        }
    
    const existeduser=user.findOne({
        $or:[{email},{username}]
    })
    if(existeduser){
        throw new errorHandler(409,"user already existed with same name or email ")
    }
    const User=await user.create({
        fullname,
        username:username.toLowerCase(),
        email,
        password

    })
    const checkuser=await user.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!checkuser){
        throw new errorHandler(500,"somethin went wrong")
    }

    return res.status(201).json(

        new ApiResoponse(200,checkuser,"user registered successfully")
    )


}

);

export { registerUser };
