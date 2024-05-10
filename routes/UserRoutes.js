const express = require('express')
const router = express.Router()
const crypt = require('crypto')  
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel.js')
const settings = process.env;
const getUserIdFromToken = require("../middlewares/verifyUser.js")


const getHash = (text) => {
    const hash = crypt.createHash('sha512')
    hash.update(text) 
    return hash.digest('hex')
}

const time = 7 * 24 * 60 * 60 * 1000
const createToken = async(userId) => {
   
    return jwt.sign({userId} , settings.jwt_secret , {
        expiresIn:time
    })
}

router.get('/', async (req, res) => {
    res.status(200).send('this is api route testing.')
})


router.post('/signup', async (req, res) => {

    const { name, email, password, bio, phoneNumber, profilePhoto, profilePhotoUrl } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({
                status: "failure",
                message: "This email is already registered!"
            });
        }
        
        user = new User({
            name,
            email,
            password:getHash(password),
            bio,
            phoneNumber,
            profilePhoto: profilePhoto ? Buffer.from(profilePhoto, 'base64') : undefined,
            profilePhotoUrl
        });

        user = await user.save()

        if (!user) return res.status(500).send({
            status: "failure",
            message: "There was a problem during registration! Please try again later."
        })
        return res.status(200).send({
            status: "success",
            message: "User registered successfully"
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send({
            status: "failure",
            message: 'An error occured!'
        })
    }

})

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }) 
         
        if (!user) return res.status(404).send({
            status: "failure",
            message: 'No user is registered with this email!'
        })
     
        else if (user.password !== getHash(password)) return res.status(403).send({
            status: 'failure',
            message: 'Incorrect password!'
        })
        
        else if (user.password === getHash(password)) {
            
            const token = await createToken(user._id)
            res.cookie('accessToken', token, {
                withCredentials: true,
                httpOnly: true,
                maxAge: time,
                secure: false
            })

            return res.status(200).send({
                status: 'success',
                message: 'User logged in successfully',
                token
            })
        }

    } catch (error) {
        console.log({ error })
        return res.status(500).send({
            status: 'failure',
            message: 'An error occured!'
        })
    }

})


router.post('/signout', async (req, res) => {
    try {
        res.clearCookie('accessToken', { path: '/' });
        
        return res.status(200).send({
            status: 'success',
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error({ error });
        return res.status(500).send({
            status: 'failure',
            message: 'An error occurred!'
        });
    }
});

router.get('/user-profile', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req.cookies.accessToken);
        console.log(userId); 
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).send({
                status: "failure",
                message: "User not found"
            });
        }
        return res.status(200).send({
            status: "success",
            data: user
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            status: "failure",
            message: "An error occurred while retrieving the user profile"
        });
    }
});

router.put('/update-profile', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req.cookies.accessToken);
        const { name, bio, phoneNumber, profilePhoto, profilePhotoUrl, accessType } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({
                status: "failure",
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (profilePhoto) user.profilePhoto = Buffer.from(profilePhoto, 'base64');
        if (profilePhotoUrl) user.profilePhotoUrl = profilePhotoUrl;
        if (accessType) user.accessType = accessType;

        const updatedUser = await user.save();

        return res.status(200).send({
            status: "success",
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            status: "failure",
            message: "An error occurred while updating the user profile"
        });
    }
});

router.put('/toggle-access-type', async (req, res) => {
    try {
        const userId = getUserIdFromToken(req.cookies.accessToken);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({
                status: "failure",
                message: "User not found"
            });
        }

        user.accessType = user.accessType === 'public' ? 'private' : 'public';

        const updatedUser = await user.save();

        return res.status(200).send({
            status: "success",
            message: "Access type toggled successfully",
            data: updatedUser.accessType
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            status: "failure",
            message: "An error occurred while toggling access type"
        });
    }
});

router.get('/public-profiles', async (req, res) => {
    try {
        const publicProfiles = await User.find({ accessType: 'public' })
            .select('-password -accessType -role');

        return res.status(200).send({
            status: "success",
            data: publicProfiles
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send({
            status: "failure",
            message: "An error occurred while retrieving public profiles"
        });
    }
});


module.exports = router