// src/App.js

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import PalivovaKalkulacka from './PalivovaKalkulacka'; // Samostatná podstránka
import i18n from './i18n';
import useLocalStorage from './components/useLocalStorage';
import CookieBanner from './components/CookieBanner';
import Footer from './Footer';
import ThemeToggle from './components/ThemeToggle';
import CookiePolicy from './CookiePolicy';
import TermsOfUse from './TermsOfUse';
import PrivacyPolicy from './PrivacyPolicy';

import LanguageSwitcher from './components/LanguageSwitcher';
import FuelUnitSwitcher from './components/FuelUnitSwitcher';
import SearchBar from './components/SearchBar';
import MapView from './components/MapView';
import CustomCheckbox from './components/CustomCheckbox';
import CarSelector from './CarSelector';
import CurrencySwitcher from './components/CurrencySwitcher';
import ContactForm from './components/ContactForm';
import PolicyLinks from './PolicyLinks';
import { SpeedInsights } from '@vercel/speed-insights/react';
import DeleteButton from './components/DeleteButton';

import './App.css';

// Fallback 404
function NotFound() {
  return (
    <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>
      404 – Page Not Found
    </h2>
  );
}

function App() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);

  // Detekcia jazyka podľa domény
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('.sk')) {
      i18n.changeLanguage('sk');
    } else {
      i18n.changeLanguage('en');
    }
  }, []);

  // Prepínač témy
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Uplatnenie témy na body
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // useLocalStorage stavy (spotreba, destinácia, atď.)
  const [useAutoConsumption, setUseAutoConsumption] = useState(true);

  const [selectedYear, setSelectedYear] = useLocalStorage('csYear', '');
  const [selectedBrand, setSelectedBrand] = useLocalStorage('csBrand', '');
  const [selectedModel, setSelectedModel] = useLocalStorage('csModel', '');
  const [selectedEngine, setSelectedEngine] = useLocalStorage('csEngine', '');

  const [startLocation, setStartLocation] = useLocalStorage('startLocation', null);
  const [destinationLocation, setDestinationLocation] = useLocalStorage('destinationLocation', null);
  const [avoidHighways, setAvoidHighways] = useLocalStorage('avoidHighways', false);

  const [directionsResult, setDirectionsResult] = useState(null);
  const [routeAlternatives, setRouteAlternatives] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [directions, setDirections] = useState(null);

  const [distance, setDistance] = useLocalStorage('distance', null);
  const [travelTime, setTravelTime] = useLocalStorage('travelTime', null);

  const [fuelConsumption, setFuelConsumption] = useLocalStorage('fuelConsumption', '');
  const [fuelPriceLocal, setFuelPriceLocal] = useLocalStorage('fuelPriceLocal', '');
  const [fuelUnit, setFuelUnit] = useLocalStorage('fuelUnit', 'metric');
  const [selectedCurrency, setSelectedCurrency] = useLocalStorage('selectedCurrency', 'eur');

  const [fuelPriceEur, setFuelPriceEur] = useState(null);
  const [fuelUsed, setFuelUsed] = useLocalStorage('fuelUsed', null);
  const [fuelCostEur, setFuelCostEur] = useLocalStorage('fuelCostEur', null);

  const [exchangeRates, setExchangeRates] = useState({});
  const [resetKey, setResetKey] = useState(0);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Fetch kurzov
  const fetchExchangeRates = (date = 'latest', base = 'eur', apiVersion = 'v1') => {
    const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/${apiVersion}/currencies/${base}.json`;
    const fallbackDomain = date === 'latest' ? 'latest' : date;
    const fallbackUrl = `https://${fallbackDomain}.currency-api.pages.dev/${apiVersion}/currencies/${base}.json`;

    return fetch(primaryUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Primárne API zlyhalo: ${response.status}`);
        }
        return response.json();
      })
      .catch((err) => {
        console.error('Primárne API zlyhalo, skúšam fallback:', err);
        return fetch(fallbackUrl).then((response) => {
          if (!response.ok) {
            throw new Error(`Fallback API zlyhalo: ${response.status}`);
          }
          return response.json();
        });
      });
  };

  useEffect(() => {
    fetchExchangeRates('latest', 'eur', 'v1')
      .then((data) => {
        if (data && data.eur) {
          setExchangeRates(data.eur);
        }
      })
      .catch((error) => {
        console.error('Obe volania API zlyhali:', error);
      });
  }, []);

  // Funkcie na update spotreby a ceny
  const handleFuelConsumptionChange = (value) => {
    const sanitized = value.replace(',', '.');
    setFuelConsumption(sanitized);
  };

  const handleFuelPriceChange = (value) => {
    const sanitized = value.replace(',', '.').trim();
    setFuelPriceLocal(sanitized);

    const val = parseFloat(sanitized);
    if (!isNaN(val) && exchangeRates[selectedCurrency]) {
      setFuelPriceEur(val / exchangeRates[selectedCurrency]);
    } else {
      setFuelPriceEur(null);
    }
  };

  useEffect(() => {
    if (fuelPriceEur !== null && exchangeRates[selectedCurrency]) {
      const localPriceVal = fuelPriceEur * exchangeRates[selectedCurrency];
      const localPriceRounded = parseFloat(localPriceVal.toFixed(3));
      setFuelPriceLocal(localPriceRounded.toString());
    }
    // eslint-disable-next-line
  }, [selectedCurrency, exchangeRates, fuelPriceEur]);

  // Výpočet nákladov
  const calculateFuelCostEur = useCallback(
    (dist) => {
      if (!fuelConsumption || !fuelPriceEur) {
        setFuelCostEur(null);
        setFuelUsed(null);
        return;
      }
      const distanceKm = dist / 1000;
      const consumptionVal = parseFloat(fuelConsumption.trim());
      if (isNaN(consumptionVal) || consumptionVal <= 0) {
        setFuelCostEur(null);
        setFuelUsed(null);
        return;
      }

      if (fuelUnit === 'imperial') {
        const consumptionLper100km = 235.214583 / consumptionVal;
        const consumptionLiters = (distanceKm / 100) * consumptionLper100km;
        const usedGal = consumptionLiters / 3.785411784;
        setFuelUsed(usedGal);

        const costEur = consumptionLiters * fuelPriceEur;
        setFuelCostEur(costEur);
      } else {
        const consumptionLiters = (distanceKm / 100) * consumptionVal;
        setFuelUsed(consumptionLiters);

        const costEur = consumptionLiters * fuelPriceEur;
        setFuelCostEur(costEur);
      }
    },
    [fuelConsumption, fuelPriceEur, fuelUnit]
  );

  useEffect(() => {
    if (distance !== null) {
      calculateFuelCostEur(distance);
    }
  }, [distance, fuelPriceEur, fuelConsumption, fuelUnit, calculateFuelCostEur]);

  // Directions
  const setSelectedDirections = useCallback((result, index) => {
    const selected = { ...result, routes: [result.routes[index]] };
    setDirections(selected);
  }, []);

  const calculateEverything = () => {
    if (!isGoogleLoaded || !window.google || !window.google.maps) {
      alert('Google Maps nie je načítané.');
      return;
    }
    if (!startLocation || !destinationLocation) {
      alert(t('Vyberte prosím obe miesta (Štart a Cieľ).'));
      return;
    }
    if (!fuelConsumption) {
      alert('Zadajte spotrebu paliva.');
      return;
    }
    if (!fuelPriceLocal) {
      alert('Zadajte cenu paliva.');
      return;
    }

    setLoading(true);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation.position,
        destination: destinationLocation.position,
        travelMode: window.google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        avoidHighways: avoidHighways,
      },
      (result, status) => {
        setLoading(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResult(result);
          setRouteAlternatives(result.routes);
          setSelectedRouteIndex(0);
          setSelectedDirections(result, 0);

          const dist = result.routes[0].legs[0].distance.value;
          setDistance(dist);

          const durText = result.routes[0].legs[0].duration.text;
          setTravelTime(durText);

          calculateFuelCostEur(dist);
        } else {
          console.error('Chyba pri získavaní trasy', result);
          alert(t('Nastala chyba pri výpočte trasy.'));
        }
      }
    );
  };

  const selectRouteAlternative = (index) => {
    if (directionsResult && routeAlternatives.length > index) {
      setSelectedRouteIndex(index);
      setSelectedDirections(directionsResult, index);

      const dist = directionsResult.routes[index].legs[0].distance.value;
      setDistance(dist);

      const durText = directionsResult.routes[index].legs[0].duration.text;
      setTravelTime(durText);

      calculateFuelCostEur(dist);
    }
  };

  // Prepínač auto/manual
  const renderConsumptionSwitcher = () => (
    <div className="section">
      <label style={{ fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>
        {t('consumptionModeLabel')}
      </label>
      <label style={{ marginRight: '20px' }}>
        <input
          type="radio"
          value="auto"
          checked={useAutoConsumption === true}
          onChange={() => setUseAutoConsumption(true)}
        />{' '}
        {t('autoConsumptionOption')}
      </label>
      <label>
        <input
          type="radio"
          value="manual"
          checked={useAutoConsumption === false}
          onChange={() => setUseAutoConsumption(false)}
        />{' '}
        {t('manualConsumptionOption')}
      </label>
    </div>
  );

  // Reset všetkého
  const handleDelete = () => {
    setStartLocation(null);
    setDestinationLocation(null);
    setAvoidHighways(false);
    setDirectionsResult(null);
    setRouteAlternatives([]);
    setSelectedRouteIndex(0);
    setDirections(null);
    setDistance(null);
    setTravelTime(null);
    setFuelUsed(null);
    setFuelCostEur(null);

    setFuelConsumption('');
    setFuelPriceLocal('');
    setFuelPriceEur(null);
    setFuelUsed(null);

    setFuelUnit('metric');
    setSelectedCurrency('eur');
    setResetKey((prev) => prev + 1);

    setSelectedYear('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedEngine('');
  };

  // Google Maps Navigation Link
  const getGoogleMapsNavigationUrl = () => {
    if (!startLocation || !destinationLocation) return '';
    const origin = `${startLocation.position.lat},${startLocation.position.lng}`;
    const destination = `${destinationLocation.position.lat},${destinationLocation.position.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  };

  // FuelCost => displayed
  let displayedFuelCost = null;
  if (fuelCostEur !== null && exchangeRates[selectedCurrency]) {
    displayedFuelCost = (fuelCostEur * exchangeRates[selectedCurrency]).toFixed(2);
  }

  // Markery
  const markers = [];
  if (!directions && startLocation?.position) {
    markers.push({ position: startLocation.position, label: 'A' });
  }
  if (!directions && destinationLocation?.position) {
    markers.push({ position: destinationLocation.position, label: 'B' });
  }

  return (
    <Router>
      <div className={`App ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Čo je palivová kalkulačka?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Palivová kalkulačka je nástroj pre výpočet nákladov na cestu."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Ako presný je váš fuel cost calculator?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Presnosť závisí od presnosti zadanej spotreby, cien paliva a dopravnej situácie."
                  }
                }
              ]
            })}
          </script>
          <html lang={i18n.language} />
          <title>{t('welcome')}</title>
          <meta name="description" content={t('sFuely je kalkulačka na výpočet nákladov na palivo. Zadajte trasu, cenu paliva a zistite náklady na cestu.') || 'Palivová kalkulačka'} />
          <link rel="alternate" href="https://fuely.sk/sk" hreflang="sk" />
          <link rel="alternate" href="https://fuely.sk/en" hreflang="en" />
        </Helmet>


        <CookieBanner />

        <h1 className="headingMain">{t('welcome')}</h1>

        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Switchery jazyk / fuelUnit */}
                <div className="switcher-container">
                  <LanguageSwitcher />
                  <FuelUnitSwitcher
                    fuelUnit={fuelUnit}
                    setFuelUnit={setFuelUnit}
                  />
                </div>

                {/* Tlačidlo na prepínanie témy */}
                <div className="switch-wrapper">
                  <ThemeToggle theme={theme} onToggle={toggleTheme} />
                </div>

                {/* Štart */}
                <div className="section">
                  <h2 className="headingStart">{t('start')}</h2>
                  <SearchBar
                    defaultValue={startLocation?.address || ''}
                    onLocationSelect={setStartLocation}
                    placeholder={t('enter_location')}
                  />
                </div>

                {/* Cieľ */}
                <div className="section">
                  <h2 className="headingDestination">{t('destination')}</h2>
                  <SearchBar
                    defaultValue={destinationLocation?.address || ''}
                    onLocationSelect={setDestinationLocation}
                    placeholder={t('enter_location')}
                  />
                </div>

                {/* Vyhnúť sa diaľniciam */}
                <div className="form-row">
                  <CustomCheckbox
                    checked={avoidHighways}
                    onChange={(e) => setAvoidHighways(e.target.checked)}
                  />
                </div>

                {/* Auto/manual spotreba */}
                {renderConsumptionSwitcher()}

                {/* CarSelector */}
                {useAutoConsumption && (
                  <CarSelector onConsumptionChange={setFuelConsumption} />
                )}

                {/* Spotreba, cena paliva */}
                <div className="section fuelSection">
                  <label className="labelFuelConsumption">
                    {fuelUnit === 'metric'
                      ? t('fuelConsumption')
                      : t('fuelConsumptionImperial')}
                  </label>
                  <input
                    className="inputFuelConsumption"
                    type="text"
                    value={fuelConsumption || ''}
                    onChange={(e) => handleFuelConsumptionChange(e.target.value)}
                    readOnly={useAutoConsumption}
                  />

                  <label className="labelFuelPrice">
                    {t('fuelPrice')} ({selectedCurrency.toUpperCase()}/
                    {fuelUnit === 'imperial' ? 'mpg' : 'l'}):
                  </label>
                  <input
                    className="inputFuelPrice"
                    type="text"
                    value={fuelPriceLocal}
                    onChange={(e) => handleFuelPriceChange(e.target.value)}
                  />
                </div>

                {/* Mena */}
                <div className="section">
                  <CurrencySwitcher
                    selectedCurrency={selectedCurrency}
                    setSelectedCurrency={setSelectedCurrency}
                  />
                </div>

                {/* Tlačidlá Calculate / Reset */}
                <div className="section buttonsSection">
                  <button
                    onClick={calculateEverything}
                    className="buttonCalculate"
                  >
                    {loading ? t('calculating') || 'Calculating...' : t('calculate')}
                  </button>
                  <DeleteButton onClick={handleDelete} />
                </div>

                {/* Výsledky */}
                {(distance !== null ||
                  fuelUsed !== null ||
                  fuelCostEur !== null ||
                  travelTime !== null) && (
                  <div className="section resultsSection">
                    {distance && (
                      <p className="distanceResult">
                        {t('distance')}:{' '}
                        {fuelUnit === 'imperial'
                          ? ((distance / 1000) * 0.621371).toFixed(2)
                          : (distance / 1000).toFixed(2)}{' '}
                        {fuelUnit === 'imperial' ? 'mi' : 'km'}
                      </p>
                    )}
                    {fuelUsed !== null && (
                      <p className="fuelUsedResult">
                        {t('fuelUsed')}: {fuelUsed.toFixed(2)}{' '}
                        {fuelUnit === 'imperial' ? 'gal' : 'l'}
                      </p>
                    )}
                    {fuelCostEur !== null && displayedFuelCost && (
                      <p className="fuelCostResult" style={{ color: 'green' }}>
                        {t('fuelCost')}: {displayedFuelCost}{' '}
                        {selectedCurrency.toUpperCase()}
                      </p>
                    )}
                    {travelTime && (
                      <p className="travelTimeResult">
                        {t('travelTime')}: {travelTime}
                      </p>
                    )}
                  </div>
                )}

                {/* Alternatívne trasy */}
                {routeAlternatives.length > 1 && (
                  <div className="section routesSection">
                    <h3 className="headingRoutes">{t('selectRoute')}</h3>
                    {routeAlternatives.map((route, index) => (
                      <button
                        key={index}
                        onClick={() => selectRouteAlternative(index)}
                        className={`routeButton ${
                          index === selectedRouteIndex ? 'activeRoute' : ''
                        }`}
                      >
                        {`Route ${index + 1} (${route.legs[0].distance.text})`}
                      </button>
                    ))}
                  </div>
                )}

                {/* Google Maps Navigation */}
                {startLocation && destinationLocation && (
                  <div className="section navigationSection">
                    <button
                      onClick={() =>
                        window.open(getGoogleMapsNavigationUrl(), '_blank')
                      }
                      className="navigationButton"
                    >
                      {t('openNavigation')}
                    </button>
                  </div>
                )}

                {/* Mapa */}
                <MapView
                  directions={directions}
                  markers={markers}
                  language={i18n.language}
                  resetKey={resetKey}
                  onGoogleLoad={() => setIsGoogleLoaded(true)}
                />

                {/* Kontakt, policy, speed insights */}
                <ContactForm />

                {/* SEO sekcia - texty z i18n */}
                <div className="seo-section">
                  <h2>{t('detailTitle')}</h2>
                  <p>{t('detailParagraph1')}</p>
                  <p>{t('detailParagraph2')}</p>
                  <p>{t('detailParagraph3')}</p>
                </div>

                <div className="faq-section">
                  <h2>{t('faqTitle')}</h2>

                  <h3>{t('faqQ1')}</h3>
                  <p>{t('faqA1')}</p>

                  <h3>{t('faqQ2')}</h3>
                  <p>{t('faqA2')}</p>

                  <h3>{t('faqQ3')}</h3>
                  <p>{t('faqA3')}</p>

                  <h3>{t('faqQ4')}</h3>
                  <p>{t('faqA4')}</p>

                  {/* Prípadne link na detailnú stránku / PalivovaKalkulacka */}
                  <Link to="/palivova-kalkulacka">
                    {t('Viac o palivovej kalkulačke') /* ak taký kľúč vytvoríš */}
                  </Link>
                </div>

                <PolicyLinks />
                <SpeedInsights />
              </>
            }
          />

          {/* Ďalšie cesty */}
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Samostatná podstránka */}
          <Route path="/palivova-kalkulacka" element={<PalivovaKalkulacka />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
