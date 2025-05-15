import { useOrderStore } from '../stores/orderStore';

export const useAppOrders = () => {
  const orders = useOrderStore((state) => state.orders);
  const addOrder = useOrderStore((state) => state.addOrder);
  const addMedicineToOrder = useOrderStore((state) => state.addMedicineToOrder);
  const updateOrderItemQuantity = useOrderStore((state) => state.updateOrderItemQuantity);
  const removeOrderItem = useOrderStore((state) => state.removeOrderItem);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);

  return {
    orders,
    addOrder,
    addMedicineToOrder,
    updateOrderItemQuantity,
    removeOrderItem,
    deleteOrder,
  };
}; 