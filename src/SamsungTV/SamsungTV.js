import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, FormControlLabel, Switch, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useTheme } from '../../src/darkmode/ThemeContext';
import commonStyles from '../../src/CommonWidgetStyles.module.css'
import tvWidgetIcon from '../../src/assets/icons/samsung-tv.png';
import netflixIconDark from '../../src/assets/icons/netflix-black-bg.png';
import netflixIconLight from '../assets/icons/netflix-white-bg.png';
import primeVideoIconDark from '../assets/icons/prime-black-bg.png';
import primeVideoIconLight from '../assets/icons/prime-white-bg.png';
import youtubeIconDark from '../assets/icons/youtube-black-bg-2.png';
import youtubeIconLight from '../assets/icons/youtube-white-bg-2.png';
import disneyIconLight from '../assets/icons/disney-light.png';
import disneyIconDark from '../assets/icons/disney-dark.png';


const SamsungTV = () => {
  const { darkMode } = useTheme();
  const [power, setPower] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flaskBaseUrl = 'http://localhost:5001';

  const getPowerState = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${flaskBaseUrl}/samsung-tv/power-state`);
      setPower(response.data.power === 'on');
    } catch (error) {
      console.error('Error fetching power state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendCommand = async (capability, command, commandArgs = []) => {
    setIsLoading(true);
    try {
      await axios.post(`${flaskBaseUrl}/samsung-tv/send-command`, {
        capability: capability,
        command: command,
        arguments: commandArgs
      });
    } catch (error) {
      console.error('Error sending command:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePower = () => {
    sendCommand('switch', power ? 'off' : 'on');
    setPower(!power);
  };

  const setVolume = (volumeLevel) => {
    sendCommand('audioVolume', 'setVolume', [volumeLevel]);
  };

  const launchApp = (appId) => {
    sendCommand('custom.launchapp', 'launchApp', [appId]);
  };

  useEffect(() => {
    getPowerState();
    const interval = setInterval(getPowerState, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${commonStyles['widget-container']} ${darkMode ? commonStyles['dark-mode'] : ''}`}>
      <img src={tvWidgetIcon} alt="Samsung TV" className={`${commonStyles['widget-image']}`} />
      <h2 style={{ color: darkMode ? '#fff' : '#333' }}>Samsung TV Control 📺</h2>
      <FormControlLabel
        control={<Switch checked={power} onChange={togglePower} color="primary" disabled={isLoading} />}
        label={isLoading ? <CircularProgress size={20} /> : <FiberManualRecordIcon style={{ color: power ? 'green' : 'red' }} />}
      />
      <div className="control-panel">
        {/* Volume and Playback Controls */}
        <div className="volume-playback-controls"></div>
          <Button onClick={() => setVolume(0)} startIcon={<VolumeOffIcon />}>Mute </Button>
          <Button onClick={() => setVolume(25)} startIcon={<VolumeDownIcon />}>25%</Button>
          <Button onClick={() => setVolume(50)} startIcon={<VolumeDownIcon />}>50%</Button>
          <Button onClick={() => setVolume(75)} startIcon={<VolumeUpIcon />}>75%</Button>
          <Button onClick={() => setVolume(100)} startIcon={<VolumeUpIcon />}>100% </Button>
          <Button onClick={() => sendCommand('mediaPlayback', 'play')} startIcon={<PlayArrowIcon />}>Play </Button>
          <Button onClick={() => sendCommand('mediaPlayback', 'pause')} startIcon={<PauseIcon />}>Pause </Button>
        </div>

        {/* App Launch Buttons */}
        <div className="app-launch-buttons">
          <Button onClick={() => launchApp("3201907018807")}>
            <img src={darkMode ? netflixIconDark : netflixIconLight} alt="Netflix" style={{ height: '45px' }} /></Button>
          <Button onClick={() => launchApp("3201910019365")}>
            <img src={darkMode ? primeVideoIconDark : primeVideoIconLight} alt="Prime Video" style={{ height: '50px' }} />
          </Button>
          <Button onClick={() => launchApp("111299001912")}>
            <img src={darkMode ? youtubeIconDark : youtubeIconLight} alt="YouTube" style={{ height: '35px' }} />
          </Button>
          <Button onClick={() => launchApp("3201901017640")}>
            <img src={darkMode ? disneyIconDark : disneyIconLight} alt="Disney+" style={{ height: '50px' }} />
          </Button>
        {/* Additional buttons for other functionalities can be added here */}
      </div>
    </div>
  );
};

export default SamsungTV;
