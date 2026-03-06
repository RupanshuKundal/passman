// models/entrymodel.js
import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  website: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  uid: {
    type: String,  
    required: true,
    index: true     // index for faster queries
  }
});

export default  mongoose.models.entries || mongoose.model('entries', entrySchema);

