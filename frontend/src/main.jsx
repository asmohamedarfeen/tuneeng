/**
 * Main entry point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  document.body.innerHTML = '<h1 style="padding: 2rem; color: red;">Error: Root element not found!</h1>';
} else {
  console.log('✅ Root element found, rendering app...');
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('✅ App rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center;">
        <h1 style="color: red;">Error Loading Application</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">Reload Page</button>
      </div>
    `;
  }
}

