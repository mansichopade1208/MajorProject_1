import './App.css'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import PatientDashboard from './pages/patient/PatientDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

