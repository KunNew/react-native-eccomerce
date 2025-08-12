import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Returns the app theme from zustand if explicitly set, otherwise falls back to system scheme
export function useColorScheme() {
  const storeTheme = useStore((s) => s.theme);
  const systemScheme = useRNColorScheme();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Prefer persisted/app state when available; otherwise use system
  const effective = storeTheme ?? systemScheme ?? 'light';
  return hydrated ? effective : 'light';
}
