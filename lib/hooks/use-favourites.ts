'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'masters-sweep-favourites';

export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavourites(JSON.parse(stored));
      }
    } catch {
      // localStorage not available or corrupted
    }
    setLoaded(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // localStorage full or not available
    }
  }, [favourites, loaded]);

  const toggleFavourite = useCallback((entrantId: string) => {
    setFavourites((prev) =>
      prev.includes(entrantId)
        ? prev.filter((id) => id !== entrantId)
        : [...prev, entrantId]
    );
  }, []);

  const isFavourite = useCallback(
    (entrantId: string) => favourites.includes(entrantId),
    [favourites]
  );

  return { favourites, toggleFavourite, isFavourite, loaded };
}
