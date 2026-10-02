import { randomBytes } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as blob from "@vercel/blob";

// Two backends behind one tiny API: Vercel Blob (private store) when its token is
// set, otherwise JSON/binary files under <site>/data/configurator (gitignored). Nothing here queries across
// records except /admin's list.
const ROOT = path.join(process.cwd(), "data", "configurator");
const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function newId(): string {
  return Array.from(randomBytes(8), (b) => ALPHABET[b % 62]).join("");
}

/** Ids come from URLs, so refuse anything that could escape the folder. */
export function isId(id: string): boolean {
  return /^[0-9A-Za-z]{1,32}$/.test(id);
}

export async function saveFile(kind: string, name: string, bytes: Uint8Array, contentType: string): Promise<void> {
  if (blobEnabled()) {
    await blob.put(`${kind}/${name}`, Buffer.from(bytes), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType });
    return;
  }
  await mkdir(path.join(ROOT, kind), { recursive: true });
  await writeFile(path.join(ROOT, kind, name), bytes);
}

export async function loadFile(kind: string, name: string): Promise<Uint8Array | null> {
  try {
    if (blobEnabled()) {
      const got = await blob.get(`${kind}/${name}`, { access: "private", useCache: false });
      return got ? new Uint8Array(await new Response(got.stream).arrayBuffer()) : null;
    }
    return new Uint8Array(await readFile(path.join(ROOT, kind, name)));
  } catch {
    return null;
  }
}

export async function save(kind: string, id: string, value: unknown): Promise<void> {
  await saveFile(kind, `${id}.json`, new TextEncoder().encode(JSON.stringify(value, null, 2)), "application/json");
}

export async function load<T>(kind: string, id: string): Promise<T | null> {
  if (!isId(id)) return null;
  const bytes = await loadFile(kind, `${id}.json`);
  return bytes ? (JSON.parse(new TextDecoder().decode(bytes)) as T) : null;
}

export async function list<T>(kind: string): Promise<T[]> {
  let names: string[];
  if (blobEnabled()) {
    const { blobs } = await blob.list({ prefix: `${kind}/`, limit: 1000 });
    names = blobs.map((b) => b.pathname.slice(kind.length + 1));
  } else {
    try {
      names = await readdir(path.join(ROOT, kind));
    } catch {
      return [];
    }
  }
  const out = await Promise.all(names.filter((n) => n.endsWith(".json")).map((n) => loadFile(kind, n)));
  return out.filter((b): b is Uint8Array => b !== null).map((b) => JSON.parse(new TextDecoder().decode(b)) as T);
}
