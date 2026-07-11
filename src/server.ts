import app from "./app";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";

const PORT = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Error running the server");
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
