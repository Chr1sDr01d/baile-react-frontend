// GoveeFloorLamp.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Slider, CardMedia } from '@mui/material';
import { useTheme } from '../darkmode/ThemeContext';
import floorLampIcon from '../assets/icons/h6076_1.png';
//import styles from './GoveeFloorLampWidget.module.css'; // Import the CSS module
import styles from '../../src/CommonWidgetStyles.module.css'; 

const GoveeFloorLamp = ({ deviceName, deviceMac, deviceModel, iconPath }) => {
  const { darkMode } = useTheme();
  const [brightness, setBrightness] = useState(50);

  // Function to get the current status of the Govee floor lamp from the Flask backend
  const getFloorLampStatus = async () => {
    try {
      // Replace '/api/govee-floor-lamp-status' with your backend route
      const response = await axios.get(`/api/govee-floor-lamp-status`, {
        params: { deviceMac, deviceModel },
      });

      if (response.status === 200) {
        const { brightness } = response.data;
        setBrightness(brightness);
      } else {
        console.error('Failed to get Govee floor lamp status:', response.statusText);
      }
    } catch (error) {
      console.error('Error getting Govee floor lamp status:', error);
    }
  };

  // Fetch the status of the floor lamp when the component mounts
  useEffect(() => {
    getFloorLampStatus();
  }, [deviceMac, deviceModel]);

  // Function to send brightness commands to the floor lamp via the Flask backend
  const sendBrightnessCommand = async (newValue) => {
    try {
      // Replace '/api/govee-floor-lamp-control' with your backend route
      const response = await axios.post(`/api/govee-floor-lamp-control`, {
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
      <CardContent className={styles['card-content']}>
        <CardMedia
          component="img"
          image={floorLampIcon}
          alt="Govee Floor Lamp Icon"
          className={styles.icon}
        />
        <Typography variant="h5" component="h2" className={styles['widget-title']}>
          {deviceName} Govee Floor Lamp
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Brightness: {brightness}
        </Typography>
        <Slider
          value={brightness}
          onChange={(e, newValue) => sendBrightnessCommand(newValue)}
          min={0}
          max={100}
          className={styles['MuiSliderRoot']}
        />
      </CardContent>
    </Card>
  );
};

export default GoveeFloorLamp;
