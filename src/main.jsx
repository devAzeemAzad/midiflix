import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Using HashRouter for GitHub Pages/static hosting compatibility (no server-side routing)
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(

    <HashRouter basename={import.meta.env.BASE_URL}>
      <App />
    </HashRouter>

)