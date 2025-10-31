import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import CityView from '../pages/CityView'
import Footer from '../components/Footer'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/city/:cityName" element={<CityView />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App
