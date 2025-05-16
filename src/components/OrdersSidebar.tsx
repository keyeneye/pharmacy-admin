"use client";

import { useState, useMemo } from 'react';
import OrderCard from './OrderCard';
import { ORDER_STATUSES } from '../types';
import type { OrdersSidebarProps, OrderStatus, FilterTab } from '../types';
import { statusSortOrder } from '../constants/orderConstants';

const OrdersSidebar: React.FC<OrdersSidebarProps> = ({ orders }) => {
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('All');
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>("");

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const statusAIndex = statusSortOrder.indexOf(a.status as OrderStatus);
      const statusBIndex = statusSortOrder.indexOf(b.status as OrderStatus);
      return (statusAIndex === -1 ? 999 : statusAIndex) - (statusBIndex === -1 ? 999 : statusBIndex);
    });
  }, [orders]);

  const filteredAndSortedOrders = useMemo(() => {
    let processedOrders = sortedOrders;

    // Apply status tab filter
    if (activeFilterTab !== 'All') {
      processedOrders = processedOrders.filter(order => order.status === activeFilterTab);
    }

    // Apply order ID search term filter
    if (orderSearchTerm.trim() !== "") {
      processedOrders = processedOrders.filter(order => 
        order.id.toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
    }

    return processedOrders;
  }, [sortedOrders, activeFilterTab, orderSearchTerm]);

  const handleOrderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderSearchTerm(e.target.value);
  };

  const clearOrderSearch = () => {
    setOrderSearchTerm("");
  };

  const tabButtonClasses = (tabName: FilterTab) => 
    `px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 ${
      activeFilterTab === tabName 
        ? 'bg-indigo-600 text-white shadow' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  
  const getCountForStatus = (status: FilterTab) => {
    if (status === 'All') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  return (
    <aside className="w-96 bg-white shadow-lg p-6 overflow-y-auto flex-shrink-0">
      <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b pb-3">Current Orders</h2>
      
      {/* Order ID Search Input */}
      <div className="mb-4 relative">
        <input 
          type="text"
          placeholder="Search by Order ID..."
          value={orderSearchTerm}
          onChange={handleOrderSearchChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10 text-gray-800"
        />
        {orderSearchTerm && (
          <button 
            onClick={clearOrderSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear order search"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button 
          onClick={() => setActiveFilterTab('All')} 
          className={tabButtonClasses('All')}
        >
          All ({getCountForStatus('All')})
        </button>
        {ORDER_STATUSES.map(status => (
          <button 
            key={status} 
            onClick={() => setActiveFilterTab(status)} 
            className={tabButtonClasses(status)}
          >
            {status} ({getCountForStatus(status)})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAndSortedOrders.length > 0 ? (
          filteredAndSortedOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic text-center py-4">
            {orderSearchTerm 
              ? `No orders found for ID "${orderSearchTerm}".` 
              : (activeFilterTab === 'All' ? 'No orders yet.' : `No ${activeFilterTab.toLowerCase()} orders.`)}
          </p>
        )}
      </div>
    </aside>
  );
};

export default OrdersSidebar; 