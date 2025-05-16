"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { Medicine } from '../types';
import MedicineCard from './MedicineCard';

interface MedicineViewProps {
  allMedicines: Medicine[];
  onOpenAddToOrderModal: (medicineId: string, medicineName: string, medicineStock: string | number) => void;
  onOpenRestockModal: (medicineId: string, medicineName: string) => void;
  onTrashMedicine: (medicineId: string, medicineName: string) => void;
  onRestoreMedicine: (medicineId: string, medicineName: string) => void;
  onPermanentlyDeleteMedicine: (medicineId: string, medicineName: string) => void;
}

type MedicineFilterTabs = 'available' | 'outOfStock' | 'trash';

const MedicineView: React.FC<MedicineViewProps> = ({ 
  allMedicines, 
  onOpenAddToOrderModal, 
  onOpenRestockModal,
  onTrashMedicine, 
  onRestoreMedicine,
  onPermanentlyDeleteMedicine
}) => {
  
  const [activeFilter, setActiveFilter] = useState<MedicineFilterTabs>('available');
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredMedicines = useMemo(() => {
    let medicinesToDisplay = allMedicines;

    switch (activeFilter) {
      case 'available':
        medicinesToDisplay = medicinesToDisplay.filter(med => med.status === 'active' && (typeof med.stock === 'number' && med.stock > 0));
        break;
      case 'outOfStock':
        medicinesToDisplay = medicinesToDisplay.filter(med => med.status === 'active' && (med.stock === 0 || med.stock === 'Out of Stock'));
        break;
      case 'trash':
        medicinesToDisplay = medicinesToDisplay.filter(med => med.status === 'trashed');
        break;
    }

    if (searchTerm.trim() !== "") {
      medicinesToDisplay = medicinesToDisplay.filter(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return medicinesToDisplay;
  }, [allMedicines, activeFilter, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const newSuggestions = allMedicines.filter(med => 
        med.name.toLowerCase().includes(lowerSearchTerm)
      ).slice(0, 5);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allMedicines]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const handleSuggestionClick = (medicine: Medicine) => {
    setSearchTerm(medicine.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    // Suggestions will automatically hide via the useEffect for searchTerm
  };

  const tabButtonClasses = (tabName: MedicineFilterTabs) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
      activeFilter === tabName 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'bg-white text-gray-600 hover:bg-gray-100'
    }`;

  const getCountForFilter = (filter: MedicineFilterTabs) => {
    switch (filter) {
      case 'available':
        return allMedicines.filter(med => med.status === 'active' && (typeof med.stock === 'number' && med.stock > 0)).length;
      case 'outOfStock':
        return allMedicines.filter(med => med.status === 'active' && (med.stock === 0 || med.stock === 'Out of Stock')).length;
      case 'trash':
        return allMedicines.filter(med => med.status === 'trashed').length;
      default:
        return 0;
    }
  };

  return (
    <main className="flex-grow p-8 overflow-y-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Pharmacy Dashboard</h1>
      
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-4 text-gray-700">Medicines</h2> 
        <div className="mb-4 relative" ref={searchContainerRef}>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search medicines by name..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onFocus={() => searchTerm.trim() && suggestions.length > 0 && setShowSuggestions(true)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150 ease-in-out pr-10 text-gray-800"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map(suggestion => (
                <li 
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer text-sm text-gray-700"
                >
                  {suggestion.name} 
                  <span className="text-xs text-gray-400 ml-2"> (Stock: {typeof suggestion.stock === 'number' ? suggestion.stock : suggestion.stock}, Status: {suggestion.status})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex space-x-3 border-b border-gray-200 pb-3 mb-6">
          <button 
            onClick={() => setActiveFilter('available')} 
            className={tabButtonClasses('available')}
          >
            Available ({getCountForFilter('available')})
          </button>
          <button 
            onClick={() => setActiveFilter('outOfStock')} 
            className={tabButtonClasses('outOfStock')}
          >
            Out of Stock ({getCountForFilter('outOfStock')})
          </button>
          <button 
            onClick={() => setActiveFilter('trash')} 
            className={tabButtonClasses('trash')}
          >
            Trash ({getCountForFilter('trash')})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredMedicines.map((med) => (
          <MedicineCard 
            key={med.id} 
            medicine={med}
            onOpenAddToOrderModal={onOpenAddToOrderModal} 
            onOpenRestockModal={onOpenRestockModal} 
            onTrashMedicine={onTrashMedicine} 
            onRestoreMedicine={onRestoreMedicine}
            onPermanentlyDeleteMedicine={onPermanentlyDeleteMedicine}
            currentFilterTab={activeFilter}
          />
        ))}
        {filteredMedicines.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-10">
            {searchTerm ? `No medicines found for "${searchTerm}".` : "No medicines found for this filter."}
          </p>
        )}
      </div>
    </main>
  );
};

export default MedicineView; 