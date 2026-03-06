import mongoose from "mongoose";
import entrymodel from "@/models/entrymodel";


export async function GET(request) {
    try {
        
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.DB_PATH, {
                serverSelectionTimeoutMS: 5000
            });
    
        }

        // URL(request.url) means we are extracting the url from the request 
        const requrl = new URL(request.url);
        // getting the id from the query parameters, this is the uid of the user whose entries we want to fetch
        const id = requrl.searchParams.get("id");
   
        
        let entries = await entrymodel.find({ uid: id });
       
       // send the entries as json response 
        return Response.json(entries);
       
    } catch (error) {
       
        return Response.json(
            { 
                error: error.message || "Internal server error",
                details: error.toString()
            },
            { status: 500 }
        );
    }
}