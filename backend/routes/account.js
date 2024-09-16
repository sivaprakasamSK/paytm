const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, User } = require("../db");
const mongoose = require("mongoose")

const accountRoute = express.Router();


accountRoute.get("/balance", authMiddleware, (req, res) => {
    try {
        const user = Account.findOne({
            userId: req._id
        })
        res.status(200).json({
            balance: user.balance
        })
    } catch {
        res.status(411).json({
            message: "User can't be found "
        })
    }
})

accountRoute.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    const receiverId = new mongoose.Types.ObjectId(req.body.receiverId);
    console.log(receiverId);
    typeof receiverId
    const amount = req.body.amount
    try {
        session.startTransaction();

        const sender = await Account.findOne({userId:req._id}).session(session);
        console.log(sender)
        if (sender.balance < amount) throw new Error('Insufficient balance in Account A');

        const receiver = await Account.findOne({userId:receiverId}).session(session);
        console.log(receiver)

        sender.balance-=amount;
        await sender.save({session})

        receiver.balance+=amount;
        await receiver.save({session})

        await session.commitTransaction();
        res.status(200).json({
            message:"transaction successfull"
        })
    } catch (error) {
        await session.abortTransaction();
        res.json({
            message: "Error while transfering money" + error.message
        })
    }finally {
        session.endSession();
      }
})




module.exports = {
    accountRoute
}