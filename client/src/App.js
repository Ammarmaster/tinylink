import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashbord.jsx';
import LinkStats from './pages/LinkStats.jsx';
import logo from './logo.svg';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<LinkStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
