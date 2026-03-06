import registermodel from "@/models/registermodel";
import mongoose from "mongoose";
// check if a uid exists from the searchparams and if it exists then return the uid else return error
export async function GET(request){
    try{
        if (mongoose.connection.readyState !== 1){
            await mongoose.connect(process.env.DB_PATH, {
                serverSelectionTimeoutMS: 5000
            });
        }
         const {searchParams} = new URL(request.url)
            const uid = searchParams.get("uid")
            if (uid){
                const user = await registermodel.findOne({uid:uid})
                if (user){
                    return Response.json({uid:user.uid})
                }   
                else{
                    return Response.json({error:"User Not Found"})
                }
            }
            else{
                return Response.json({error:"UID Not Provided"})
            }
    }
    catch (error){
        console.error(error)
        return Response.json(
        { error: "Server error" },
        { status: 500 }
    )
    }           
}


