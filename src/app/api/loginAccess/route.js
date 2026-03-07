import registermodel from "@/models/registermodel";
import mongoose from "mongoose";
import * as bcrypt from 'bcrypt'

export async function POST(request){
    try{
        if (mongoose.connection.readyState !== 1){
            await mongoose.connect(process.env.DB_PATH, {
                serverSelectionTimeoutMS: 5000
            });
        }
       const reqbody = await request.json()
       const {uid,password} = reqbody
       const user = await registermodel.findOne({uid:uid})
            if (user){
                // compare the password with the hashed password in the database using bcrypt
                const isPasswordCorrect = await bcrypt.compare(password,user.password)
                if (isPasswordCorrect){
                    return Response.json({  
                        message:"Login Success"
                    })
                }
                else{
                    return Response.json({
                        message:"Incorrect Password"
                    })
                    
                }

                }
            
            else{
                return Response.json({
                    message:"User Not Found"
                })
            }   
    }
    catch (error){
        console.error(error)
         return Response.json(
        { message: "Server error" },
        { status: 500 })
    }
}