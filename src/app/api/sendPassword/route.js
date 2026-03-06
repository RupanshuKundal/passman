 
import mongoose from "mongoose";
import entrymodel from "@/models/entrymodel";

export async function POST(request) {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.DB_PATH, {
                serverSelectionTimeoutMS: 5000
            });
        }

        const body = await request.json();
       
        if (!body.uid) {
            return Response.json(
                { error: "uid is required" },
                { status: 400 }
            );
        }
        
        const newEntry = await entrymodel.create(body);
       
        return Response.json(
            { 
                message: "Password saved successfully",
                data: newEntry 
            },
            { status: 201 }
        );
       
    } catch (error) {
        console.error("Error saving password:", error);
        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}