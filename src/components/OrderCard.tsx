"use client";

import { Order } from '../types';
import { useAppOrders } from '../hooks/useAppOrders';
import { useAppMedicines } from '../hooks/useAppMedicines';
import { toastService } from '../lib/toastService';
import { useState, useEffect } from 'react';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { updateOrderItemQuantity, removeOrderItem, cancelOrder } = useAppOrders();
  const { incrementMedicineStock } = useAppMedicines();
  
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(() =>
    order.items.reduce((acc, item) => {
      acc[item.medicineId] = item.quantity;
      return acc;
    }, {} as Record<string, number>)
  );

  useEffect(() => {
    setItemQuantities(
      order.items.reduce((acc, item) => {
        acc[item.medicineId] = item.quantity;
        return acc;
      }, {} as Record<string, number>)
    );
  }, [order.items]);

  const handleItemQuantityChange = (medicineId: string, newQuantityString: string) => {
    const currentItem = order.items.find(item => item.medicineId === medicineId);
    if (!currentItem) return;

    const originalQuantity = currentItem.quantity;
    const newQuantity = parseInt(newQuantityString, 10);

    if (isNaN(newQuantity) || newQuantity < 0) {
      toastService.error("Please enter a valid quantity (0 or more).");
      setItemQuantities(prev => ({ ...prev, [medicineId]: originalQuantity })); 
      return;
    }

    setItemQuantities(prev => ({ ...prev, [medicineId]: newQuantity }));

    if (newQuantity === originalQuantity) return;

    if (newQuantity === 0) {
      removeOrderItem(order.id, medicineId);
      incrementMedicineStock(medicineId, originalQuantity);
      toastService.warning(`Item ${currentItem.medicineName} removed. Stock restored by ${originalQuantity}.`);
    } else {
      updateOrderItemQuantity(order.id, medicineId, newQuantity);
      const quantityDifference = originalQuantity - newQuantity;
      if (quantityDifference > 0) {
        incrementMedicineStock(medicineId, quantityDifference);
        toastService.success(`Quantity of ${currentItem.medicineName} updated to ${newQuantity}. Stock restored by ${quantityDifference}.`);
      } else {
        toastService.success(`Quantity of ${currentItem.medicineName} updated to ${newQuantity}.`);
      }
    }
  };

  const handleRemoveItem = (medicineId: string, medicineName: string) => {
    const itemToRemove = order.items.find(item => item.medicineId === medicineId);
    if (itemToRemove) {
      removeOrderItem(order.id, medicineId);
      incrementMedicineStock(medicineId, itemToRemove.quantity);
      toastService.success(`Removed ${medicineName} (Qty: ${itemToRemove.quantity}). Stock restored.`);
    } else {
      removeOrderItem(order.id, medicineId);
      toastService.success(`Removed ${medicineName}.`);
    }
  };

  const handleCancelOrder = () => {
    if (order.status === "Pending") {
      const itemsToRestock = [...order.items];
      cancelOrder(order.id);
      itemsToRestock.forEach(item => {
        incrementMedicineStock(item.medicineId, item.quantity);
      });
      toastService.success(`Order ${order.id} cancelled. All items (total ${itemsToRestock.length}) restocked.`);
    } else {
      toastService.error(`Order ${order.id} cannot be cancelled. Status is ${order.status}.`);
    }
  };

  const getStatusColor = (status: string): string => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-800";
    if (status === "Processing") return "bg-blue-100 text-blue-800";
    if (status === "Shipped") return "bg-green-100 text-green-800";
    if (status === "Delivered") return "bg-purple-100 text-purple-800";
    if (status === "Cancelled") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-indigo-700">Order ID: {order.id}</h3>
          <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        {order.status === "Pending" && (
          <button
            onClick={handleCancelOrder}
            className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-colors"
            aria-label="Cancel Order"
          >
            Cancel Order
          </button>
        )}
      </div>
      
      {order.items.length > 0 ? (
        <ul className="space-y-2.5 mb-3">
          {order.items.map(item => (
            <li key={item.medicineId} className="flex justify-between items-center border-b border-gray-100 py-2 last:border-b-0">
              <div>
                <span className="font-medium text-sm text-gray-700">{item.medicineName}</span>
                <span className="text-xs text-gray-500 block">ID: {item.medicineId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="number"
                  value={itemQuantities[item.medicineId] !== undefined ? itemQuantities[item.medicineId] : item.quantity}
                  onChange={(e) => handleItemQuantityChange(item.medicineId, e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
                  min="0"
                />
                <button 
                  onClick={() => handleRemoveItem(item.medicineId, item.medicineName)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${item.medicineName}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 italic">No items in this order.</p>
      )}
    </div>
  );
};

export default OrderCard; 