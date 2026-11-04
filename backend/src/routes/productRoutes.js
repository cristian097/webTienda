const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { files: 4, fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, callback) => {
        if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.mimetype)) {
            return callback(new Error("Solo se permiten imágenes JPG, PNG, WEBP o AVIF."));
        }
        callback(null, true);
    }
});

function configureCloudinary() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return false;
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });
    return true;
}

function uploadBuffer(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image", transformation: [{ quality: "auto", fetch_format: "auto" }] },
            (error, result) => error ? reject(error) : resolve(result)
        );
        Readable.from([buffer]).pipe(stream);
    });
}

function normalizeImageUrls(body) {
    if (Array.isArray(body.imageUrls)) return body.imageUrls.filter(url => typeof url === "string" && url.trim());
    if (typeof body.imageUrl === "string" && body.imageUrl.trim()) return [body.imageUrl.trim()];
    return [];
}

function productInclude() {
    return {
        category: true,
        images: { orderBy: { position: "asc" } }
    };
}

// Admin endpoint: includes active and inactive products.
router.get("/admin/all", authMiddleware, async (_req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: productInclude(),
            orderBy: { createdAt: "desc" }
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

// Upload selected files to Cloudinary. Only authenticated admins can use this endpoint.
router.post("/upload-images", authMiddleware, (req, res, next) => {
    upload.array("images", 4)(req, res, error => {
        if (error) return res.status(400).json({ error: error.message || "No se pudieron procesar las imágenes." });
        next();
    });
}, async (req, res) => {
    if (!configureCloudinary()) {
        return res.status(503).json({
            error: "El almacenamiento de imágenes no está configurado. Configura CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en el backend."
        });
    }
    if (!req.files?.length) return res.status(400).json({ error: "Selecciona al menos una imagen." });

    try {
        const uploaded = await Promise.all(
            req.files.map(file => uploadBuffer(file.buffer, "webtienda/productos"))
        );
        res.status(201).json({
            images: uploaded.map(image => ({ url: image.secure_url, publicId: image.public_id }))
        });
    } catch (error) {
        console.error("Error al subir imágenes a Cloudinary:", error);
        res.status(502).json({ error: "No fue posible subir las imágenes. Revisa la configuración de Cloudinary e inténtalo de nuevo." });
    }
});

// Public catalog: active products in active categories only.
router.get("/", async (req, res) => {
    try {
        const where = { active: true, category: { active: true } };
        if (req.query.categoryId) {
            const categoryId = Number(req.query.categoryId);
            if (!Number.isInteger(categoryId) || categoryId < 1) {
                return res.status(400).json({ error: "La categoría indicada no es válida." });
            }
            where.categoryId = categoryId;
        }
        const products = await prisma.product.findMany({
            where,
            include: productInclude(),
            orderBy: { createdAt: "desc" }
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los productos." });
    }
});

// Create product.
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name, description, price, categoryId } = req.body;
        const imageUrls = normalizeImageUrls(req.body);

        if (!name?.trim()) return res.status(400).json({ error: "El nombre del producto es obligatorio." });
        if (price === undefined || price === null || price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({ error: "Ingresa un precio válido." });
        }
        if (!categoryId || !Number.isInteger(Number(categoryId))) return res.status(400).json({ error: "La categoría es obligatoria." });
        if (imageUrls.length < 2 || imageUrls.length > 4) return res.status(400).json({ error: "Cada producto debe tener entre 2 y 4 imágenes." });

        const category = await prisma.category.findUnique({ where: { id: Number(categoryId) } });
        if (!category || !category.active) return res.status(400).json({ error: "Selecciona una categoría existente y activa." });

        const product = await prisma.product.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                price: Number(price),
                imageUrl: imageUrls[0],
                categoryId: Number(categoryId),
                images: {
                    create: imageUrls.map((url, position) => ({
                        url,
                        publicId: Array.isArray(req.body.imagePublicIds) ? req.body.imagePublicIds[position] || null : null,
                        position
                    }))
                }
            },
            include: productInclude()
        });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el producto." });
    }
});

// Update product and replace its gallery with the submitted 2–4 image URLs.
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, description, price, categoryId } = req.body;
        const imageUrls = normalizeImageUrls(req.body);

        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Identificador de producto inválido." });
        if (!name?.trim()) return res.status(400).json({ error: "El nombre del producto es obligatorio." });
        if (price === undefined || price === null || price === "" || !Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({ error: "Ingresa un precio válido." });
        }
        if (!categoryId || !Number.isInteger(Number(categoryId))) return res.status(400).json({ error: "La categoría es obligatoria." });
        if (imageUrls.length < 2 || imageUrls.length > 4) return res.status(400).json({ error: "Cada producto debe tener entre 2 y 4 imágenes." });

        const category = await prisma.category.findUnique({ where: { id: Number(categoryId) } });
        if (!category || !category.active) return res.status(400).json({ error: "Selecciona una categoría existente y activa." });

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                price: Number(price),
                imageUrl: imageUrls[0],
                categoryId: Number(categoryId),
                images: {
                    deleteMany: {},
                    create: imageUrls.map((url, position) => ({
                        url,
                        publicId: Array.isArray(req.body.imagePublicIds) ? req.body.imagePublicIds[position] || null : null,
                        position
                    }))
                }
            },
            include: productInclude()
        });
        res.json(product);
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") return res.status(404).json({ error: "Producto no encontrado." });
        res.status(500).json({ error: "Error al actualizar el producto." });
    }
});

router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { active } = req.body;
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Identificador de producto inválido." });
        if (typeof active !== "boolean") return res.status(400).json({ error: "El campo active debe ser true o false." });
        const product = await prisma.product.update({
            where: { id },
            data: { active },
            include: productInclude()
        });
        res.json(product);
    } catch (error) {
        console.error(error);
        if (error.code === "P2025") return res.status(404).json({ error: "Producto no encontrado." });
        res.status(500).json({ error: "Error al cambiar el estado del producto." });
    }
});

module.exports = router;
