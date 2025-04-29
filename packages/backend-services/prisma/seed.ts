// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// 初始化 Prisma Client
const prisma = new PrismaClient();

// 设置初始管理员的用户名和密码 (从环境变量获取更安全)
const adminUsername = process.env.INITIAL_ADMIN_USERNAME;
const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

async function main() {
  if (!adminUsername || !adminPassword) {
    return;
  }

  console.log('Start seeding ...');

  // --- Seed Admin User ---
  const saltRounds = 10; // bcrypt 哈希轮数
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  // 检查管理员是否已存在
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const admin = await prisma.admin.create({
      data: {
        username: adminUsername,
        passwordHash: passwordHash,
        name: 'default', // 可选
      },
    });
    console.log(`Created admin user: ${admin.username}`);
  } else {
    console.log(`Admin user '${adminUsername}' already exists.`);
  }

  // --- 你可以在这里添加其他需要初始化的数据 ---
  // 例如: 创建一些默认的课程分类、标签等

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    // 关闭 Prisma Client 连接
    return prisma.$disconnect();
  });
