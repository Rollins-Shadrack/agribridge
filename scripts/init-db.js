import "dotenv/config";
import fs from "fs";
import path from "path";
import { db } from "../db.js";

async function main() {
  try {
    const schemaPath = path.join(process.cwd(), "scripts/schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");

    await db.query(schemaSQL);
    console.log("Schema created successfully");

    const users = [
      {
        id: "admin-1",
        email: "rolltech5920@gmail.com",
        name: "Rollins Shadrack",
        image: "",
        role: "admin",
        is_onboarded: true,
        emailVerified: true,
      },
    ];

    for (const user of users) {
      await db.query(
        `INSERT INTO "user"
      (id, email, name, image, role, is_onboarded, "emailVerified")
     VALUES
      ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (email) DO NOTHING`,
        [user.id, user.email, user.name, user.image, user.role, user.is_onboarded, user.emailVerified],
      );
    }

    console.log("Default users seeded");

    process.exit(0);
  } catch (err) {
    console.error("Error initializing DB:", err);
    process.exit(1);
  } finally {
    await db.end();
  }
}

main();
