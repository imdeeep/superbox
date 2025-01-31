const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const connectDB = require('./config/db')
const cors = require('cors')
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
require('./config/passport');

const allowedOrigins = [
  'https://superb0x.vercel.app', 
  'chrome-extension://albgenmdolgdojkdjgccpaljghfhiilg',
  'http://localhost:3000'
];

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true, //productiom
    // secure: false, // development
    sameSite: 'None', // production
    // sameSite: 'Strict', // development
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  }
}));

app.set('trust proxy', 1);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Superbox is running!')
})

app.use('/auth', require('./routes/authRoutes'));
app.use("/api/v1/context", require('./routes/contextRoute'))
app.use("/api/v1/organisation", require('./routes/orgRoutes')) 
app.use("/api/v1/notes", require('./routes/notesRoutes'))
app.use("/api/v1/chat", require('./routes/chatRoute'))
app.use("/api/v1/orgChat", require('./routes/orgChat'))

app.listen(port, () => {
  console.log(`Superbox listening on port ${port}`)
})