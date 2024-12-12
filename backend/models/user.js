import mongoose  from "mongoose"

const userschema = new mongoose.Schema({
    username: { type: String, unique: true , required:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, maxLength: 160 , default:"" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role:{type:String,default:"user"}
})

export const user = new mongoose.model("user",userschema);

