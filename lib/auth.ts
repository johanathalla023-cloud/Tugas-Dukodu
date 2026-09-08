export const CUSTOMER_KEY = "dukodu_customer";

export interface CustomerSession {
  id: string;
  namaLengkap: string;
  email: string;
  noWhatsApp: string;
  noPelanggan: string;
  status: string;
  paketId: string;
}

export function getCustomerSession(): CustomerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCustomerSession(customer: CustomerSession) {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}

export function clearCustomerSession() {
  localStorage.removeItem(CUSTOMER_KEY);
}

export const ADMIN_KEY = "dukodu_admin";

export interface AdminSession {
  id: string;
  username: string;
  nama: string;
  role: string;
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(admin: AdminSession) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_KEY);
}

export function formatIDR(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}
