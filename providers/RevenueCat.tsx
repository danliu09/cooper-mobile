/**
 * Passthrough provider — RevenueCat has been removed.
 * Kept so existing layout imports don't break.
 */
import { createContext, useContext } from 'react';

interface RevenueCatProps {
  user: { dalle: boolean };
}

const RevenueCatContext = createContext<RevenueCatProps>({ user: { dalle: true } });

export const useRevenueCat = () => useContext(RevenueCatContext);

export const RevenueCatProvider = ({ children }: any) => {
  return (
    <RevenueCatContext.Provider value={{ user: { dalle: true } }}>
      {children}
    </RevenueCatContext.Provider>
  );
};
