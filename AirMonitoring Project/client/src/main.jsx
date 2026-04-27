import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LandingPage from './LandingPage.jsx'
import './index.css'
import './landing.css'

function Root() {
  const [page, setPage] = useState(() => 
    window.location.hash === '#dashboard' ? 'dashboard' : 'landing'
  );

  useEffect(() => {
    const onHash = () => {
      setPage(window.location.hash === '#dashboard' ? 'dashboard' : 'landing');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return page === 'dashboard' ? <App /> : <LandingPage />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
