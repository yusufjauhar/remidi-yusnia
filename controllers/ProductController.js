import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!response) return res.status(404).json({ msg: "Product Not Found" });
        res.json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const saveProduct = async (req, res) => {
    console.log("Request files: ", req.files);
    console.log("Request body: ", req.body);

    if (!req.files || !req.files.foto) return res.status(400).json({ msg: "No File Uploaded" });

    const { id, kode_pakaian, nama_pakaian, ukuran, deskripsi, harga, supplier, stock } = req.body;
    const file = req.files.foto;

    if (!file) return res.status(400).json({ msg: "File data is missing" });

    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Image Format" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    const savePath = path.resolve(`./public/images/${fileName}`);

    try {
        // Ensure directory exists
        const saveDirectory = path.resolve('./public/images');
        if (!fs.existsSync(saveDirectory)) {
            fs.mkdirSync(saveDirectory, { recursive: true });
        }

        await file.mv(savePath);
        await Product.create({
            id, // Use the provided ID
            kode_pakaian,
            nama_pakaian,
            ukuran,
            deskripsi,
            harga,
            supplier,
            stock,
            foto: fileName,
            url: `/images/${fileName}`
        });
        res.status(201).json({ msg: "Product Created Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { id: req.params.id }
        });

        if (!product) {
            return res.status(404).json({ msg: "Product Not Found" });
        }

        let fileName = product.foto;

        if (req.files && req.files.file) {
            const file = req.files.file;
            const fileSize = file.data.length;
            const ext = path.extname(file.name);
            fileName = file.md5 + ext;
            const allowedType = ['.png', '.jpg', '.jpeg'];

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({ msg: "Invalid Image Format" });
            }
            if (fileSize > 5000000) {
                return res.status(422).json({ msg: "Image must be less than 5 MB" });
            }

            const filepath = `./public/images/${product.foto}`;
            fs.unlinkSync(filepath);

            await file.mv(`./public/images/${fileName}`);
        }

        const { kode_pakaian, nama_pakaian, ukuran, deskripsi, harga, supplier, stock } = req.body;

        await Product.update({
            kode_pakaian,
            nama_pakaian,
            ukuran,
            deskripsi,
            harga,
            supplier,
            stock,
            foto: fileName,
            url: `/images/${fileName}`
        }, {
            where: { id: req.params.id }
        });

        res.status(200).json({ msg: "Product Updated Successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: "Product Not Found" });

        const filepath = `./public/images/${product.foto}`;
        fs.unlinkSync(filepath);

        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Product Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Server Error" });
    }
};
