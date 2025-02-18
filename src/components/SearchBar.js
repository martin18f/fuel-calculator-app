// src/components/SearchBar.js
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ onLocationSelect, placeholder, defaultValue }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(defaultValue || '');
  const inputRef = useRef(null);

  // Aktualizuj v prípade, že zmeníme defaultValue (napr. po resetAll)
  useEffect(() => {
    setQuery(defaultValue || '');
  }, [defaultValue]);

  useEffect(() => {
    let intervalId;
    let listener;

    const initAutocomplete = () => {
      if (
        !window.google ||
        !window.google.maps ||
        !window.google.maps.places ||
        !inputRef.current
      ) {
        return false;
      }

      // Vytvoríme Autocomplete
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)']
      });
      autocomplete.setFields(['formatted_address', 'geometry', 'name']);

      // Listener
      listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const locationData = {
            address: place.formatted_address || place.name,
            position: { lat, lng }
          };
          setQuery(locationData.address);
          onLocationSelect?.(locationData);
        } else {
          onLocationSelect?.({ address: place.formatted_address || place.name });
        }
      });
      return true;
    };

    // Skús init hneď
    if (!initAutocomplete()) {
      // Ak to nevyšlo, opakuj
      intervalId = setInterval(() => {
        if (initAutocomplete()) {
          clearInterval(intervalId);
        }
      }, 200);
    }

    // Cleanup
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (listener && window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [onLocationSelect]);

  // Keď user píše do inputu ručne (nevyberie z Autocomplete)
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // Môžeš dať onLocationSelect, ale zmysel to má až po Autocomplete
  };

  return (
    <div style={{ margin: '0.5rem 0' }}>
      <input
        ref={inputRef}
        className="searchInput"
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder || t('enter_location')}
      />
    </div>
  );
};

export default SearchBar;
