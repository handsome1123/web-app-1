const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');
const con = require('./config/db');

const app = express();


// Define a static directory to serve CSS and other static files
app.use(('/public', express.static(path.join(__dirname, 'public'))));

// Session storage 
app.use(session({
    cookie: { maxAge: 24 * 60 * 1000 }, //one day in millisecond
    secret: 'secret',
    resave: false,
    saveUninitialized: true,

    // config MemoryStore here 
    store: new MemoryStore({
        checkPeriod: 24 * 60 * 1000 // expired entries every 24 hours
    })
}));

// To use bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Check database connection 
con.connect(function (err) {
    if (err) throw err;
    console.log('Database is connected');
});

// Create hashed password
// app.get('/password/:pass', function (req, res) {
//     const password = req.params.pass;
//     const saltRounds = 10;
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//         if (err) {
//             return res.status(500).send("Hashing error");
//         }
//         res.send(hash);
//     });
// });

// Route for register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
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
                return res.status(500).send('Internal Server Error');
            } else {
                res.sendFile(path.join(__dirname, 'views', 'login.html'));
            }
        });
    });
});

// Route for login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Route for handling login form submission
app.post('/login', function (req, res) {
    const { email, password } = req.body;
    const query = 'SELECT id, password, role FROM user WHERE email = ?';
    con.query(query, [email], function (err, results) {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length !== 1) {
            return res.status(401).send('Wrong username or password');
        }

        // Check password
        bcrypt.compare(password, results[0].password, function (err, same) {
            if (err) {
                console.error(err);
                return res.status(500).send('Server error');
            }

            if (same) {
                // Store user information in session
                req.session.userID = results[0].id;
                req.session.email = email;
                req.session.role = results[0].role;

                // Redirect based on user role
                switch (results[0].role) {
                    case 'staff':
                        return res.send('/staff_dashboard');
                    case 'lecturer':
                        return res.send('/lecturer_dashboard');
                    case 'user':
                        return res.send('/user');
                    default:
                        return res.status(500).send('Invalid user role');
                }
            } else {
                return res.status(401).send("Wrong username or password");
            }
        });
    });
});

// get user info 
app.get('/userInfo', function (req, res) {
    res.json({ "userID": req.session.userID, "useremail": req.session.email });
});

// Route for rendering lecturer dashboard
app.get('/user', function (_req, res) {
    res.sendFile(path.join(__dirname, 'views/user_roomlist.html'));
});

// Route for rendering lecturer dashboard
app.get('/lecturer_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/lecturer_dashboard.html'));
});

// Route for rendering staff dashboard
app.get('/staff_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/staff_dashboard.html'));
});



// Route for handling logout
app.get('/logout', function (req, res) {
    // Clear the session data
    req.session.destroy(function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Redirect to the login page after logout
        res.redirect('/login');
    });
});


// root service
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'views/login.html'));
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log('Server is running at port ' + PORT);
});
