"use client";

import { Order, OrderItem } from '../types';
import { useAppOrders } from '../hooks/useAppOrders';
import { useAppMedicines } from '../hooks/useAppMedicines';
import { toastService } from '../lib/toastService';
import { useState } from 'react';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { updateOrderItemQuantity, removeOrderItem, deleteOrder } = useAppOrders();
  const { incrementMedicineStock } = useAppMedicines();
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(() =>
    order.items.reduce((acc, item) => {
      acc[item.medicineId] = item.quantity;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleLocalQuantityChange = (medicineId: string, newQuantityStr: string) => {
    const newQuantity = parseInt(newQuantityStr, 10);
    setItemQuantities(prev => ({ ...prev, [medicineId]: isNaN(newQuantity) || newQuantity < 0 ? 0 : newQuantity }));
  };

  const handleUpdateQuantity = (item: OrderItem) => {
    const originalQuantity = item.quantity;
    const newQuantity = itemQuantities[item.medicineId];

    if (isNaN(newQuantity) || newQuantity < 0) {
      toastService.error("Invalid quantity.");
      setItemQuantities(prev => ({ ...prev, [item.medicineId]: originalQuantity }));
      return;
    }

    if (newQuantity === originalQuantity) return;

    updateOrderItemQuantity(order.id, item.medicineId, newQuantity);

    const quantityDifference = originalQuantity - newQuantity;

    if (quantityDifference > 0) {
      incrementMedicineStock(item.medicineId, quantityDifference);
      toastService.success(`Stock for ${item.medicineName} increased by ${quantityDifference}.`);
    } else if (quantityDifference < 0) {
      toastService.info(`Quantity for ${item.medicineName} updated in order.`);
    }
    
    if (newQuantity <= 0) {
        toastService.info(`${item.medicineName} removed from order as quantity set to 0.`);
    } else {
        toastService.success(`Quantity for ${item.medicineName} updated to ${newQuantity}.`);
    }
  };

  const handleRemoveItem = (item: OrderItem) => {
    const quantityToRestore = item.quantity;
    removeOrderItem(order.id, item.medicineId);
    incrementMedicineStock(item.medicineId, quantityToRestore);
    toastService.success(`${item.medicineName} (Qty: ${quantityToRestore}) removed from order and stock restored.`);
    setItemQuantities(prev => {
        const newState = {...prev};
        delete newState[item.medicineId];
        return newState;
    });
  };

  const handleDeleteOrder = () => {
    if (order.status !== 'Pending') {
      toastService.error("Only pending orders can be deleted.");
      return;
    }
    order.items.forEach(item => {
      incrementMedicineStock(item.medicineId, item.quantity);
    });
    deleteOrder(order.id);
    toastService.success(`Order #${order.id} has been deleted and stock restored.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-400 text-yellow-800';
      case 'Processing': return 'bg-blue-400 text-blue-800';
      case 'Shipped': return 'bg-green-400 text-green-800';
      case 'Delivered': return 'bg-purple-400 text-purple-800';
      case 'Cancelled': return 'bg-red-400 text-red-800';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-semibold text-gray-700">Order ID: {order.id}</h4>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      {order.status === 'Pending' && (
        <button
          onClick={handleDeleteOrder}
          className="mb-3 w-full px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
        >
          Delete Entire Order
        </button>
      )}
      <ul className="space-y-3">
        {order.items.map(item => (
          <li key={item.medicineId} className="p-3 bg-gray-50 rounded-md border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.medicineName}</p>
                <p className="text-xs text-gray-500">ID: {item.medicineId}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  value={itemQuantities[item.medicineId] !== undefined ? itemQuantities[item.medicineId] : item.quantity}
                  onChange={(e) => handleLocalQuantityChange(item.medicineId, e.target.value)}
                  onBlur={() => handleUpdateQuantity(item)}
                  min="0" 
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button 
                  onClick={() => handleRemoveItem(item)} 
                  className="px-2.5 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  Remove Item
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {order.items.length === 0 && (
        <p className="text-sm text-gray-500 italic text-center py-2">This order is empty. It will be automatically removed.</p>
      )}
    </div>
  );
};

export default OrderCard; 