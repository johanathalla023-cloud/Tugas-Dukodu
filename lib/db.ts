import fs from "fs";
import path from "path";
import { query, isUsingDatabase } from "./pg";
import { SCHEMA_SQL } from "../db/schema";
import { SEED_PACKAGES, SEED_AREAS, SEED_CONTENTS, SEED_ADMINS } from "./seedData";
import { Customer, Package, Ticket, Bill, CoverageArea, Content, AdminUser } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const USING_DB = isUsingDatabase();

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // filesystem read-only (mis. Vercel tanpa DATABASE_URL) — jangan hentikan aplikasi
  }
}

/* ============ Inisialisasi otomatis (idempotent & self-healing) ============ */

let readyPromise: Promise<void> | null = null;

export function ensureDatabaseReady(): Promise<void> {
  if (!USING_DB) return Promise.resolve();
  if (!readyPromise) {
    readyPromise = initSchemaAndSeed();
  }
  return readyPromise;
}

async function initSchemaAndSeed(): Promise<void> {
  try {
    const exists = await query<{ e: boolean }>(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customers') AS e`
    );
    if (!exists[0]?.e) {
      await query(SCHEMA_SQL);
    }
    await seedIfEmpty("packages", SEED_PACKAGES);
    await seedIfEmpty("coverage_areas", SEED_AREAS);
    await seedIfEmpty("contents", SEED_CONTENTS);
    await seedIfEmpty("admins", SEED_ADMINS as unknown as object[]);
  } catch (err) {
    readyPromise = null;
    throw err;
  }
}

async function seedIfEmpty(table: string, rows: object[]) {
  if (!rows.length) return;
  const counts = await query<{ c: number }>(`SELECT COUNT(*)::int AS c FROM "${table}"`);
  if ((counts[0]?.c ?? 0) > 0) return;
  for (const row of rows) {
    try {
      await insertRow(table, row);
    } catch {
      // benih idem: abaikan duplikat bila beberapa instance berbarengan
    }
  }
}

/* ============ Helper Postgres ============ */

function pgValue(v: unknown): unknown {
  if (v === undefined) return null;
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return v;
}

async function insertRow<T>(table: string, row: T): Promise<T> {
  const cols = Object.keys(row as object);
  if (cols.length === 0) return row;
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const params = cols.map((c) => pgValue((row as Record<string, unknown>)[c]));
  await query(
    `INSERT INTO "${table}" (${cols.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`,
    params
  );
  return row;
}

async function dbAll<T>(table: string): Promise<T[]> {
  await ensureDatabaseReady();
  return query<T>(`SELECT * FROM "${table}"`);
}

async function dbFind<T>(table: string, key: string, value: unknown): Promise<T | null> {
  await ensureDatabaseReady();
  const rows = await query<T>(`SELECT * FROM "${table}" WHERE "${key}" = $1`, [value]);
  return rows[0] ?? null;
}

async function dbAdd<T>(table: string, row: T): Promise<T> {
  await ensureDatabaseReady();
  return insertRow(table, row);
}

async function dbUpdate<T>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
  await ensureDatabaseReady();
  const cols = Object.keys(updates);
  if (cols.length === 0) return dbFind<T>(table, "id", id);
  const setClause = cols.map((c, i) => `"${c}" = $${i + 2}`).join(", ");
  const params = [id, ...cols.map((c) => pgValue((updates as Record<string, unknown>)[c]))];
  const rows = await query<T>(
    `UPDATE "${table}" SET ${setClause} WHERE "id" = $1 RETURNING *`,
    params
  );
  return rows[0] ?? null;
}

async function dbDelete(table: string, id: string) {
  await ensureDatabaseReady();
  await query(`DELETE FROM "${table}" WHERE "id" = $1`, [id]);
}

async function dbReplace(table: string, rows: unknown[]) {
  await ensureDatabaseReady();
  await query(`DELETE FROM "${table}"`);
  for (const r of rows) await insertRow(table, r);
}

/* ============ Helper JSON (fallback) ============ */

async function fileRead<T>(filename: string): Promise<T[]> {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    try {
      await fileWrite(filename, []);
    } catch {
      // ignore — read-only env
    }
    return [];
  }
  const raw = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

async function fileWrite<T>(filename: string, data: T[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function fileReadSingle<T>(filename: string): Promise<T | null> {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

async function fileWriteSingle<T>(filename: string, data: T) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/* ============ Customers ============ */

export async function getCustomers(): Promise<Customer[]> {
  return USING_DB ? dbAll<Customer>("customers") : fileRead<Customer>("customers.json");
}
export async function saveCustomers(data: Customer[]) {
  return USING_DB ? dbReplace("customers", data) : fileWrite("customers.json", data);
}
export async function getCustomerById(id: string): Promise<Customer | null> {
  return USING_DB
    ? dbFind<Customer>("customers", "id", id)
    : (await getCustomers()).find((c) => c.id === id) || null;
}
export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  return USING_DB
    ? dbFind<Customer>("customers", "email", email)
    : (await getCustomers()).find((c) => c.email === email) || null;
}
export async function getCustomerByNo(noPelanggan: string): Promise<Customer | null> {
  return USING_DB
    ? dbFind<Customer>("customers", "noPelanggan", noPelanggan)
    : (await getCustomers()).find((c) => c.noPelanggan === noPelanggan) || null;
}
export async function addCustomer(customer: Customer): Promise<Customer> {
  if (USING_DB) return dbAdd("customers", customer);
  const data = await getCustomers();
  data.push(customer);
  await saveCustomers(data);
  return customer;
}
export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  if (USING_DB) return dbUpdate("customers", id, updates);
  const data = await getCustomers();
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  await saveCustomers(data);
  return data[idx];
}
export async function deleteCustomer(id: string) {
  if (USING_DB) return dbDelete("customers", id);
  const data = (await getCustomers()).filter((c) => c.id !== id);
  await saveCustomers(data);
}

/* ============ Packages ============ */

export async function getPackages(): Promise<Package[]> {
  return USING_DB ? dbAll<Package>("packages") : fileRead<Package>("packages.json");
}
export async function savePackages(data: Package[]) {
  return USING_DB ? dbReplace("packages", data) : fileWrite("packages.json", data);
}
export async function getPackageById(id: string): Promise<Package | null> {
  return USING_DB
    ? dbFind<Package>("packages", "id", id)
    : (await getPackages()).find((p) => p.id === id) || null;
}
export async function addPackage(pkg: Package): Promise<Package> {
  if (USING_DB) return dbAdd("packages", pkg);
  const data = await getPackages();
  data.push(pkg);
  await savePackages(data);
  return pkg;
}
export async function updatePackage(id: string, updates: Partial<Package>): Promise<Package | null> {
  if (USING_DB) return dbUpdate("packages", id, updates);
  const data = await getPackages();
  const idx = data.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  await savePackages(data);
  return data[idx];
}
export async function deletePackage(id: string) {
  if (USING_DB) return dbDelete("packages", id);
  const data = (await getPackages()).filter((p) => p.id !== id);
  await savePackages(data);
}

/* ============ Tickets ============ */

export async function getTickets(): Promise<Ticket[]> {
  return USING_DB ? dbAll<Ticket>("tickets") : fileRead<Ticket>("tickets.json");
}
export async function saveTickets(data: Ticket[]) {
  return USING_DB ? dbReplace("tickets", data) : fileWrite("tickets.json", data);
}
export async function getTicketById(id: string): Promise<Ticket | null> {
  return USING_DB
    ? dbFind<Ticket>("tickets", "id", id)
    : (await getTickets()).find((t) => t.id === id) || null;
}
export async function getTicketsByCustomer(noPelanggan: string): Promise<Ticket[]> {
  if (USING_DB) return dbAll<Ticket>("tickets").then((rows) => rows.filter((t) => t.noPelanggan === noPelanggan));
  return (await getTickets()).filter((t) => t.noPelanggan === noPelanggan);
}
export async function addTicket(ticket: Ticket): Promise<Ticket> {
  if (USING_DB) return dbAdd("tickets", ticket);
  const data = await getTickets();
  data.push(ticket);
  await saveTickets(data);
  return ticket;
}
export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket | null> {
  if (USING_DB) return dbUpdate("tickets", id, updates);
  const data = await getTickets();
  const idx = data.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  await saveTickets(data);
  return data[idx];
}

/* ============ Bills ============ */

export async function getBills(): Promise<Bill[]> {
  return USING_DB ? dbAll<Bill>("bills") : fileRead<Bill>("bills.json");
}
export async function saveBills(data: Bill[]) {
  return USING_DB ? dbReplace("bills", data) : fileWrite("bills.json", data);
}
export async function getBillsByCustomer(noPelanggan: string): Promise<Bill[]> {
  if (USING_DB) return dbAll<Bill>("bills").then((rows) => rows.filter((b) => b.noPelanggan === noPelanggan));
  return (await getBills()).filter((b) => b.noPelanggan === noPelanggan);
}
export async function getBillById(id: string): Promise<Bill | null> {
  return USING_DB
    ? dbFind<Bill>("bills", "id", id)
    : (await getBills()).find((b) => b.id === id) || null;
}
export async function addBill(bill: Bill): Promise<Bill> {
  if (USING_DB) return dbAdd("bills", bill);
  const data = await getBills();
  data.push(bill);
  await saveBills(data);
  return bill;
}
export async function updateBill(id: string, updates: Partial<Bill>): Promise<Bill | null> {
  if (USING_DB) return dbUpdate("bills", id, updates);
  const data = await getBills();
  const idx = data.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  await saveBills(data);
  return data[idx];
}

/* ============ Coverage Areas ============ */

export async function getCoverageAreas(): Promise<CoverageArea[]> {
  return USING_DB ? dbAll<CoverageArea>("coverage_areas") : fileRead<CoverageArea>("coverage.json");
}
export async function saveCoverageAreas(data: CoverageArea[]) {
  return USING_DB ? dbReplace("coverage_areas", data) : fileWrite("coverage.json", data);
}
export async function getCoverageAreaById(id: string): Promise<CoverageArea | null> {
  return USING_DB
    ? dbFind<CoverageArea>("coverage_areas", "id", id)
    : (await getCoverageAreas()).find((a) => a.id === id) || null;
}
export async function addCoverageArea(area: CoverageArea): Promise<CoverageArea> {
  if (USING_DB) return dbAdd("coverage_areas", area);
  const data = await getCoverageAreas();
  data.push(area);
  await saveCoverageAreas(data);
  return area;
}
export async function updateCoverageArea(id: string, updates: Partial<CoverageArea>): Promise<CoverageArea | null> {
  if (USING_DB) return dbUpdate("coverage_areas", id, updates);
  const data = await getCoverageAreas();
  const idx = data.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  await saveCoverageAreas(data);
  return data[idx];
}
export async function deleteCoverageArea(id: string) {
  if (USING_DB) return dbDelete("coverage_areas", id);
  const data = (await getCoverageAreas()).filter((a) => a.id !== id);
  await saveCoverageAreas(data);
}

/* ============ Contents ============ */

export async function getContents(): Promise<Content[]> {
  return USING_DB ? dbAll<Content>("contents") : fileRead<Content>("content.json");
}
export async function saveContents(data: Content[]) {
  return USING_DB ? dbReplace("contents", data) : fileWrite("content.json", data);
}
export async function getContentById(id: string): Promise<Content | null> {
  return USING_DB
    ? dbFind<Content>("contents", "id", id)
    : (await getContents()).find((c) => c.id === id) || null;
}
export async function addContent(content: Content): Promise<Content> {
  if (USING_DB) return dbAdd("contents", content);
  const data = await getContents();
  data.push(content);
  await saveContents(data);
  return content;
}
export async function updateContent(id: string, updates: Partial<Content>): Promise<Content | null> {
  if (USING_DB) return dbUpdate("contents", id, updates);
  const data = await getContents();
  const idx = data.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  await saveContents(data);
  return data[idx];
}
export async function deleteContent(id: string) {
  if (USING_DB) return dbDelete("contents", id);
  const data = (await getContents()).filter((c) => c.id !== id);
  await saveContents(data);
}

/* ============ Admins ============ */

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (USING_DB) return dbAll<AdminUser>("admins");
  return (await fileReadSingle<AdminUser[]>("admins.json")) || [];
}
export async function saveAdminUsers(data: AdminUser[]) {
  return USING_DB ? dbReplace("admins", data) : fileWriteSingle("admins.json", data);
}
export async function getAdminByUsername(username: string): Promise<AdminUser | null> {
  return USING_DB
    ? dbFind<AdminUser>("admins", "username", username)
    : (await getAdminUsers()).find((a) => a.username === username) || null;
}

/* ============ Stats ============ */

export async function getStats() {
  const customers = USING_DB ? await dbAll<Customer>("customers") : await getCustomers();
  const packages = USING_DB ? await dbAll<Package>("packages") : await getPackages();
  const tickets = USING_DB ? await dbAll<Ticket>("tickets") : await getTickets();
  const bills = USING_DB ? await dbAll<Bill>("bills") : await getBills();
  const areas = USING_DB ? await dbAll<CoverageArea>("coverage_areas") : await getCoverageAreas();

  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const totalRevenue = bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.jumlahBayar!, 0);
  const pendingBills = bills.filter((b) => b.status === "unpaid" || b.status === "overdue").reduce((sum, b) => sum + b.tagihan, 0);
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;

  return {
    totalCustomers: customers.length,
    activeCustomers,
    pendingCustomers: customers.filter((c) => c.status === "pending").length,
    totalPackages: packages.length,
    activePackages: packages.filter((p) => p.status === "active").length,
    totalTickets: tickets.length,
    openTickets,
    totalRevenue,
    pendingBills,
    totalAreas: areas.length,
    activeAreas: areas.filter((a) => a.status === "active").length,
  };
}