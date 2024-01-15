import React, { useState } from 'react';
import axios from 'axios';
import { FormControlLabel, Switch, CircularProgress, Button } from '@mui/material';
import { useTheme } from '../darkmode/ThemeContext';
import styles from '../CommonWidgetStyles.module.css';
import blkHeaterIcon from '../assets/icons/Blk_Heater.png';
import wteHeaterIcon from '../assets/icons/Wte_Heater.png';

  const GoveeHeaterWidget = ({ device, model, icon}) => {
  const { darkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const flaskBaseUrl = 'http://localhost:5001';

  const sendHeaterCommand = async (cmd) => {
    setIsLoading(true);
    try {
      await axios.post(`${flaskBaseUrl}/govee-heater/control`, {
        device,
        model,
        cmd,
      });
    } catch (error) {
      console.error('Error sending heater command:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const heaterIcon = icon === 'black' ? blkHeaterIcon : wteHeaterIcon;

  return (
    <div className={`${styles['widget-container']} ${darkMode ? styles['dark-mode'] : ''}`}>
      <img src={heaterIcon} alt="Heater Icon" className={styles.icon} />
      <h2 className={styles.widgetTitle}>Govee Heater</h2>
      {isLoading ? <CircularProgress /> : (
        <div className={styles.controlPanel}>
          <Button onClick={() => sendHeaterCommand({ name: 'turn', value: 'on' })}>Power On</Button>
          <Button onClick={() => sendHeaterCommand({ name: 'turn', value: 'off' })}>Power Off</Button>
          <Button onClick={() => sendHeaterCommand({ name: 'mode', value: 1 })}>Low</Button>
          <Button onClick={() => sendHeaterCommand({ name: 'mode', value: 2 })}>Medium</Button>
          <Button onClick={() => sendHeaterCommand({ name: 'mode', value: 3 })}>High</Button>
          <Button onClick={() => sendHeaterCommand({ name: 'mode', value: 16 })}>Sleep</Button>
        </div>
        )}
    </div>
  );
};
export default GoveeHeaterWidget;