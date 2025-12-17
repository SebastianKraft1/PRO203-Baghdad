import { ThemeContext } from '@/providers/themectx';
import { useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const systemScheme = useRNColorScheme();
  const themeCtx = useContext(ThemeContext);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return "light"
  }

  if (themeCtx?.theme) {
    return themeCtx.theme;
  }

  return systemScheme ?? 'light';
}
