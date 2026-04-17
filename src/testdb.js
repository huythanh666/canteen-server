const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const allUsers = await prisma.user.findMany();
    console.log("Kết nối thành công! Danh sách user:", allUsers);
  } catch (e) {
    console.error("Lỗi kết nối rồi đại vương ơi:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();