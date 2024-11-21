const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Mengimpor koneksi database

// Endpoint untuk mendapatkan semua hewan
router.get('/', (req, res) => {
    db.query('SELECT * FROM hewan', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(results); // Mengirimkan hasil query dalam format JSON
    });
});

// Endpoint untuk mendapatkan hewan berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM hewan WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) return res.status(404).send('Hewan tidak ditemukan');
        res.json(results[0]);
    });
});

// Endpoint untuk menambahkan hewan baru
router.post('/', (req, res) => {
    const { nama_hewan, jumlah_hewan } = req.body;
    if (!nama_hewan || nama_hewan.trim() === '' || !jumlah_hewan) {
        return res.status(400).send('Nama hewan dan jumlah hewan tidak boleh kosong');
    }

    db.query('INSERT INTO hewan (nama_hewan, jumlah_hewan) VALUES (?, ?)', [nama_hewan.trim(), jumlah_hewan], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const newHewan = { id: results.insertId, nama_hewan: nama_hewan.trim(), jumlah_hewan: jumlah_hewan };
        res.status(201).json(newHewan); // Kirimkan hewan baru yang ditambahkan
    });
});

// Endpoint untuk memperbarui data hewan
router.put('/:id', (req, res) => {
    const { nama_hewan, jumlah_hewan } = req.body;
    if (!nama_hewan || nama_hewan.trim() === '' || !jumlah_hewan) {
        return res.status(400).send('Nama hewan dan jumlah hewan tidak boleh kosong');
    }

    db.query('UPDATE hewan SET nama_hewan = ?, jumlah_hewan = ? WHERE id = ?', 
        [nama_hewan.trim(), jumlah_hewan, req.params.id], 
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            if (results.affectedRows === 0) return res.status(404).send('Hewan tidak ditemukan');
            res.json({ id: req.params.id, nama_hewan: nama_hewan.trim(), jumlah_hewan });
        }
    );
});

// Endpoint untuk menghapus hewan
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM hewan WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.affectedRows === 0) return res.status(404).send('Hewan tidak ditemukan');
        res.status(204).send(); // Hapus sukses
    });
});

module.exports = router;
