const bcrypt = require("bcryptjs");
const prisma = require("./src/lib/prisma");

async function main() {
    const username = "admin";
    const password = "Admin1234";

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
        data: {
            username,
            password: hashedPassword
        }
    });

    console.log("Administrador creado:");
    console.log({
        id: admin.id,
        username: admin.username
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });