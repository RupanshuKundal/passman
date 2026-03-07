
import mongoose from "mongoose";
import registermodel from "@/models/registermodel";
import bcrypt from "bcrypt";

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

    // hash the password before saving to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);
    body.password = hashedPassword;
    
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