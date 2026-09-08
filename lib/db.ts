import fs from "fs";
import path from "path";
import { Customer, Package, Ticket, Bill, CoverageArea, Content, AdminUser } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filename: string): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

function writeJSON<T>(filename: string, data: T[]) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function readSingleJSON<T>(filename: string): T | null {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeSingleJSON<T>(filename: string, data: T) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getCustomers() { return readJSON<Customer>("customers.json"); }
export function saveCustomers(data: Customer[]) { writeJSON("customers.json", data); }
export function getCustomerById(id: string) { return getCustomers().find(c => c.id === id); }
export function getCustomerByEmail(email: string) { return getCustomers().find(c => c.email === email); }
export function getCustomerByNo(noPelanggan: string) { return getCustomers().find(c => c.noPelanggan === noPelanggan); }
export function addCustomer(customer: Customer) { const data = getCustomers(); data.push(customer); saveCustomers(data); return customer; }
export function updateCustomer(id: string, updates: Partial<Customer>) {
  const data = getCustomers();
  const idx = data.findIndex(c => c.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  saveCustomers(data);
  return data[idx];
}
export function deleteCustomer(id: string) {
  const data = getCustomers().filter(c => c.id !== id);
  saveCustomers(data);
}

export function getPackages() { return readJSON<Package>("packages.json"); }
export function savePackages(data: Package[]) { writeJSON("packages.json", data); }
export function getPackageById(id: string) { return getPackages().find(p => p.id === id); }
export function addPackage(pkg: Package) { const data = getPackages(); data.push(pkg); savePackages(data); return pkg; }
export function updatePackage(id: string, updates: Partial<Package>) {
  const data = getPackages();
  const idx = data.findIndex(p => p.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  savePackages(data);
  return data[idx];
}
export function deletePackage(id: string) {
  const data = getPackages().filter(p => p.id !== id);
  savePackages(data);
}

export function getTickets() { return readJSON<Ticket>("tickets.json"); }
export function saveTickets(data: Ticket[]) { writeJSON("tickets.json", data); }
export function getTicketById(id: string) { return getTickets().find(t => t.id === id); }
export function getTicketsByCustomer(noPelanggan: string) { return getTickets().filter(t => t.noPelanggan === noPelanggan); }
export function addTicket(ticket: Ticket) { const data = getTickets(); data.push(ticket); saveTickets(data); return ticket; }
export function updateTicket(id: string, updates: Partial<Ticket>) {
  const data = getTickets();
  const idx = data.findIndex(t => t.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  saveTickets(data);
  return data[idx];
}

export function getBills() { return readJSON<Bill>("bills.json"); }
export function saveBills(data: Bill[]) { writeJSON("bills.json", data); }
export function getBillsByCustomer(noPelanggan: string) { return getBills().filter(b => b.noPelanggan === noPelanggan); }
export function getBillById(id: string) { return getBills().find(b => b.id === id); }
export function addBill(bill: Bill) { const data = getBills(); data.push(bill); saveBills(data); return bill; }
export function updateBill(id: string, updates: Partial<Bill>) {
  const data = getBills();
  const idx = data.findIndex(b => b.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  saveBills(data);
  return data[idx];
}

export function getCoverageAreas() { return readJSON<CoverageArea>("coverage.json"); }
export function saveCoverageAreas(data: CoverageArea[]) { writeJSON("coverage.json", data); }
export function getCoverageAreaById(id: string) { return getCoverageAreas().find(a => a.id === id); }
export function addCoverageArea(area: CoverageArea) { const data = getCoverageAreas(); data.push(area); saveCoverageAreas(data); return area; }
export function updateCoverageArea(id: string, updates: Partial<CoverageArea>) {
  const data = getCoverageAreas();
  const idx = data.findIndex(a => a.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  saveCoverageAreas(data);
  return data[idx];
}
export function deleteCoverageArea(id: string) {
  const data = getCoverageAreas().filter(a => a.id !== id);
  saveCoverageAreas(data);
}

export function getContents() { return readJSON<Content>("content.json"); }
export function saveContents(data: Content[]) { writeJSON("content.json", data); }
export function getContentById(id: string) { return getContents().find(c => c.id === id); }
export function addContent(content: Content) { const data = getContents(); data.push(content); saveContents(data); return content; }
export function updateContent(id: string, updates: Partial<Content>) {
  const data = getContents();
  const idx = data.findIndex(c => c.id === id);
  if (idx === -1) return null;
  data[idx] = { ...data[idx], ...updates };
  saveContents(data);
  return data[idx];
}
export function deleteContent(id: string) {
  const data = getContents().filter(c => c.id !== id);
  saveContents(data);
}

export function getAdminUsers() { return readSingleJSON<AdminUser[]>("admins.json") || []; }
export function saveAdminUsers(data: AdminUser[]) { writeSingleJSON("admins.json", data); }
export function getAdminByUsername(username: string) { return getAdminUsers().find(a => a.username === username); }

export function getStats() {
  const customers = getCustomers();
  const packages = getPackages();
  const tickets = getTickets();
  const bills = getBills();
  const areas = getCoverageAreas();
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalRevenue = bills.filter(b => b.status === "paid").reduce((sum, b) => sum + b.jumlahBayar!, 0);
  const pendingBills = bills.filter(b => b.status === "unpaid" || b.status === "overdue").reduce((sum, b) => sum + b.tagihan, 0);
  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  return {
    totalCustomers: customers.length,
    activeCustomers,
    pendingCustomers: customers.filter(c => c.status === "pending").length,
    totalPackages: packages.length,
    activePackages: packages.filter(p => p.status === "active").length,
    totalTickets: tickets.length,
    openTickets,
    totalRevenue,
    pendingBills,
    totalAreas: areas.length,
    activeAreas: areas.filter(a => a.status === "active").length,
  };
}
