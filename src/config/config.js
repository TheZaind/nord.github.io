// Environment configuration
const config = {
  // PythonAnywhere URLs (Production)
  PRODUCTION: {
    API_URL: 'https://zaind.pythonanywhere.com',
    WS_URL: 'https://zaind.pythonanywhere.com',
    USE_WEBSOCKETS: false // PythonAnywhere free doesn't support WebSockets
  },
  
  // Local development
  DEVELOPMENT: {
    API_URL: 'http://localhost:5000',
    WS_URL: 'http://localhost:5000',
    USE_WEBSOCKETS: true
  }
};

// Direkte Verwendung der PRODUCTION Konfiguration für PythonAnywhere
const currentConfig = config.PRODUCTION;

console.log('🌍 Using config:', currentConfig);

export default currentConfig;
