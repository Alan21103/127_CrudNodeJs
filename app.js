const express = require('express');
const todoRoutes = require('./routes/tododb.js');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

const expressLayout = require('express-ejs-layouts')

const db = require('./database/db.js')

app.use(expressLayout);

app.use(express.json());

app.use('/todos', todoRoutes);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layouts.ejs'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layouts.ejs'
    });
        
});

app.get('/todo-view', (req, res) => {
    db.query('SELECT * FROM todos', (err, todos) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.render('todo', {
            layout: 'layouts/main-layouts.ejs',
            todos: todos
        });
    });
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
