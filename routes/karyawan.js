const express = require('express');
const router = express.Router();

// Data karyawan disimpan dalam array
let karyawan = [
    { id: 1, nama: 'John Doe' },
    { id: 2, nama: 'Jane Doe' }
];

// Mendapatkan semua data karyawan
router.get('/', (req, res) => {
    res.json(karyawan);
});

// Menambahkan karyawan baru
router.post('/', (req, res) => {
    const { nama } = req.body; // Mengambil nama dari body request

    if (!nama) {
        return res.status(400).json({ message: 'Nama karyawan harus diisi' });
    }

    const newKaryawan = {
        id: karyawan.length + 1, // Menghitung ID baru berdasarkan panjang array
        nama
    };

    karyawan.push(newKaryawan); // Menambahkan karyawan baru ke dalam array
    res.status(201).json(newKaryawan); // Mengirimkan respon dengan karyawan yang baru ditambahkan
});

// Menghapus karyawan berdasarkan ID
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Mendapatkan ID dari parameter URL

    const karyawanIndex = karyawan.findIndex(k => k.id === parseInt(id));

    if (karyawanIndex === -1) {
        return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    const deletedKaryawan = karyawan.splice(karyawanIndex, 1)[0]; // Menghapus karyawan dari array

    res.status(200).json({ message: `Karyawan dengan ID ${deletedKaryawan.id} telah dihapus` });
});

// Memperbarui karyawan berdasarkan ID
router.put('/:id', (req, res) => {
    const { id } = req.params; // Mendapatkan ID dari parameter URL
    const { nama } = req.body; // Mengambil nama baru dari body request

    if (!nama) {
        return res.status(400).json({ message: 'Nama karyawan harus diisi' });
    }

    const karyawanToUpdate = karyawan.find(k => k.id === parseInt(id));

    if (!karyawanToUpdate) {
        return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    karyawanToUpdate.nama = nama; // Memperbarui nama karyawan
    res.status(200).json({
        message: `Karyawan dengan ID ${id} telah diperbarui`,
        updatedKaryawan: karyawanToUpdate
    });
});

module.exports = router;
