import { os } from '@tauri-apps/api';
import { invoke } from '@tauri-apps/api/tauri';
import 'rc-tooltip/assets/bootstrap_white.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './assets/vendor/bootstrap/bootstrap-grid.min.css';
import App from './components/App';
import './index.css';
import { loadLibrary } from './reducers/library/librarySlice';
import { setDarkMode, setPlatform } from './reducers/settings/settingsSlice';
import reportWebVitals from './reportWebVitals';
import { store } from './store';

// Load the library state on load.
invoke('load_library').then((libraryState) => {
  store.dispatch(loadLibrary(libraryState));
});

// Until the feature request hasn't been resolved, we temporarily will use the
// backend to detect the system theme for macOS.
// @see https://github.com/tauri-apps/tao/issues/387
invoke('get_system_theme').then((theme) => {
  const isDarkMode = theme === 'dark';
  store.dispatch(setDarkMode(isDarkMode));
});

// Detect the users's platform.
os.platform().then((platform) => {
  store.dispatch(setPlatform(platform));
});

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
