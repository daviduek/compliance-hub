import { promises as fs } from "fs";
import path from "path";
import type { Legajo } from "./types";

/**
 * Persistencia simple para legajos creados en modo real.
 *
 * - Local: lee/escribe `data/legajos.json` (versión-controlable si se quiere).
 * - Producción (Vercel serverless): fs es read-only → cae a memoria.
 *
 * Para producción real se debería reemplazar por Postgres / Vercel KV / Supabase.
 * El contrato (load / save / get / upsert / remove) se mantiene compatible.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "legajos.json");

let memoryCache: Legajo[] | null = null;
let writable: boolean | null = null;

async function probeWritable(): Promise<boolean> {
  if (writable !== null) return writable;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const probe = path.join(DATA_DIR, ".probe");
    await fs.writeFile(probe, "");
    await fs.unlink(probe);
    writable = true;
  } catch {
    writable = false;
  }
  return writable;
}

export async function loadAll(): Promise<Legajo[]> {
  if (memoryCache) return memoryCache;
  if (await probeWritable()) {
    try {
      const raw = await fs.readFile(FILE, "utf8");
      memoryCache = JSON.parse(raw) as Legajo[];
    } catch {
      memoryCache = [];
    }
  } else {
    memoryCache = [];
  }
  return memoryCache!;
}

async function persist() {
  if (!memoryCache) return;
  if (await probeWritable()) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(memoryCache, null, 2), "utf8");
    } catch {
      /* swallow — memory cache still authoritative for the process */
    }
  }
}

export async function getById(id: string): Promise<Legajo | null> {
  const all = await loadAll();
  return all.find((l) => l.id === id) ?? null;
}

export async function upsert(legajo: Legajo): Promise<Legajo> {
  const all = await loadAll();
  const idx = all.findIndex((l) => l.id === legajo.id);
  if (idx >= 0) all[idx] = legajo;
  else all.unshift(legajo);
  await persist();
  return legajo;
}

export async function remove(id: string): Promise<boolean> {
  const all = await loadAll();
  const before = all.length;
  memoryCache = all.filter((l) => l.id !== id);
  await persist();
  return memoryCache.length < before;
}

export function nextLegajoId(): string {
  // LEG-YYYY-MMDDxx style based on current date + random suffix
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `LEG-${yyyy}-${mm}${dd}-${rand}`;
}
