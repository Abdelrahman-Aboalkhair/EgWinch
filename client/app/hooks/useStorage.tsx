import { useState, useEffect } from "react";

type StorageType = "local" | "session";

function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = "local"
) {
  const storage = storageType === "local" ? localStorage : sessionStorage;

  const getStoredValue = (): T => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading storage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting storage key "${key}":`, error);
    }
  }, [key, storedValue, storage]);

  return [storedValue, setStoredValue] as const;
}

export default useStorage;
