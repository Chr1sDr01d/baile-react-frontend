import React from 'react';
import { useTheme } from '../darkmode/ThemeContext';
import Switch from '@mui/material/Switch';

const DarkModeToggle = (props) => {
  const { darkMode, setDarkMode } = useTheme();

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Switch
      checked={darkMode}
      onChange={handleToggle}
      icon={<span>🌙</span>} // Unchecked icon
      checkedIcon={<span>🌞</span>} // Checked icon
      {...props} // Spread additional props to allow custom styling and other props
    />
  );
};

export default DarkModeToggle;

// old css config doesn't allow for inline styles
// import React from 'react';
// import { useTheme } from '../darkmode/ThemeContext';
// import Switch from '@mui/material/Switch';

// const DarkModeToggle = () => {
//   const { darkMode, setDarkMode } = useTheme();

//   const handleToggle = () => {
//     setDarkMode(!darkMode);
//   };

//   return (
//     <Switch checked={darkMode} onChange={handleToggle} />
//   );
// };

// export default DarkModeToggle;
