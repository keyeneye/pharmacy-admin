"use client";

import { useState, useEffect } from 'react';
import { Order } from '../types'; // Import Order type

interface AddToOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineName: string;
  medicineId: string;
  medicineStock: number | string; // Added medicineStock prop
  orders: Order[]; // Use imported Order type
  onAddToExistingOrder: (orderId: string, medicineId: string, medicineName: string, quantity: number) => void;
  onAddNewOrder: (medicineId: string, medicineName: string, quantity: number) => void;
}

const AddToOrderModal: React.FC<AddToOrderModalProps> = ({
  isOpen,
  onClose,
  medicineName,
  medicineId,
  medicineStock, // Destructure medicineStock
  orders,
  onAddToExistingOrder,
  onAddNewOrder,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1); // State for quantity

  const numericStock = typeof medicineStock === 'number' ? medicineStock : 0;
  const isOutOfStock = numericStock <= 0;

  useEffect(() => {
    // Reset state when modal opens or medicine changes
    setSelectedOrderId(''); // Clear selected order
    // Set initial quantity: 1 if stock available, 0 if out of stock
    setQuantity(isOutOfStock ? 0 : 1);
  }, [isOpen, medicineId, isOutOfStock]); // Depend on isOutOfStock to react to stock changes

  if (!isOpen) {
    return null;
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newQuantity = parseInt(e.target.value, 10);

    if (isNaN(newQuantity) || newQuantity < 0) {
      newQuantity = 0; // Default to 0 for invalid or negative input
    }

    if (!isOutOfStock && newQuantity > numericStock) {
      newQuantity = numericStock; // Cap at available stock
    } else if (isOutOfStock) {
      newQuantity = 0; // Force 0 if out of stock
    }
    
    setQuantity(newQuantity);
  };

  const handleAddToSelectedOrder = () => {
    if (!selectedOrderId || quantity <= 0 || isOutOfStock) return;
    onAddToExistingOrder(selectedOrderId, medicineId, medicineName, quantity);
    // onClose(); // Typically handled by the parent component after successful action
  };

  const handleCreateNewOrder = () => {
    if (quantity <= 0 || isOutOfStock) return;
    onAddNewOrder(medicineId, medicineName, quantity);
    // onClose(); // Typically handled by the parent component after successful action
  };

  const pendingOrders = orders.filter(order => order.status === "Pending");

  const canPerformAction = quantity > 0 && !isOutOfStock;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalFadeInScaleUp">
        <style jsx>{`
          @keyframes modalFadeInScaleUp {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-modalFadeInScaleUp {
            animation: modalFadeInScaleUp 0.3s ease-out forwards;
          }
        `}</style>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add "{medicineName}"</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>

        <div className="mb-5">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantity (Available: <span className={isOutOfStock ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>{isOutOfStock ? 'Out of Stock' : numericStock}</span>)
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity.toString()} // Controlled component: value should be string for input type number in some cases or handle 0 better
            onChange={handleQuantityChange}
            min="0"
            max={isOutOfStock ? 0 : numericStock} // Dynamic max
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors"
            disabled={isOutOfStock} // Disable if out of stock
          />
          {numericStock > 0 && quantity > numericStock && (
            <p className="text-xs text-red-600 mt-1.5">Maximum available quantity is {numericStock}. Adjusted automatically.</p>
          )}
           {isOutOfStock && (
            <p className="text-xs text-red-600 mt-1.5">This item is out of stock and cannot be added.</p>
           )}
        </div>

        {pendingOrders.length > 0 && (
          <div className="mb-5">
            <label htmlFor="orderSelect" className="block text-sm font-medium text-gray-700 mb-1.5">
              Add to Existing Pending Order:
            </label>
            <select
              id="orderSelect"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 transition-colors"
              disabled={!canPerformAction} // Disable if cannot perform action
            >
              <option value="">Select an order...</option>
              {pendingOrders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order ID: {order.id} ({order.items.length} item{order.items.length === 1 ? '' : 's'})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddToSelectedOrder}
              disabled={!selectedOrderId || !canPerformAction}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Selected Order
            </button>
          </div>
        )}
        {pendingOrders.length === 0 && !isOutOfStock && (
             <p className="text-sm text-gray-500 my-4 text-center">No pending orders available. You can create a new one.</p>
        )}

        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-2 text-center">Or:</p>
          <button
            onClick={handleCreateNewOrder}
            disabled={!canPerformAction} // Disable if cannot perform action
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create New Order & Add Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToOrderModal; 