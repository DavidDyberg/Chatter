import { MongoClient } from "mongodb";

const url = process.env.MONGO_DB_URL as string;
const client = new MongoClient(url);

let db: any;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log("✅ Database connected successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error while connecting to database: ${error.message}`);
    }
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}
