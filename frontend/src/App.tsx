import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { ConfirmProvider } from './components/ui/ConfirmProvider';
import { PwaUpdatePrompt } from './components/ui/PwaUpdatePrompt';
import { ToastProvider } from './components/ui/ToastProvider';
import { AuthProvider } from './context/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Stock } from './pages/Stock';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <PwaUpdatePrompt />
        <ConfirmProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/produtos" element={<Products />} />
                  <Route path="/vendas" element={<Sales />} />
                  <Route path="/estoque" element={<Stock />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
