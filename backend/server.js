const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require("./src/lib/prisma");

const categoryRoutes = require("./src/routes/categoryRoutes");

const productRoutes = require("./src/routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend de la tienda funcionando correctamente"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: "Usuario y contraseña son obligatorios"
            });
        }

        const admin = await prisma.admin.findFirst({
            where: {
                username: username
            }
        });

        if (!admin) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                error: "Credenciales incorrectas"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            message: "Login exitoso",
            token
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});