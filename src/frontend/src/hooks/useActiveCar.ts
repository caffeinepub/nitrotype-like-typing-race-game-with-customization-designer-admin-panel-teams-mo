import { useState, useEffect } from 'react';

const ACTIVE_CAR_KEY = 'activeCar';

export function useActiveCar() {
  const [activeCarId, setActiveCarIdState] = useState<bigint | null>(() => {
    try {
      const stored = localStorage.getItem(ACTIVE_CAR_KEY);
      return stored ? BigInt(stored) : null;
    } catch {
      return null;
    }
  });

  const setActiveCar = (carId: bigint | null) => {
    try {
      if (carId === null) {
        localStorage.removeItem(ACTIVE_CAR_KEY);
      } else {
        localStorage.setItem(ACTIVE_CAR_KEY, carId.toString());
      }
      setActiveCarIdState(carId);
    } catch (error) {
      console.error('Failed to save active car:', error);
    }
  };

  return {
    activeCarId,
    setActiveCar,
  };
}
