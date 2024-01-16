import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SamsungTV from './SamsungTV/SamsungTV';
import GoveeTVLights from './GoveeTVLights/GoveeTVLights';
import GoveeLightBars from './GoveeLightBars/GoveeLightBars';
import GoveeFloorLamp from './GoveeFloorLamp/GoveeFloorLamp';
import GoveeHeaterWidget from './GoveeHeaters/GoveeHeaterWidget';
import { CustomThemeProvider } from './darkmode/ThemeContext';
import DarkModeToggle from './darkmode/DarkModeToggle';
import BlinkDoorbellCamWidget from './BlinkDoorbell/BlinkDoorbellCamWidget';
import styles from '../src/App.module.css';
import blkHeaterIcon from '../src/assets/icons/Blk_Heater.png';
import wteHeaterIcon from '../src/assets/icons/Wte_Heater.png'; // Assuming you have a

const BLK_HEATER = '1D:C0:60:74:F4:6E:B7:C4';
const HEATER_MODEL= 'H7130';
const WTE_HEATER='1D:C8:60:74:F4:58:56:42';

function App() {
  return (
    <CustomThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </CustomThemeProvider>
  );
}

function Home() {
  return (
    <div>
      <div className={styles.widgetsContainer}>
        <section className="media">
          <h2>Media 💻</h2>
          <SamsungTV />
        </section>

        <section className="home-appliances">
          <h2>Home Appliances 🏠</h2>
          <GoveeHeaterWidget 
          device={BLK_HEATER} 
          model={HEATER_MODEL}
          icon={blkHeaterIcon}
          heaterName="Govee Black Heater"
          />
          <GoveeHeaterWidget 
            device={WTE_HEATER} 
            model={HEATER_MODEL} 
            icon={wteHeaterIcon} 
            heaterName="Govee White Heater"
          />
          
        </section>
{/*
        <section className="lights">
          <h2>Lights 💡 </h2>
          <GoveeTVLights />
          <GoveeLightBars />
          <GoveeFloorLamp />
        </section>

        <section className="security">
          <h2>Security 🚨</h2>
          <BlinkDoorbellCamWidget />
        </section>
  */}
        {/* Add more widgets or sections as needed */}
      </div>
      <DarkModeToggle className={styles.darkModeToggle} 
          style={{marginBottom: '5px'}} 
          size="small"
          checkedIcon={<span>🌞</span>} 
          uncheckedIcon={<span>🌙</span>} 
          checkedColor="green" 
          uncheckedColor="red" 
         /> 
    </div>
  );
}

export default App;
