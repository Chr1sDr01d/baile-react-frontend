import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Slider, CardMedia } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useTheme } from '../darkmode/ThemeContext';
import tvLightsIcon from '../assets/icons/h16199.png';
//import styles from './GoveeTVLights.module.css'; // Import the updated CSS module
import styles from '../../src/CommonWidgetStyles.module.css'; 

const GoveeTVLights = ({ deviceName, deviceMac, deviceModel, iconPath }) => {
  const { darkMode } = useTheme();
  const [brightness, setBrightness] = useState(50);

  // Function to get the current status of the Govee TV lights from the Flask backend
  const getTVLightsStatus = async () => {
    try {
      // Replace '/api/govee-tv-lights-status' with your backend route
      const response = await axios.get(`/api/govee-tv-lights-status`, {
        params: { deviceMac, deviceModel },
      });

      if (response.status === 200) {
        const { brightness } = response.data;
        setBrightness(brightness);
      } else {
        console.error('Failed to get Govee TV lights status:', response.statusText);
      }
    } catch (error) {
      console.error('Error getting Govee TV lights status:', error);
    }
  };

  // Fetch the status of the TV lights when the component mounts
  useEffect(() => {
    getTVLightsStatus();
  }, [deviceMac, deviceModel]);

  const sendBrightnessCommand = async (newValue) => {
    try {
      const response = await axios.post(`/api/govee-tv-lights-control`, {
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
          image={tvLightsIcon}
          alt={`${deviceName} Icon`}
          className={styles['icon']}
        />
        <Typography variant="h5" component="h2" className={styles['widget-title']}>
          {deviceName} Govee TV Light
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

export default GoveeTVLights;
