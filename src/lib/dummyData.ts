import { Medicine, Order } from '../types';

export const initialMedicines: Medicine[] = [
  { id: "med001", name: "Amoxicillin 250mg", stock: 100, status: 'active' },
  { id: "med002", name: "Paracetamol 500mg", stock: 50, status: 'active' },
  { id: "med003", name: "Ibuprofen 200mg", stock: "Out of Stock", status: 'active' },
  { id: "med004", name: "Omeprazole 20mg", stock: 200, status: 'active' },
  { id: "med005", name: "Salbutamol Inhaler", stock: 0, status: 'active' },
  { id: "med006", name: "Loratadine 10mg", stock: 75, status: 'active' },
  { id: "med007", name: "Metformin 500mg", stock: 120, status: 'active' },
  { id: "med008", name: "Atorvastatin 20mg", stock: 60, status: 'active' },
];

export const initialOrders: Order[] = [
  { id: "ord123", status: "Processing", items: [{ medicineId: 'med001', medicineName: 'Amoxicillin 250mg', quantity: 1}] },
  { id: "ord124", status: "Shipped", items: [] },
  { id: "ord125", status: "Delivered", items: [] },
  { id: "ord126", status: "Pending", items: [] },
]; 