import React, { useState } from 'react';
import axios from 'axios';
import { FormControlLabel, Switch, CircularProgress } from '@mui/material';
import { useTheme } from '../darkmode/ThemeContext';
import styles from '../CommonWidgetStyles.module.css';
import blkHeaterIcon from '../assets/icons/Blk_Heater.png';

const GoveeHeaterWidget = ({ device, model }) => {
  const { darkMode } = useTheme();
  const [power, setPower] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flaskBaseUrl = 'http://localhost:5001';

  const sendHeaterCommand = async (cmd) => {
    setIsLoading(true);
    try {
      await axios.put(`${flaskBaseUrl}/govee-heater/control`, {
        device,
        model,
        cmd,
      });
      if (cmd.name === 'turn') {
        setPower(cmd.value === 'on');
      }
    } catch (error) {
      console.error('Error sending heater command:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePowerToggle = () => {
    sendHeaterCommand({ name: 'turn', value: power ? 'off' : 'on' });
  };

  return (
    <div className={`${styles['widget-container']} ${darkMode ? styles['dark-mode'] : ''}`}>
      <img src={blkHeaterIcon} alt="Heater Icon" className={styles.icon} />
      <h2 className={styles.widgetTitle}>Govee Black Heater</h2>
      <FormControlLabel
        control={
          <Switch
            checked={power}
            onChange={handlePowerToggle}
            color="primary"
            disabled={isLoading}
            />
            }
            label={isLoading ? <CircularProgress size={20} /> : 'Power'}
            className={styles.switchLabel}
          />
    </div>
            );
            };
            
export default GoveeHeaterWidget;
