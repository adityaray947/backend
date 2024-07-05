import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema =new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        fullname:{
            type:String,
            required:true,
            lowercase:true
        },
        Password:{
            type:String,
            required:[true,"password is required"]
        },
        refreshToken:{
            type:String,
        }
        
        

},
{
    timestamps:true
}

)

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();

    this.Password=await bcrypt.hash(this.Password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function (password){
 return await bcrypt.compare(password,this.password)
}

userSchema.methods.generatetoken=async function (){

   return await jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname

    },
    process.env.ACCESS_TOKEN_SECERET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)

}
export const user=mongoose.model("User",userSchema)