import { useUIStore } from '../stores/uiStore';

export const useAppUI = () => {
  const isModalOpen = useUIStore((state) => state.isModalOpen);
  const selectedMedicineInfo = useUIStore((state) => state.selectedMedicineInfo);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);

  const isRestockModalOpen = useUIStore((state) => state.isRestockModalOpen);
  const restockMedicineInfo = useUIStore((state) => state.restockMedicineInfo);
  const openRestockModal = useUIStore((state) => state.openRestockModal);
  const closeRestockModal = useUIStore((state) => state.closeRestockModal);

  return {
    isModalOpen,
    selectedMedicineInfo,
    openModal,
    closeModal,

    isRestockModalOpen,
    restockMedicineInfo,
    openRestockModal,
    closeRestockModal,
  };
}; 