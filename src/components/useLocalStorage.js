
import { useState,} from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = window.localStorage.getItem(key);
        console.log(`Načítavam ${key}:`, item);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.error(`Chyba pri načítaní ${key}:`, error);
        return initialValue;
      }
    });
  
    const setValue = value => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        console.log(`Ukladám ${key}:`, valueToStore);
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Chyba pri ukladaní ${key}:`, error);
      }
    };
  
    return [storedValue, setValue];
  }

export default useLocalStorage;
