const express = require('express');
const todoRoutes = require('./routes/tododb.js');
const karyawanRoutes = require('./routes/karyawan'); // Mengimpor router karyawan
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Middleware
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const { isAuthenticated } = require('./middlewares/middleware.js');
const expressLayout = require('express-ejs-layouts');
const db = require('./database/db');

// Gunakan Express Layouts untuk EJS
app.use(expressLayout);

// Middleware untuk JSON dan URL encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi express-session
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret', // Pastikan mengisi .env dengan SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set ke true jika menggunakan HTTPS
}));

// Set view engine EJS
app.set('view engine', 'ejs');

// Rute untuk autentikasi
app.use('/', authRoutes);

// Rute untuk operasi pada tabel `hewan` (menggunakan todoRoutes)
app.use('/hewan', todoRoutes);

app.use('/karyawan', karyawanRoutes);

// Rute ke halaman utama dengan middleware autentikasi
app.get('/', isAuthenticated, (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layouts.ejs'
    });
});

// Rute ke halaman kontak dengan middleware autentikasi
app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', {
        layout: 'layouts/main-layouts.ejs'
    });
});

// Rute untuk menampilkan daftar `hewan` dari database
app.get('/hewan-view', isAuthenticated, (req, res) => {
    db.query('SELECT * FROM hewan', (err, hewan) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.render('hewan', {
            layout: 'layouts/main-layouts.ejs',
            hewan: hewan // Mengirim data hewan ke view
        });
    });
});

// Penanganan rute tidak ditemukan (404)
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
