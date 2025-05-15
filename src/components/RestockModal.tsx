"use client";

import { useState, useEffect } from 'react';

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicineName: string;
  medicineId: string;
  onConfirmRestock: (medicineId: string, quantityToAdd: number) => void;
}

const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  onClose,
  medicineName,
  medicineId,
  onConfirmRestock,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1); // Reset quantity when modal opens
    }
  }, [isOpen]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setQuantity(val > 0 ? val : 1); // Ensure quantity is at least 1
  };

  const handleSubmit = () => {
    if (quantity <= 0) {
      // Optionally, add a toast notification for invalid quantity
      alert("Please enter a valid quantity greater than 0.");
      return;
    }
    onConfirmRestock(medicineId, quantity);
  };

  if (!isOpen) return null;

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
          <h2 className="text-2xl font-semibold text-gray-800">Restock: {medicineName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>

        <div className="mb-5">
          <label htmlFor="restock-quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
            Quantity to Add:
          </label>
          <input
            type="number"
            id="restock-quantity"
            value={quantity.toString()}
            onChange={handleQuantityChange}
            min="1"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            autoFocus
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
            disabled={quantity <= 0}
          >
            Confirm Restock
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestockModal; 