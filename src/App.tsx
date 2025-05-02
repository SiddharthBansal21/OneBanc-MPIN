import './App.css';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Live from './routes/Live';
import Test from './routes/Test';

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/live" className={({isActive})=> isActive ? 'active' : ''}>
          Live
        </NavLink>
        <NavLink to="/test" className={({isActive})=> isActive ? 'active' : ''}>
          Test
        </NavLink>
      </nav>
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/live" replace />} />
          <Route path="/live" element={<Live />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </main>
    </div>
  );
}
