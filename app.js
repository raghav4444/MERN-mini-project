const express =  require('express');
const app = express();

const jwt = require('jsonwebtoken');

const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const { log } = require('console');
const postModel = require('./models/post');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/create', (req, res) => {
    let { username, password, email, age } = req.body;
    
    bcrypt.genSalt(10, async (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            // console.log(hash);
            let createdUser = await userModel.create({
                username,
                password : hash,
                email,
                age
            });

            let token = jwt.sign({ email},"shhshshshhshsh");
            res.cookie('token', token);
            res.status(201);

            res.redirect('/login');
        });
    });
});

app.get('/login', async (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    let {email , password} = req.body;

    let user = await userModel.findOne({ email });
    //console.log(user); agar user exist karta hoga to miljayega warna null return karega

    if(!user){
        return res.send('Something went wrong'); // user not found nhi likhenge warna hacker user k existence ka pata laga lega
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
            let token = jwt.sign({ email , userid: user._id },"shhshshshhshsh");
            res.cookie('token', token);
            res.status(200).redirect('/profile'); //obviously we will redirect to loggedIn homepage but for now we will redirect to index page
        }else{
            res.send('Something went wrong'); // password wrong hai but we will not say that to hacker
        }
    });
    
});

app.get('/logout', (req, res) => {
    res.clearCookie('token'); // res.cookie('token', '');
    res.redirect('/login');
});

app.get('/profile',isLoggenIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    //let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    await user.populate('posts'); // issey posts ke andar ke post k content ko bhi populate kar dega, otherwise post k andar sirf post ka id aata hai
    res.render('profile', { user });
});

app.post('/post',isLoggenIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let post = await postModel.create({
        content: req.body.content,
        author: user._id
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
});

app.get('/like/:id',isLoggenIn, async (req, res) => {
    let post = await postModel.findById({ _id: req.params.id }).populate('user');
    if(post.likes.indexOf(req.user.userid) === -1){ // post.likes.includes(req.user.userid) issey bhi check kar sakte hai ki user ne like kiya hai ya nahi
        post.likes.push(req.user.userid);
    }else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1); // splice se array me se element remove kar sakte hai, indexOf se element ka index milta hai, aur fir us index se 1 element remove kar denge
    }
    await post.save();
    res.redirect('/profile');
});

app.get('/edit/:id',isLoggenIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate('user');

    res.render('edit', { post });
});

app.post('/edit/:id',isLoggenIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
    res.redirect('/profile');
});

function isLoggenIn(req, res, next){
    let token = req.cookies.token;
    if(token === "" || token === undefined){
        res.redirect('/login');
    }else{
        let data = jwt.verify(token, "shhshshshhshsh");
        req.user = data;
        next();
    }
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});