"use client"; // Top-level page needs to be client component for useState and handlers

import AddToOrderModal from '../components/AddToOrderModal';
import OrdersSidebar from '../components/OrdersSidebar';
import MedicineView from '../components/MedicineView';
import RestockModal from '../components/RestockModal';
import { toastService } from '../lib/toastService';
import { Order } from '../types'; // Medicine, OrderItem might not be needed if stores handle types

// Import custom hooks
import { useAppMedicines } from '../hooks/useAppMedicines';
import { useAppOrders } from '../hooks/useAppOrders';
import { useAppUI } from '../hooks/useAppUI';

export default function HomePage() {
  const appMedicinesHook = useAppMedicines(); // Get the whole hook object first

  const { 
    medicines, 
    decrementMedicineStock, 
    restockMedicine, 
    trashMedicine, 
    restoreMedicine, 
    permanentlyDeleteMedicine 
  } = appMedicinesHook; // Destructure after logging
  
  const { orders, addOrder, addMedicineToOrder } = useAppOrders();
  const { 
    isModalOpen, selectedMedicineInfo, openModal, closeModal,
    isRestockModalOpen, restockMedicineInfo, openRestockModal, closeRestockModal
  } = useAppUI();

  const handleTrashMedicine = (medicineId: string, medicineName: string) => {
    if (typeof trashMedicine === 'function') {
      trashMedicine(medicineId); 
      toastService.info(`${medicineName} has been moved to trash.`);
    } else {
      console.error("[HomePage] handleTrashMedicine: trashMedicine action is undefined!");
      toastService.error("Error: Trash action is not available.");
    }
  };

  const handleRestoreMedicine = (medicineId: string, medicineName: string) => {
    if (typeof restoreMedicine === 'function') {
      restoreMedicine(medicineId);
      toastService.success(`${medicineName} has been restored.`);
    } else {
      console.error("[HomePage] handleRestoreMedicine: restoreMedicine action is undefined!");
      toastService.error("Error: Restore action is not available.");
    }
  };

  const handlePermanentlyDeleteMedicine = (medicineId: string, medicineName: string) => {
    if (typeof permanentlyDeleteMedicine === 'function') {
      permanentlyDeleteMedicine(medicineId);
      toastService.error(`${medicineName} has been permanently deleted.`);
    } else {
      console.error("[HomePage] handlePermanentlyDeleteMedicine: permanentlyDeleteMedicine action is undefined!");
      toastService.error("Error: Permanent delete action is not available.");
    }
  };

  const handleOpenModal = (medicineId: string, medicineName: string, medicineStock: number | string) => {
    openModal({ id: medicineId, name: medicineName, stock: medicineStock });
  };

  const handleOpenRestockModal = (medicineId: string, medicineName: string) => {
    openRestockModal({ id: medicineId, name: medicineName });
  };

  const handleAddToExistingOrder = (orderId: string, medicineId: string, medicineName: string, quantity: number) => {
    addMedicineToOrder(orderId, medicineId, medicineName, quantity);
    decrementMedicineStock(medicineId, quantity);
    toastService.success(`Added ${medicineName} (Qty: ${quantity}) to Order #${orderId}`);
    closeModal(); 
  };

  const handleCreateNewOrderAndAdd = (medicineId: string, medicineName: string, quantity: number) => {
    const newOrderId = `ord${Date.now().toString().slice(-3)}`;
    const newOrder: Order = { 
      id: newOrderId,
      status: "Pending",
      items: [{ medicineId, medicineName, quantity }]
    };
    addOrder(newOrder);
    decrementMedicineStock(medicineId, quantity);
    toastService.success(`Created Order #${newOrderId} & added ${medicineName} (Qty: ${quantity}).`);
    closeModal(); 
  };

  const handleConfirmRestock = (medicineId: string, quantityToAdd: number) => {
    restockMedicine(medicineId, quantityToAdd);
    const medicineName = restockMedicineInfo?.name || 'Medicine';
    toastService.success(`Restocked ${medicineName} by ${quantityToAdd}.`);
    closeRestockModal();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar orders={orders} />
      <MedicineView 
        allMedicines={medicines} 
        onOpenAddToOrderModal={handleOpenModal} 
        onOpenRestockModal={handleOpenRestockModal}
        onTrashMedicine={handleTrashMedicine} 
        onRestoreMedicine={handleRestoreMedicine} 
        onPermanentlyDeleteMedicine={handlePermanentlyDeleteMedicine} 
      />

      {isModalOpen && selectedMedicineInfo && (
        <AddToOrderModal
          isOpen={isModalOpen}
          onClose={closeModal}
          medicineName={selectedMedicineInfo.name}
          medicineId={selectedMedicineInfo.id}
          medicineStock={selectedMedicineInfo.stock}
          orders={orders}
          onAddToExistingOrder={handleAddToExistingOrder}
          onAddNewOrder={handleCreateNewOrderAndAdd}
        />
      )}

      {isRestockModalOpen && restockMedicineInfo && (
        <RestockModal
          isOpen={isRestockModalOpen}
          onClose={closeRestockModal}
          medicineName={restockMedicineInfo.name}
          medicineId={restockMedicineInfo.id}
          onConfirmRestock={handleConfirmRestock}
        />
      )}
    </div>
  );
}
