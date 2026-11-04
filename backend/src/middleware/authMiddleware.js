const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");

async function authMiddleware(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                error: "No autorizado"
            });
        }


        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Token no proporcionado"
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const admin = await prisma.admin.findUnique({
            where: {
                id: decoded.id
            }
        });


        if (!admin) {
            return res.status(401).json({
                error: "Administrador no encontrado"
            });
        }


        req.user = admin;

        next();


    } catch (error) {

        console.error(error);

        return res.status(401).json({
            error: "Token inválido o expirado"
        });
    }
}


module.exports = authMiddleware;