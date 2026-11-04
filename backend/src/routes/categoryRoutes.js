const express = require("express");

const prisma = require("../lib/prisma");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");


// GET /api/categories
// Obtener todas las categorías
router.get("/", async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: "asc"
            }
        });

        res.json(categories);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error al obtener las categorías"
        });
    }
});


// POST /api/categories
// Crear una categoría
router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            name,
            description
        } = req.body;

        if (!name) {
            return res.status(400).json({
                error: "El nombre de la categoría es obligatorio"
            });
        }

        const category = await prisma.category.create({
            data: {
                name,
                description: description || null
            }
        });

        res.status(201).json(category);

    } catch (error) {
        console.error(error);

        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Ya existe una categoría con ese nombre"
            });
        }

        res.status(500).json({
            error: "Error al crear la categoría"
        });
    }
});


// PUT /api/categories/:id
// Editar una categoría
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            name,
            description
        } = req.body;

        if (!name) {
            return res.status(400).json({
                error: "El nombre de la categoría es obligatorio"
            });
        }

        const category = await prisma.category.update({
            where: {
                id
            },
            data: {
                name,
                description: description || null
            }
        });

        res.json(category);

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Categoría no encontrada"
            });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                error: "Ya existe una categoría con ese nombre"
            });
        }

        res.status(500).json({
            error: "Error al actualizar la categoría"
        });
    }
});


// PATCH /api/categories/:id/status
// Activar / desactivar categoría
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);

        const {
            active
        } = req.body;

        if (typeof active !== "boolean") {
            return res.status(400).json({
                error: "El campo active debe ser true o false"
            });
        }

        const category = await prisma.category.update({
            where: {
                id
            },
            data: {
                active
            }
        });

        res.json(category);

    } catch (error) {
        console.error(error);

        if (error.code === "P2025") {
            return res.status(404).json({
                error: "Categoría no encontrada"
            });
        }

        res.status(500).json({
            error: "Error al cambiar el estado de la categoría"
        });
    }
});


module.exports = router;