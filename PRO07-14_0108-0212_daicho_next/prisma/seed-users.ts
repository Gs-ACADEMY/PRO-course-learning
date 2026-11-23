// 見本のユーザー（1/12）：役割の違う 5 人。パスワードはライブラリがハッシュにして保存する
// 動かし方：npx tsx prisma/seed-users.ts（prisma/seed.ts からも呼ぶ）
import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const DEMO_PASSWORD = "hoshinagi-demo";
const users = [
  { name: "星凪", email: "hoshinagi@example.com", role: "president" },
  { name: "森田", email: "morita@example.com", role: "sales" },
  { name: "小野", email: "ono@example.com", role: "office" },
  { name: "谷口", email: "taniguchi@example.com", role: "supervisor" },
  { name: "石井", email: "ishii@example.com", role: "supervisor" },
];

export async function seedUsers() {
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  for (const u of users) {
    await auth.api.signUpEmail({ body: { name: u.name, email: u.email, password: DEMO_PASSWORD } });
    await prisma.user.update({ where: { email: u.email }, data: { role: u.role } });
  }
  console.log(`見本のユーザー ${users.length} 人を入れました（パスワードはすべて ${DEMO_PASSWORD}）`);
}

if (process.argv[1]?.endsWith("seed-users.ts")) {
  seedUsers().finally(() => prisma.$disconnect());
}
