import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/passMan")

let regSchema  = mongoose.Schema({
    uid: String,
    password: String
})

export default mongoose.models.registerations || mongoose.model("registerations",regSchema)

