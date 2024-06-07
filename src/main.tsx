import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
)
