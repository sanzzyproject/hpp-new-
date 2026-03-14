import { openDB, type DBSchema } from "idb";
import type { Calculation } from "@/types";

interface HPPDatabase extends DBSchema {
  calculations: {
    key: number;
    value: Calculation;
    indexes: { "by-date": number };
  };
}

const DB_NAME = "hpp_calculator_db";
const DB_VERSION = 1;

export async function getDB() {
  return openDB<HPPDatabase>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("calculations", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("by-date", "createdAt");
    },
  });
}

export async function saveCalculation(calc: Omit<Calculation, "id">): Promise<number> {
  const db = await getDB();
  const id = await db.add("calculations", { ...calc } as Calculation);
  return id as number;
}

export async function getAllCalculations(): Promise<Calculation[]> {
  const db = await getDB();
  const all = await db.getAll("calculations");
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCalculationById(id: number): Promise<Calculation | undefined> {
  const db = await getDB();
  return db.get("calculations", id);
}

export async function deleteCalculation(id: number): Promise<void> {
  const db = await getDB();
  await db.delete("calculations", id);
}
