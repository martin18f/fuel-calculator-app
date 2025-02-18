import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import useLocalStorage from './components/useLocalStorage.js';

const CarSelector = ({ onConsumptionChange }) => {
  const { t } = useTranslation(); // Prekladový hook

  // Stav pre zlúčené CSV dáta
  const [data, setData] = useState([]);

  // Stavy pre výber v jednotlivých dropdownoch (uložené do localStorage)
  const [selectedYear, setSelectedYear] = useLocalStorage('csYear', '');
  const [selectedBrand, setSelectedBrand] = useLocalStorage('csBrand', '');
  const [selectedModel, setSelectedModel] = useLocalStorage('csModel', '');
  const [selectedEngine, setSelectedEngine] = useLocalStorage('csEngine', '');

  // 1) Načítanie a zlúčenie CSV dát z dvoch súborov
  useEffect(() => {
    const loadCSV = async (url) => {
      const response = await fetch(url);
      const csvText = await response.text();
      return Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        trim: true,
        transform: (value, field) => {
          let cleaned = value ? value.trim().replace(/^"+|"+$/g, '') : value;
          if (field === 'Rok' && cleaned.indexOf(',') !== -1) {
            cleaned = cleaned.split(',')[0];
          }
          return cleaned;
        },
      }).data;
    };

    Promise.all([loadCSV('/cars2024.csv'), loadCSV('/cars2025.csv')])
      .then(([data2024, data2025]) => {
        const mergedData = [...data2024, ...data2025];
        setData(mergedData);
      })
      .catch((error) => {
        console.error('Chyba pri načítaní CSV dát:', error);
      });
  }, []);

  // 2) Vytvorenie unikátnych možností pre dropdown
  const availableYears = Array.from(new Set(data.map((item) => item.Rok)));
  const availableBrands = selectedYear
    ? Array.from(new Set(data.filter((item) => item.Rok === selectedYear).map((item) => item.Značka)))
    : [];
  const availableModels =
    selectedYear && selectedBrand
      ? Array.from(
          new Set(
            data
              .filter((item) => item.Rok === selectedYear && item.Značka === selectedBrand)
              .map((item) => item.Model)
          )
        )
      : [];
  const availableEngines =
    selectedYear && selectedBrand && selectedModel
      ? Array.from(
          new Set(
            data
              .filter(
                (item) =>
                  item.Rok === selectedYear &&
                  item.Značka === selectedBrand &&
                  item.Model === selectedModel
              )
              .map((item) => item.Motorizácia)
          )
        )
      : [];

  // 3) Automatické vyplnenie spotreby po výbere všetkých hodnôt
  useEffect(() => {
    if (selectedYear && selectedBrand && selectedModel && selectedEngine) {
      const record = data.find(
        (item) =>
          item.Rok === selectedYear &&
          item.Značka === selectedBrand &&
          item.Model === selectedModel &&
          item.Motorizácia === selectedEngine
      );
      if (record) {
        // Ak existuje validný záznam, pošli spotrebu do parent
        if (onConsumptionChange) {
          onConsumptionChange(record.Spotreba);
        }
      } else {
        // Ak nenašlo záznam, pošli prázdnu spotrebu
        if (onConsumptionChange) {
          onConsumptionChange('');
        }
      }
    } else {
      // Ak nie je vyplnený Year, Brand, Model, Engine
      if (onConsumptionChange) {
        onConsumptionChange('');
      }
    }
  }, [selectedYear, selectedBrand, selectedModel, selectedEngine, data, onConsumptionChange]);

  return (
    <div className="car-selector">
      <h2>{t('selectCar') || 'Vyberte auto'}</h2>

      {/* Rok */}
      <div className="dropdown-group">
        <label>{t('year') || 'Rok:'}</label>
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setSelectedBrand('');
            setSelectedModel('');
            setSelectedEngine('');
          }}
        >
          <option value="">{t('selectYear') || 'Vyberte rok'}</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Značka */}
      <div className="dropdown-group">
        <label>{t('brand') || 'Značka:'}</label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel('');
            setSelectedEngine('');
          }}
          disabled={!selectedYear}
        >
          <option value="">{t('selectBrand') || 'Vyberte značku'}</option>
          {availableBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="dropdown-group">
        <label>{t('model') || 'Model:'}</label>
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setSelectedEngine('');
          }}
          disabled={!selectedBrand}
        >
          <option value="">{t('selectModel') || 'Vyberte model'}</option>
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {/* Motorizácia */}
      <div className="dropdown-group">
        <label>{t('engine') || 'Motorizácia:'}</label>
        <select
          value={selectedEngine}
          onChange={(e) => setSelectedEngine(e.target.value)}
          disabled={!selectedModel}
        >
          <option value="">{t('selectEngine') || 'Vyberte motorizáciu'}</option>
          {availableEngines.map((engine) => (
            <option key={engine} value={engine}>
              {engine}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CarSelector;
