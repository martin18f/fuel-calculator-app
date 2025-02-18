import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  sk: {
    translation: {
      welcome: "Výpočet nákladov na cestovanie",
      enter_location: "Vyhľadajte miesto...",
      calculate: "Vypočítať trasu a náklady",
      reset: "Reset",
      start: "Štart",
      destination: "Cieľ",
      avoidHighways: "Vyhnúť sa diaľniciam",
      fuelConsumption: "Spotreba (l/100km):",
      fuelConsumptionImperial: "Spotreba (mpg):",
      fuelPrice: "Cena paliva:",
      distance: "Vzdialenosť",
      fuelUsed: "Spotrebované palivo",
      fuelCost: "Odhadované náklady na palivo",
      selectRoute: "Vyberte alternatívnu trasu:",
      openNavigation: "Otvoriť navigáciu v Google Maps",
      fuelUnitMetric: "l/100km",
      fuelUnitImperial: "mpg",
      travelTime: "Čas cesty",
      currency: "Mena",
      consumptionModeLabel: "Výber spôsobu zadania spotreby:",
      autoConsumptionOption: "Vybrať z tabuľky",
      manualConsumptionOption: "Zadať manuálne",
      selectCar: "Vyberte auto",
      year: "Rok:",
      selectYear: "Vyberte rok",
      brand: "Značka:",
      selectBrand: "Vyberte značku",
      model: "Model:",
      selectModel: "Vyberte model",
      engine: "Motorizácia:",
      selectEngine: "Vyberte motorizáciu",
      contactTitle: "Kontaktujte nás",
      contactMessage: "Ak máte akékoľvek pripomienky alebo ste narazili na chybu, napíšte nám:",
      contactEmail: "dsnextgen.eu@gmail.com",
      nameLabel: "Meno:",
      emailLabel: "Email:",
      messageLabel: "Správa:",
      submitLabel: "Odoslať",
      thankYouMessage: "Ďakujeme za vašu spätnú väzbu!",
      cookieTitle: "Upozornenie na cookies",
      cookieDescription: "Naša stránka používa cookies, aby sme vám poskytli najlepší zážitok.",
      cookiePolicyLink: "Prečítajte si naše pravidlá cookies",
      cookieAccept: "Prijať",
      calculating: "Počítam...",
      darkMode: "Tmavý režim",
      lightMode: "Svetlý režim",
    
      detailTitle: "Palivová kalkulačka – Detaily a Tipy",
      detailParagraph1: "Palivová kalkulačka, niekedy nazývaná aj fuel cost calculator, slúži na rýchly a presný výpočet nákladov na cestu. Stačí zadať vzdialenosť, spotrebu vozidla a cenu paliva, a okamžite zistíš, koľko ťa cesta zhruba vyjde. To je mimoriadne užitočné najmä pri dlhších trasách, kde môžu náklady rapídne stúpať.",
      detailParagraph2: "V dobe, keď ceny pohonných hmôt kolíšu a rozdiel medzi jednotlivými čerpacími stanicami môže byť značný, je výhodné mať prehľad. Naša aplikácia Fuely ti umožňuje brať do úvahy aj aktuálne kurzy mien, ak cestuješ za hranice. Okrem toho môžeš zvoliť alternatívne trasy, vyhnúť sa diaľniciam a vopred odhadnúť, či je pre teba lepšia krátka, no drahšia cesta, alebo dlhšia a lacnejšia varianta.",
      detailParagraph3: "Navyše, tým že budeš vedieť náklady na cestu vopred, môžeš lepšie spravovať svoj rodinný rozpočet. Nezaskočí ťa tak nečakaná suma na čerpacej stanici a vyhneš sa stresu, že minieš viac, než si plánoval.",
      
      faqTitle: "Často kladené otázky (FAQ)",
      faqQ1: "Ako spoľahlivé sú údaje v palivovej kalkulačke?",
      faqA1: "Spoľahlivosť závisí od presnosti tvojich vstupov (spotreba, cena paliva). Aplikácia Fuely môže zohľadňovať rôzne faktory, no nemôže predvídať napr. dopravné zápchy či prudký nárast cien paliva v daný deň.",
      faqQ2: "Prečo je vhodné zadať presnú spotrebu môjho auta?",
      faqA2: "Každé auto má inú reálnu spotrebu. Ak zadáš hodnotu z katalógu, môže sa líšiť od reality. Presnejšie údaje prinesú presnejší výpočet nákladov.",
      faqQ3: "Aké výhody prináša fuel cost calculator pre cestujúcich do zahraničia?",
      faqA3: "Pri cestách do zahraničia sa ti hodí prepočet do inej meny alebo informácia o cenách paliva v zahraničí. Fuely dokáže zohľadniť reálne kurzy a pomôcť ti vybrať trasu s najvýhodnejšími nákladmi.",
      faqQ4: "Môžem pomocou Fuely kalkulovať aj dlhodobé náklady na palivo?",
      faqA4: "Áno. Pokiaľ zadáš rôzne trasy, Fuely ti môže pomôcť vypočítať napr. mesačné či ročné náklady na palivo, ak jazdíš pravidelne tú istú trasu.",


      
    }
  },
  en: {
    translation: {
      welcome: "Travel Cost Calculator",
      enter_location: "Search location...",
      calculate: "Calculate route and costs",
      reset: "Reset",
      start: "Start",
      destination: "Destination",
      avoidHighways: "Avoid highways",
      fuelConsumption: "Fuel consumption (l/100km):",
      fuelConsumptionImperial: "Fuel consumption (mpg):",
      fuelPrice: "Fuel price:",
      distance: "Distance",
      fuelUsed: "Fuel used",
      fuelCost: "Estimated fuel cost",
      selectRoute: "Select an alternative route:",
      openNavigation: "Open navigation in Google Maps",
      fuelUnitMetric: "l/100km",
      fuelUnitImperial: "mpg",
      travelTime: "Travel time",
      currency: "Currency",
      consumptionModeLabel: "Select consumption input mode:",
      autoConsumptionOption: "Choose from table",
      manualConsumptionOption: "Enter manually",
      selectCar: "Select a car",
      year: "Year:",
      selectYear: "Select a year",
      brand: "Brand:",
      selectBrand: "Select a brand",
      model: "Model:",
      selectModel: "Select a model",
      engine: "Engine:",
      selectEngine: "Select an engine",
      contactTitle: "Contact Us",
      contactMessage: "If you have any comments or encountered an error, please let us know:",
      contactEmail: "dsnextgen.eu@gmail.com",
      nameLabel: "Name:",
      emailLabel: "Email:",
      messageLabel: "Message:",
      submitLabel: "Send",
      thankYouMessage: "Thank you for your feedback!",
      cookieTitle: "Cookie Notice",
      cookieDescription: "We use cookies to ensure you get the best experience on our website.",
      cookiePolicyLink: "Read our cookie policy",
      cookieAccept: "Accept",
      calculating: "Calculating...",
      darkMode: "Dark mode",
      lightMode: "Light mode",
      detailTitle: "Fuel Cost Calculator – Details and Tips",
      detailParagraph1: "A fuel cost calculator, sometimes simply called a palivová kalkulačka, is a quick and accurate tool for estimating your travel expenses. By inputting the distance, your vehicle’s fuel consumption, and the fuel price, you can immediately see how much your trip is likely to cost. This is particularly helpful for longer routes where expenses can rapidly increase.",
      detailParagraph2: "In a time when fuel prices fluctuate and there can be significant differences between gas stations, having an overview is crucial. Our Fuely app also lets you factor in real-time currency exchange rates if you’re traveling abroad. You can select alternate routes, avoid highways, and figure out whether a shorter but more expensive route is better for you than a longer, cheaper alternative.",
      detailParagraph3: "Moreover, knowing your travel expenses in advance helps you manage your budget more effectively. You won’t be caught off guard by unexpected fuel costs, and you can avoid the stress of spending more than you planned.",
      
      faqTitle: "Frequently Asked Questions (FAQ)",
      faqQ1: "How reliable are the figures in the fuel cost calculator?",
      faqA1: "The reliability depends on the accuracy of your inputs (fuel consumption, fuel price). While Fuely can account for various factors, it can’t predict traffic jams or sudden price spikes on a given day.",
      faqQ2: "Why should I enter my car’s exact fuel consumption?",
      faqA2: "Each vehicle has a different real-world consumption. Using a catalog value might differ from actual usage. More accurate data leads to more accurate cost calculations.",
      faqQ3: "What advantages does a fuel cost calculator offer for traveling abroad?",
      faqA3: "If you’re heading abroad, it’s useful to convert to another currency or factor in foreign fuel prices. Fuely can take real exchange rates into account and help you choose the route with the most efficient costs.",
      faqQ4: "Can Fuely help calculate my long-term fuel expenses?",
      faqA4: "Yes. If you input different routes, Fuely can assist in estimating monthly or yearly fuel costs, especially if you regularly drive the same route."

    
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
