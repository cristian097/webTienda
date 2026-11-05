
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

// Configuración CORS
app.use(cors({
    origin: [
        "https://mgraphix.netlify.app",
        "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        message: "Backend de la tienda funcionando correctamente"
    });
});

// Rutas de categorías y productos
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Autenticación del administrador
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
        console.error("Error en login:", error);

        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
