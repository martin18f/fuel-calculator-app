// src/components/FuelUnitSwitcher.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Switchers.css'; // Použijeme ten istý CSS súbor

const FuelUnitSwitcher = ({ fuelUnit, setFuelUnit }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(fuelUnit === 'imperial');

  useEffect(() => {
    setChecked(fuelUnit === 'imperial');
  }, [fuelUnit]);

  const handleToggle = (e) => {
    const newValue = e.target.checked;
    setChecked(newValue);
    setFuelUnit(newValue ? 'imperial' : 'metric');
  };

  return (
    <div className="switcher">
      <span className="left-label">{t('fuelUnitMetric')}</span>
      <input 
        type="checkbox" 
        className="checkbox" 
        id="fuel-switch" 
        checked={checked} 
        onChange={handleToggle} 
      />
      <label className="slider" htmlFor="fuel-switch"></label>
      <span className="right-label">{t('fuelUnitImperial')}</span>
    </div>
  );
};

export default FuelUnitSwitcher;
