
import mongoose from "mongoose";
import registermodel from "@/models/registermodel";

export async function POST(request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.DB_PATH, {
        serverSelectionTimeoutMS: 5000
      });
    }

    const body = await request.json();
    
    // Check if user exists
    const existingUser = await registermodel.findOne({ uid: body.uid });
    if (existingUser) {
      return Response.json({ error: "Username already exists" });
    }

    // Create new user
    const user = await registermodel.create(body);
    
    return Response.json({ 
      message: "Registration successful",
      user: { uid: user.uid }
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: error.message });
  }
}