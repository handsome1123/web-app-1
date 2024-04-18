const express = require('express');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

// Connect-flash
app.use(flash());

// Define a static directory to serve CSS and other static files
app.use(express.static('public'));

// Session storage 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// To use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to database 
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web_pro'
});

// Check database connection 
con.connect(function (err) {
    if (err) throw err;
    console.log('Database is connected');
});

// Route for register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Route for login page
app.get('/login', (req, res) => {
    let filePath = path.join(__dirname, 'views', 'login.html');
    const message = req.flash('message');
    if (message.length > 0) {
        filePath += `?message=${encodeURIComponent(message[0])}`;
    }
    res.sendFile(filePath);
});

// Route for handling registration form submission
app.post('/register', (req, res) => {
    const { firstname, lastname, phone, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const query = 'INSERT INTO user (firstname, lastname, phone, email, password) VALUES (?, ?, ?, ?, ?)';
        con.query(query, [firstname, lastname, phone, email, hash], (err, result) => {
            if (err) {
                console.log(err);
                req.flash('message', 'Account creation failed');
                res.redirect('/register');
            } else {
                req.flash('message', 'Registration successful');
                res.redirect('/login');
            }
        });
    });
});

// Route for handling login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM user WHERE email = ?';
    con.query(query, [email], async (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        if (result.length === 0) {
            req.flash('message', 'User does not exist');
            return res.redirect('/login');
        }

        const user = result[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.flash('message', 'Incorrect Password!');
            return res.redirect('/login');
        }

        req.session.userId = user.id;

        switch(user.role) {
            case 'staff':
                return res.redirect('/staff_dashboard');
            case 'lecturer':
                return res.redirect('/lecturer_dashboard');
            case 'user':
                return res.redirect('/index');
            default:
                return res.status(400).send('Unknown User Role!');
        }
    });
});

// Route for rendering index page
app.get('/index', (req, res) => {
    if(!req.session || !req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;
    con.query('SELECT * FROM user WHERE id = ?', [userId],(error, results) => {
        if(error){
            return res.status(500).json({message: 'Internal server error'});
        }

        if(results.length === 0){
            return res.status(404).json({message: 'User not found'});
        }

        const user = results[0];

        if(user.role !== 'user'){
            return res.redirect('/login');
        } 

        res.sendFile(path.join(__dirname, 'views', 'index.html'));
    });
});

// Route for rendering staff dashboard
app.get('/staff_dashboard', (req, res) => {
    if(!req.session || !req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;
    con.query('select * from user where id = ?', [userId],(error, results) => {
        if(error){
            req.flash('message','Internal server error!');
            return res.redirect('/login');
        }

        if(results.length=== 0){
            req.flash('message','User not found!');
            return res.redirect('/login');
        }

        const user = results[0];

        if(user.role != 'staff'){
            return res.redirect('/login');
        } 
        res.sendFile(path.join(__dirname, 'views', 'staff_dashboard.html'));
    });
});

// Route for rendering lecturer dashboard
app.get('/lecturer_dashboard', (req, res) => {
    if(!req.session || !req.session.userId) {
        return res.redirect('/login');
    }

    const userId = req.session.userId;
    con.query('select * from user where id = ?', [userId],(error, results) => {
        if(error){
            req.flash('message','Internal server error!');
            return res.redirect('/login');
        }

        if(results.length=== 0){
            req.flash('message','User not found!');
            return res.redirect('/login');
        }

        const user = results[0];

        if(user.role != 'lecturer'){
            return res.redirect('/login');
        } 
        res.sendFile(path.join(__dirname, 'views', 'lecturer_dashboard.html'));
    });
});

// Rout for login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rote for register 
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.listen(8000, () => {
    console.log('Server is running');
});
