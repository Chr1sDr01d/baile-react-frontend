import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, TextField, Button } from '@mui/material';
import { useTheme } from '../darkmode/ThemeContext';
import doorBellIcon from '../assets/icons/doorbell.png';
import styles from './BlinkDoorbellCamWidget.module.css';

const BlinkDoorbellCamWidget = () => {
  const { darkMode } = useTheme();
  const [streamUrl, setStreamUrl] = useState('');
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [twoFactorAuthKey, setTwoFactorAuthKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const initializeBlink = async (key) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/initialize-blink', {
        username: process.env.blinkCamUsername,
        password: process.env.blinkCamPassword,
        key: key,
      });

      if (response.status === 401 && response.data.error === '2FA key required') {
        setIs2FARequired(true);
      } else if (response.status === 200) {
        setIs2FARequired(false);
        fetchStreamUrl();
      } else {
        console.error('Error initializing Blink:', response.data.error);
      }
    } catch (error) {
      console.error('Error initializing Blink:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStreamUrl = async () => {
    try {
      const response = await axios.get('http://localhost:5001/camera-stream');
      setStreamUrl(response.data.stream_url);
    } catch (error) {
      console.error('Error fetching stream URL:', error);
    }
  };

  useEffect(() => {
    initializeBlink();
  }, []);

  const handle2FASubmit = () => {
    initializeBlink(twoFactorAuthKey);
  };

  return (
    <div className={`${styles.widgetContainer} ${darkMode ? styles.darkMode : ''}`}>
      <img src={doorBellIcon} alt="Doorbell Icon" className={styles.icon} /> {/* Use the common icon class */}
      <h2 className={styles.widgetTitle}>Blink Doorbell Camera Stream</h2> {/* Use the common title class */}
      {is2FARequired ? (
        <div>
          <TextField
            type="text"
            value={twoFactorAuthKey}
            onChange={(e) => setTwoFactorAuthKey(e.target.value)}
            placeholder="Enter 2FA Key"
          />
          <Button variant="contained" color="primary" onClick={handle2FASubmit}>
            Submit 2FA Key
          </Button>
        </div>
      ) : isLoading ? (
        <CircularProgress />
      ) : streamUrl ? (
        <img src={streamUrl} alt="Blink Doorbell Camera Stream" />
      ) : (
        <p>Loading stream...</p>
      )}
    </div>
  );
};

export default BlinkDoorbellCamWidget;
