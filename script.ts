import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const block = await prisma.block.create({
    data: {
      name: "Ett till testblock",
      productId: "229626",
    },
  });
  console.log(block);

  const blocks = await prisma.block.findMany();
  console.log("all my blocks:", blocks);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
