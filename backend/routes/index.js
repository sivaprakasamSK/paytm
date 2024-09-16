const express = require("express");
const mainRoute = express.Router()
const {userRoute} = require("./user");
const {accountRoute} = require("./account");


mainRoute.use("/user",userRoute)
mainRoute.use("/account",accountRoute)

module.exports={
    mainRoute
}