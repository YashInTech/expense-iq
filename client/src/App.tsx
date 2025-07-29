import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/dashboard';
import { Auth } from './pages/dashboard/auth/index';
import { FinancialRecordsProvider } from './contexts/financial-record-context';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';

function App() {
  return (
    <Router>
      <div className='app-container'>
        <div className='navbar'>
          <div className='navbar-left'></div>
          <div className='navbar-center'>
            <h1 className='app-title'>ExpenseIQ</h1>
          </div>
          <div className='navbar-right'>
            <Link to='/' className='dashboard-link'>
              Dashboard
            </Link>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode='modal'>
                <button className='sign-in-button'>Sign In</button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
        <div className='content-container'>
          <Routes>
            <Route
              path='/'
              element={
                <FinancialRecordsProvider>
                  <Dashboard />
                </FinancialRecordsProvider>
              }
            />
            <Route path='/auth' element={<Auth />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
