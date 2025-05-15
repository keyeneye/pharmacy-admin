"use client"

import { Medicine } from '../types'; // Medicine type now includes status

interface MedicineCardProps {
  medicine: Medicine; // Pass the whole medicine object
  onOpenAddToOrderModal: (medicineId: string, medicineName: string, medicineStock: string | number) => void;
  onOpenRestockModal: (medicineId: string, medicineName: string) => void;
  onTrashMedicine: (medicineId: string, medicineName: string) => void;
  onRestoreMedicine: (medicineId: string, medicineName: string) => void;
  onPermanentlyDeleteMedicine: (medicineId: string, medicineName: string) => void;
  currentFilterTab: 'available' | 'outOfStock' | 'trash'; // To know which view we are in
}

const MedicineCard: React.FC<MedicineCardProps> = ({ 
  medicine,
  onOpenAddToOrderModal, 
  onOpenRestockModal, 
  onTrashMedicine,
  onRestoreMedicine,
  onPermanentlyDeleteMedicine,
  currentFilterTab
}) => {
  const { id, name, stock, status } = medicine;
  const isOutOfStock = stock === 'Out of Stock' || stock === 0;

  return (
    <div className={`bg-white shadow-md rounded-lg p-4 border border-gray-200 flex flex-col justify-between ${status === 'trashed' ? 'opacity-70 bg-gray-100' : ''}`}>
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{name}</h3>
        <p className="text-xs text-gray-500 mb-1">ID: {id}</p>
        {status === 'active' && (
          <p className="text-sm text-gray-700 mb-3">
            Stock: <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : stock}
            </span>
          </p>
        )}
        {status === 'trashed' && (
          <p className="text-sm text-red-700 font-semibold mb-3">Status: In Trash</p>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {/* Buttons for Active Medicines (Available or Out of Stock tabs) */} 
        {status === 'active' && currentFilterTab !== 'trash' && (
          <>
            <button
              onClick={() => isOutOfStock ? onOpenRestockModal(id, name) : onOpenAddToOrderModal(id, name, stock)}
              className={`w-full text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 
                          ${isOutOfStock 
                            ? 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400' 
                            : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'}`}
              // Disable Add to Order if out of stock, Restock is always enabled for out of stock items here
              disabled={!isOutOfStock && (stock === 'Out of Stock' || stock === 0)} >
              {isOutOfStock ? 'Restock' : 'Add to Order'}
            </button>
            {isOutOfStock && (
              <button
                onClick={() => onTrashMedicine(id, name)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Move to Trash
              </button>
            )}
          </>
        )}

        {/* Buttons for Trashed Medicines (Trash tab) */} 
        {status === 'trashed' && currentFilterTab === 'trash' && (
          <>
            <button
              onClick={() => onRestoreMedicine(id, name)}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            >
              Restore from Trash
            </button>
            <button
              onClick={() => onPermanentlyDeleteMedicine(id, name)}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            >
              Delete Permanently
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicineCard; 