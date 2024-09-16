const express = require("express");
const { User, Account } = require("../db");
const zod = require("zod");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");
const jwt = require("jsonwebtoken");

const userRoute = express.Router();

const signupInput = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

const signinInput = zod.object({
    email: zod.string().email(),
    password: zod.string(),
});

const updateInput = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});



userRoute.post('/signup', async (req, res) => {
    try {
        const { success } = signupInput.safeParse(req.body);
        if (success) {
            const user = await User.findOne({
                email: req.body.email,
            });
            if (!user) {
                const userCreated = await User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                })
                const token = jwt.sign({
                    userId: userCreated._id
                }, JWT_SECRET);


                const userAccount = await Account.create({
                    userId: userCreated._id,
                    balance: Math.floor(Math.random() * 10000) + 1
                })

                res.status(200).json({
                    message: "user created successfully",
                    token: token,
                })
            } else {
                res.status(411).json({
                    message: "User already exist/email already taken"
                })
            }
        } else {
            res.status(411).json({
                message: "wrong inputs"
            })
        }

    } catch {
        res.status(411).json({
            message: "error while creating account"
        })
    }

})
userRoute.post('/signin', async (req, res) => {
    try {
        const { success } = signinInput.safeParse(req.body);
        if (success) {

            const user = await User.findOne({
                email: req.body.email,
                password: req.body.password
            });

            if (!user) {
                res.status(411).json({
                    message: "user not found with the given username and password"
                })
            }
            const token = jwt.sign({ userId: user._id }, JWT_SECRET);

            res.status(200).json({
                token: token,
            })
        } else {
            res.status(411).json({
                message: "The given input is wrong"
            })
        }
    } catch {
        res.status(411).json({
            message: "error while fetching account"
        })
    }
})

userRoute.put("/", authMiddleware, async (req, res) => {

    const { success } = updateInput.safeParse(req.body);
    if (success) {
        try {
            const user = await User.findOneAndUpdate({ _id: req._id }, {
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                password:req.body.password
            })
            res.status(200).json({
                message: "Updated successfully"
            })
        } catch {
            res.status(411).json({
                message: "Error while updating"
            })
        }
    } else {
        res.json({
            message: "Invalid inputs"
        })
    }
})

userRoute.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})

module.exports = {
    userRoute
}