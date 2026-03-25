const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mern-mini-project');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    password: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;