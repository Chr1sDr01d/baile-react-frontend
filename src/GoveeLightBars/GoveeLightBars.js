// GoveeLightBars.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Slider, CardMedia } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useTheme } from '../darkmode/ThemeContext';
import lightBarsIcon from '../assets/icons/h6046_1.png';
//import styles from './GoveeLightBars.module.css'; // Import the updated CSS module
import styles from '../../src/CommonWidgetStyles.module.css'; 

const GoveeLightBars = ({ deviceName, deviceMac, deviceModel, iconPath }) => {
  const { darkMode } = useTheme();
  const [brightness, setBrightness] = useState(50);

  // Function to get the current status of the Govee light bars from the Flask backend
  const getLightBarsStatus = async () => {
    try {
      // Replace '/api/govee-light-bars-status' with your backend route
      const response = await axios.get(`/api/govee-light-bars-status`, {
        params: { deviceMac, deviceModel },
      });

      if (response.status === 200) {
        const { brightness } = response.data;
        setBrightness(brightness);
      } else {
        console.error('Failed to get Govee light bars status:', response.statusText);
      }
    } catch (error) {
      console.error('Error getting Govee light bars status:', error);
    }
  };

  // Fetch the status of the light bars when the component mounts
  useEffect(() => {
    getLightBarsStatus();
  }, [deviceMac, deviceModel]);

  // Function to send brightness commands to the light bars via the Flask backend
  const sendBrightnessCommand = async (newValue) => {
    try {
      // Replace '/api/govee-light-bars-control' with your backend route
      const response = await axios.post(`/api/govee-light-bars-control`, {
        deviceMac,
        deviceModel,
        brightness: newValue,
      });

      if (response.status === 200) {
        console.log('Brightness command sent:', newValue);
        setBrightness(newValue);
      } else {
        console.error('Failed to send brightness command:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending brightness command:', error);
    }
  };

  return (
    <Card className={`${styles['widget-container']} ${darkMode ? styles['dark-mode'] : ''}`}>
      <CardContent className="card-content">
        <CardMedia
          component="img"
          image={lightBarsIcon}
          alt={`${deviceName} Icon`}
          className={styles['icon']}
        />
        <Typography variant="h5" component="h2" className={styles['widget-title']}>
          {deviceName} Govee Light Bars
        </Typography>
        <Typography variant="subtitle1" gutterBottom className={styles['switch-label']}>
          Brightness: {brightness}
        </Typography>
        <Slider
          className={styles['slider']}
          value={brightness}
          onChange={(e, newValue) => sendBrightnessCommand(newValue)}
          min={0}
          max={100}
        />
      </CardContent>
    </Card>
  );
};

export default GoveeLightBars;
