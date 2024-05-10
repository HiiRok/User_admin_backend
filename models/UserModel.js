const mongoose = require('mongoose');

const userRoles = ['admin', 'user'];

const accessTypes = ['public', 'private'];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    phoneNumber: {
        type: String,
        match: /^\d{10}$/ 
    },
    profilePhoto:{
        type: Buffer 
    },
    profilePhotoUrl:{
        type: String,
        validate: {
            validator: function(value) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value) || /\.(jpg|jpeg|png|gif)$/i.test(value);
            },
            message: 'Profile photo must be a valid URL or image file path'
        }
    },
    role:{
        type: String,
        enum: userRoles,
        default: 'user' 
    },
    accessType:{
        type: String,
        enum: accessTypes,
        default: 'public' 
    }
});

module.exports = mongoose.model('User', userSchema);
