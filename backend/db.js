const { Schema, number } = require("zod");

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://sivaprakasams267:mVKDp62v168cGALz@todoapp.c5ol9.mongodb.net/");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        min: 5,
        max: 20
    },
    lastName: {
        type: String,
        min: 5,
        max: 20
    },
    password: {
        type: String,
        min: 8,
        max: 15,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true
    }
})

const AccountSchema = mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance: Number
})

const User = mongoose.model("User",UserSchema);
const Account = mongoose.model("Account",AccountSchema)

module.exports={
    User,
    Account
}