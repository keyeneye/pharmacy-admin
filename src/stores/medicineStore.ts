import { create } from 'zustand';
import { Medicine } from '../types';
import { initialMedicines } from '../lib/dummyData'; // Get initial data

interface MedicineState {
  medicines: Medicine[];
  decrementMedicineStock: (medicineId: string, quantityToDecrement: number) => void;
  incrementMedicineStock: (medicineId: string, quantityToIncrement: number) => void;
  restockMedicine: (medicineId: string, quantityToAdd: number) => void;
  trashMedicine: (medicineId: string) => void;
  restoreMedicine: (medicineId: string) => void;
  permanentlyDeleteMedicine: (medicineId: string) => void;
}

export const useMedicineStore = create<MedicineState>((set) => ({
  medicines: initialMedicines,
  decrementMedicineStock: (medicineId, quantityToDecrement) =>
    set((state) => ({
      medicines: state.medicines.map((med) => {
        if (med.id === medicineId && med.status === 'active') {
          let currentStockValue = 0;
          if (typeof med.stock === 'number') {
            currentStockValue = med.stock;
          } else { // Implies med.stock is "Out of Stock"
            currentStockValue = 0;
          }
          const newStock = Math.max(0, currentStockValue - quantityToDecrement);
          return { ...med, stock: newStock }; 
        }
        return med;
      }),
    })),
  incrementMedicineStock: (medicineId, quantityToIncrement) =>
    set((state) => ({
      medicines: state.medicines.map((med) => {
        if (med.id === medicineId && med.status === 'active') {
          let currentStockValue = 0;
          if (typeof med.stock === 'number') {
            currentStockValue = med.stock;
          } else { // Implies med.stock is "Out of Stock" or was previously set to 0 and stored as string
            currentStockValue = 0; // Treat "Out of Stock" as 0 for incrementing
          }
          // Ensure quantityToIncrement is positive, though it should be by logic
          const newStock = currentStockValue + Math.max(0, quantityToIncrement); 
          return { ...med, stock: newStock }; 
        }
        return med;
      }),
    })),
  restockMedicine: (medicineId, quantityToAdd) =>
    set((state) => ({
      medicines: state.medicines.map((med) => {
        if (med.id === medicineId && med.status === 'active') {
          let currentStockValue = 0;
          if (typeof med.stock === 'number') {
            currentStockValue = med.stock;
          } // If 'Out of Stock', currentStockValue remains 0, so new stock is quantityToAdd
          
          const newStock = currentStockValue + Math.max(0, quantityToAdd); // Ensure quantityToAdd is not negative
          return { ...med, stock: newStock };
        }
        return med;
      }),
    })),
  trashMedicine: (medicineIdToTrash) =>
    set((state) => ({
      medicines: state.medicines.map(med => 
        med.id === medicineIdToTrash ? { ...med, status: 'trashed' } : med
      ),
    })),
  restoreMedicine: (medicineIdToRestore) =>
    set((state) => ({
      medicines: state.medicines.map(med =>
        med.id === medicineIdToRestore ? { ...med, status: 'active' } : med
      ),
    })),
  permanentlyDeleteMedicine: (medicineIdToDelete) =>
    set((state) => ({
      // Ensure we only delete if it's actually in 'trashed' state, though UI should control this
      medicines: state.medicines.filter(med => !(med.id === medicineIdToDelete && med.status === 'trashed')),
    })),
})); 