import { useMedicineStore } from '../stores/medicineStore';

export const useAppMedicines = () => {
  const medicines = useMedicineStore((state) => state.medicines);
  const decrementMedicineStock = useMedicineStore((state) => state.decrementMedicineStock);
  const incrementMedicineStock = useMedicineStore((state) => state.incrementMedicineStock);
  const restockMedicine = useMedicineStore((state) => state.restockMedicine);
  const trashMedicine = useMedicineStore((state) => state.trashMedicine);
  const restoreMedicine = useMedicineStore((state) => state.restoreMedicine);
  const permanentlyDeleteMedicine = useMedicineStore((state) => state.permanentlyDeleteMedicine);
  // const { addMedicine, updateMedicineStock } = useMedicineStore();

  return {
    medicines,
    decrementMedicineStock,
    incrementMedicineStock,
    restockMedicine,
    trashMedicine,
    restoreMedicine,
    permanentlyDeleteMedicine,
    // addMedicine, // export future actions
    // updateMedicineStock,
  };
}; 