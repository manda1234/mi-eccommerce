const express = require('express');
const app = express();
const sequelize = require('./database');
const { DataTypes } = require('sequelize');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Model Produk
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

// Sinkronisasi Database
const initDb = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Tabel produk tersinkron dengan database");
    } catch (error) {
        console.log("Terjadi kesalahan saat membuat tabel produk:", error);
    }
};

initDb();

// Fungsi respons sukses dan error
const successResponse = (res, message, data = null) => {
    res.status(200).json({
        success: true,
        pesan: message,
        data: data
    });
};

const errorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        pesan: message
    });
};

// Tambah produk baru
app.post('/products', async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !price) {
            return errorResponse(res, 400, "Nama dan harga produk harus diisi");
        }

        const newProduct = await Product.create({ name, description, price });
        successResponse(res, "Produk berhasil ditambahkan", newProduct);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Gagal menambahkan produk");
    }
});

// Ambil semua produk
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        successResponse(res, "Data produk berhasil diambil", products);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Gagal mengambil data produk");
    }
});

// Ambil produk berdasarkan ID
app.get('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findByPk(id);

        if (!product) {
            return errorResponse(res, 404, "Produk tidak ditemukan");
        }

        successResponse(res, "Data produk berhasil diambil", product);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Terjadi kesalahan saat mengambil produk");
    }
});

// Ubah data produk
app.put('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, description, price } = req.body;

        if (!name || !price) {
            return errorResponse(res, 400, "Nama dan harga produk harus diisi");
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return errorResponse(res, 404, "Produk tidak ditemukan");
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;

        await product.save();
        successResponse(res, "Produk berhasil diperbarui", product);
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Terjadi kesalahan saat memperbarui produk");
    }
});

// Hapus produk
app.delete('/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await Product.findByPk(id);

        if (!product) {
            return errorResponse(res, 404, "Produk tidak ditemukan");
        }

        await product.destroy();
        successResponse(res, "Produk berhasil dihapus");
    } catch (error) {
        console.log(error);
        errorResponse(res, 500, "Terjadi kesalahan saat menghapus produk");
    }
});

// Jalankan server
app.listen(3000, () => {
    console.log("Product service berjalan pada port 3000");
});