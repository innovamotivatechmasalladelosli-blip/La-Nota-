import { drizzle } from "drizzle-orm/mysql2";
import { authors } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

async function seedAuthors() {
  try {
    console.log("Insertando autores...");
    
    const authorsList = [
      { name: "Uriel", bio: "Autor y defensor de derechos humanos" },
      { name: "Alexis", bio: "Especialista en cívica y educación" },
      { name: "Edzel", bio: "Investigador de derechos fundamentales" },
    ];

    for (const author of authorsList) {
      await db.insert(authors).values(author);
      console.log(`✓ Autor creado: ${author.name}`);
    }

    console.log("✓ Autores insertados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al insertar autores:", error);
    process.exit(1);
  }
}

seedAuthors();
