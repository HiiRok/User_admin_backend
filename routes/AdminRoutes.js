const router = require('express').Router()
const User = require('../models/UserModel.js')
const adminMiddleware = require("../middlewares/isAdmin.js")

router.get('/', async (req, res) => {
    res.status(200).send({
        status: 'success',
        message: 'Testing admin api route.'
    })
})


router.get('/all-users', adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');

        return res.status(200).send({
            status: "success",
            data: users
        });
    } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).send({
            status: "failure",
            message: "An error occurred while retrieving users"
        });
    }
});


module.exports = router