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

/*
# This file is for the samsungtv binding
# It contains a list in json format of apps that can be run on the TV
# It is provided for TV >2020 when the api that returns a list of installed apps was removed
# format is:
# { "name":"app name", "appId":"app id", "type":2 }
# Where "app name" is the plain text name used to start or display the app, eg "Netflix", "Disney+"
# "app id" is the internal appId assigned by Samsung in the app store. This is hard to find
# See https://github.com/tavicu/homebridge-samsung-tizen/wiki/Applications for the details
# app id is usually a 13 digit number, eg Netflix is "3201907018807"
# the type is an integer, either 2 or 4. 2 is DEEP_LINK (all apps are this type on >2020 TV's)
# type 4 is NATIVE_LAUNCH and the only app that used to use this was "com.tizen.browser" for the
# built in webbrowser.
# This default list will be overwritten by the list retrived from the TV (if your TV is prior to 2020)
# You should edit this list down to just the apps you have installed on your TV.
# NOTE! it is unknown how accurate this list is!
#
#
{ "name":"Internet"                , "appId":"3202010022079"    , "type":2 }
{ "name":"Netflix"                 , "appId":"3201907018807"    , "type":2 }
{ "name":"YouTube"                 , "appId":"111299001912"     , "type":2 }
{ "name":"YouTube TV"              , "appId":"3201707014489"    , "type":2 }
{ "name":"YouTube Kids"            , "appId":"3201611010983"    , "type":2 }
{ "name":"HBO Max"                 , "appId":"3201601007230"    , "type":2 }
{ "name":"Hulu"                    , "appId":"3201601007625"    , "type":2 }
{ "name":"Plex"                    , "appId":"3201512006963"    , "type":2 }
{ "name":"Prime Video"             , "appId":"3201910019365"    , "type":2 }
{ "name":"Rakuten TV"              , "appId":"3201511006428"    , "type":2 }
{ "name":"Disney+"                 , "appId":"3201901017640"    , "type":2 }
{ "name":"NOW TV"                  , "appId":"3201603008746"    , "type":2 }
{ "name":"NOW PlayTV"              , "appId":"3202011022131"    , "type":2 }
{ "name":"VOYO.RO"                 , "appId":"111299000769"     , "type":2 }
{ "name":"Discovery+"              , "appId":"3201803015944"    , "type":2 }
{ "name":"Apple TV"                , "appId":"3201807016597"    , "type":2 }
{ "name":"Apple Music"             , "appId":"3201908019041"    , "type":2 }
{ "name":"Spotify"                 , "appId":"3201606009684"    , "type":2 }
{ "name":"TIDAL"                   , "appId":"3201805016367"    , "type":2 }
{ "name":"TuneIn"                  , "appId":"121299000101"     , "type":2 }
{ "name":"Deezer"                  , "appId":"121299000101"     , "type":2 }
{ "name":"Radio UK"                , "appId":"3201711015226"    , "type":2 }
{ "name":"Radio WOW"               , "appId":"3202012022468"    , "type":2 }
{ "name":"Steam Link"              , "appId":"3201702011851"    , "type":2 }
{ "name":"Gallery"                 , "appId":"3201710015037"    , "type":2 }
{ "name":"Focus Sat"               , "appId":"3201906018693"    , "type":2 }
{ "name":"PrivacyChoices"          , "appId":"3201909019271"    , "type":2 }
{ "name":"AntenaPlay.ro"           , "appId":"3201611011005"    , "type":2 }
{ "name":"Eurosport Player"        , "appId":"3201703012079"    , "type":2 }
{ "name":"EduPedia"                , "appId":"3201608010385"    , "type":2 }
{ "name":"BBC News"                , "appId":"3201602007865"    , "type":2 }
{ "name":"BBC Sounds"              , "appId":"3202003020365"    , "type":2 }
{ "name":"BBC iPlayer"             , "appId":"3201601007670"    , "type":2 }
{ "name":"The Weather Network"     , "appId":"111399000741"     , "type":2 }
{ "name":"Orange TV Go"            , "appId":"3201710014866"    , "type":2 }
{ "name":"Facebook Watch"          , "appId":"11091000000"      , "type":2 }
{ "name":"ITV Hub"                 , "appId":"121299000089"     , "type":2 }
{ "name":"UKTV Play"               , "appId":"3201806016432"    , "type":2 }
{ "name":"All 4"                   , "appId":"111299002148"     , "type":2 }
{ "name":"VUDU"                    , "appId":"111012010001"     , "type":2 }
{ "name":"Explore Google Assistant", "appId":"3202004020674"    , "type":2 }
{ "name":"Amazon Alexa"            , "appId":"3202004020626"    , "type":2 }
{ "name":"My5"                     , "appId":"121299000612"     , "type":2 }
{ "name":"SmartThings"             , "appId":"3201910019378"    , "type":2 }
{ "name":"BritBox"                 , "appId":"3201909019175"    , "type":2 }
{ "name":"TikTok"                  , "appId":"3202008021577"    , "type":2 }
{ "name":"RaiPlay"                 , "appId":"111399002034"     , "type":2 }
{ "name":"DAZN"                    , "appId":"3201806016390"    , "type":2 }
{ "name":"McAfee Security"         , "appId":"3201612011418"    , "type":2 }
{ "name":"hayu"                    , "appId":"3201806016381"    , "type":2 }
{ "name":"Tubi"                    , "appId":"3201504001965"    , "type":2 }
{ "name":"CTV"                     , "appId":"3201506003486"    , "type":2 }
{ "name":"Crave"                   , "appId":"3201506003488"    , "type":2 }
{ "name":"MLB"                     , "appId":"3201603008210"    , "type":2 }
{ "name":"Love Nature 4K"          , "appId":"3201703012065"    , "type":2 }
{ "name":"SiriusXM"                , "appId":"111399002220"     , "type":2 }
{ "name":"7plus"                   , "appId":"3201803015934"    , "type":2 }
{ "name":"9Now"                    , "appId":"3201607010031"    , "type":2 }
{ "name":"Kayo Sports"             , "appId":"3201910019354"    , "type":2 }
{ "name":"ABC iview"               , "appId":"3201812017479"    , "type":2 }
{ "name":"10 play"                 , "appId":"3201704012147"    , "type":2 }
{ "name":"Telstra"                 , "appId":"11101000407"      , "type":2 }
{ "name":"Telecine"                , "appId":"3201604009182"    , "type":2 }
{ "name":"globoplay"               , "appId":"3201908019022"    , "type":2 }
{ "name":"DIRECTV GO"              , "appId":"3201907018786"    , "type":2 }
{ "name":"Stan"                    , "appId":"3201606009798"    , "type":2 }
{ "name":"BINGE"                   , "appId":"3202010022098"    , "type":2 }
{ "name":"Foxtel"                  , "appId":"3201910019449"    , "type":2 }
{ "name":"SBS On Demand"           , "appId":"3201510005981"    , "type":2 }
{ "name":"Security Center"         , "appId":"3202009021877"    , "type":2 }
{ "name":"Google Duo"              , "appId":"3202008021439"    , "type":2 }
{ "name":"Kidoodle.TV"             , "appId":"3201910019457"    , "type":2 }
{ "name":"Embly"                   , "appId":"vYmY3ACVaa.emby"  , "type":2 }
{ "name":"Viaplay"                 , "appId":"niYSnzL6h1.Viaplay"          , "type":2 }
{ "name":"SF Anytime"              , "appId":"sntmlv8LDm.SFAnytime"        , "type":2 }
{ "name":"SVT Play"                , "appId":"5exPmCT0nz.svtplay"          , "type":2 }
{ "name":"TV4 Play"                , "appId":"cczN3dzcl6.TV4"              , "type":2 }
{ "name":"C More"                  , "appId":"7fEIL5XfcE.CMore"            , "type":2 }
{ "name":"Comhem Play"             , "appId":"SQgb61mZHw.ComhemPlay"       , "type":2 }
{ "name":"Viafree"                 , "appId":"hs9ONwyP2U.ViafreeBigscreen" , "type":2 }

*/

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
          <Button onClick={() => setVolume(25)} startIcon={<VolumeDownIcon />}>25%</Button>
          <Button onClick={() => setVolume(50)} startIcon={<VolumeDownIcon />}>50%</Button>
          <Button onClick={() => setVolume(75)} startIcon={<VolumeUpIcon />}>75%</Button>
          <Button onClick={() => setVolume(100)} startIcon={<VolumeUpIcon />}>100% </Button>
          <Button onClick={() => setVolume(0)} startIcon={<VolumeOffIcon />}>Mute </Button>
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
