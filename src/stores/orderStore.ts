import { create } from 'zustand';
import { Order } from '../types';
import { initialOrders } from '../lib/dummyData';

interface OrderState {
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  addMedicineToOrder: (orderId: string, medicineId: string, medicineName: string, quantity?: number) => void;
  updateOrderItemQuantity: (orderId: string, medicineId: string, newQuantity: number) => void;
  removeOrderItem: (orderId: string, medicineId: string) => void;
  deleteOrder: (orderIdToDelete: string) => void;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: initialOrders,
  addOrder: (newOrder) => 
    set((state) => ({ orders: [newOrder, ...state.orders] })),
  addMedicineToOrder: (orderId, medicineId, medicineName, quantity = 1) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.find(item => item.medicineId === medicineId)
                ? order.items.map(item => 
                    item.medicineId === medicineId 
                      ? { ...item, quantity: item.quantity + quantity } 
                      : item
                  )
                : [...order.items, { medicineId, medicineName, quantity }],
            }
          : order
      ),
    })),
  updateOrderItemQuantity: (orderId, medicineId, newQuantity) =>
    set((state) => {
      let orderIsEmpty = false;
      const updatedOrders = state.orders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items
            .map((item) =>
              item.medicineId === medicineId
                ? { ...item, quantity: newQuantity }
                : item
            )
            .filter((item) => item.quantity > 0); 
          if (updatedItems.length === 0) {
            orderIsEmpty = true; 
          }
          return { ...order, items: updatedItems };
        }
        return order;
      });
      if (orderIsEmpty) {
        return { orders: updatedOrders.filter(order => !(order.id === orderId && order.items.length === 0)) };
      }
      return { orders: updatedOrders };
    }),
  removeOrderItem: (orderId, medicineId) => set((state) => {
    let orderIsEmpty = false;
    let targetOrderIdForEmptyCheck = '';

    const updatedOrdersAfterItemRemoval = state.orders.map(order => {
      if (order.id === orderId) {
        targetOrderIdForEmptyCheck = order.id;
        const updatedItems = order.items.filter(item => item.medicineId !== medicineId);
        if (updatedItems.length === 0) {
          orderIsEmpty = true;
        }
        return { ...order, items: updatedItems };
      }
      return order;
    });

    if (orderIsEmpty) {
      // If the order became empty, filter it out from the list
      return { orders: updatedOrdersAfterItemRemoval.filter(order => !(order.id === targetOrderIdForEmptyCheck && order.items.length === 0)) };
    } else {
      // Otherwise, just return the orders with the item removed
      return { orders: updatedOrdersAfterItemRemoval };
    }
  }),
  deleteOrder: (orderIdToDelete) =>
    set((state) => ({
      orders: state.orders.filter(order => order.id !== orderIdToDelete),
    })),
  // New action to cancel an order
  cancelOrder: (orderId) => set((state) => {
    const orderIndex = state.orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      console.warn(`Order with ID ${orderId} not found for cancellation.`);
      return { orders: state.orders }; // No change
    }

    const orderToCancel = state.orders[orderIndex];
    if (orderToCancel.status === "Pending") {
      const updatedOrder = { ...orderToCancel, status: "Cancelled" };
      const updatedOrders = [...state.orders];
      updatedOrders[orderIndex] = updatedOrder;
      return { orders: updatedOrders };
    } else {
      console.warn(`Order with ID ${orderId} cannot be cancelled. Status is ${orderToCancel.status}.`);
      // Optionally, throw an error or return a specific value to indicate failure
      return { orders: state.orders }; // No change if not pending
    }
  })
}));

export default useOrderStore; 