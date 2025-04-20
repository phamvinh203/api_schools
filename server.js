const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const database = require('./config/database');
const routes = require('./routers/index.route');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to database
database.connect()


// Routes
routes(app);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});