import { create } from 'zustand';

interface SelectedMedicineInfo {
  id: string;
  name: string;
  stock: number | string;
}

interface RestockMedicineInfo {
  id: string;
  name: string;
}

interface UIState {
  isModalOpen: boolean;
  selectedMedicineInfo: SelectedMedicineInfo | null;
  openModal: (medicineInfo: SelectedMedicineInfo) => void;
  closeModal: () => void;

  isRestockModalOpen: boolean;
  restockMedicineInfo: RestockMedicineInfo | null;
  openRestockModal: (info: RestockMedicineInfo) => void;
  closeRestockModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  selectedMedicineInfo: null,
  openModal: (medicineInfo) => 
    set({ isModalOpen: true, selectedMedicineInfo: medicineInfo }),
  closeModal: () => 
    set({ isModalOpen: false, selectedMedicineInfo: null }),

  isRestockModalOpen: false,
  restockMedicineInfo: null,
  openRestockModal: (info) => 
    set({ isRestockModalOpen: true, restockMedicineInfo: info }),
  closeRestockModal: () => 
    set({ isRestockModalOpen: false, restockMedicineInfo: null }),
})); 