import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'
=======
// Using HashRouter for GitHub Pages/static hosting compatibility (no server-side routing)
import { BrowserRouter } from "react-router-dom";

>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530

createRoot(document.getElementById('root')).render(

    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>

)