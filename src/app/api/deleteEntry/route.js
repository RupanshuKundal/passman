import mongoose from "mongoose";
import entrymodel from "@/models/entrymodel";
import { NextResponse } from 'next/server';

export async function DELETE(request) {
  try {
    // Connect to database
      // if not already connected, connect to the database
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.DB_PATH, {
        serverSelectionTimeoutMS: 5000 // after 5 seconds stop trying to connect to the database, this is to prevent the server from hanging if the database is unreachable
      });
    }

    // Get the entry details from request body
    const { website, username, uid } = await request.json();
    
    console.log("Attempting to delete:", { website, username, uid });

    
    if (!website || !username || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

  
    const result = await entrymodel.findOneAndDelete({
      website: website,
      username: username,
      uid: uid
    });



    return NextResponse.json(
      { 
        message: "Entry deleted successfully",
        deletedEntry: result
      }
    );

  } catch (error) {
  
    return NextResponse.json(
      { error: error.message}
    );
  }
}