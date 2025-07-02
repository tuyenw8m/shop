import React, { createContext, useContext, useState, useCallback } from 'react';

interface OrderContextType {
  refreshOrders: () => void;
  triggerRefresh: () => void;
  refreshTrigger: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const refreshOrders = useCallback(() => {
    triggerRefresh();
  }, [triggerRefresh]);

  // Expose refreshTrigger for components that need to listen to changes
  const contextValue = {
    refreshOrders,
    triggerRefresh,
    refreshTrigger
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
}; 