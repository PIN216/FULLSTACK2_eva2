import React, { useContext } from 'react';
import { StoreProvider, StoreContext } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Categorias } from './views/Categorias';
import { BlogsView } from './views/BlogsView';
import { DetalleProducto } from './views/DetalleProducto';
import { CarritoView } from './views/CarritoView';
import { CheckoutView } from './views/CheckoutView';
import { PagoExitoView } from './views/PagoExitoView';
import { PagoErrorView } from './views/PagoErrorView';
import { OfertasView } from './views/OfertasView';
import { LoginView } from './views/LoginView';
import { RegistroView } from './views/RegistroView';
import { DashboardView } from './views/admin/DashboardView';

// --- RUTA CORREGIDA SEGÚN TUS CAPTURAS ---
import AdminDashboard from './components/pages/AdminDashboard';

const MainRouter = () => {
  const { currentView } = useContext(StoreContext);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home />;
      case 'categorias': return <Categorias />;
      case 'blogs': return <BlogsView />;
      case 'detalle_producto': return <DetalleProducto />;
      case 'carrito': return <CarritoView />;
      case 'checkout': return <CheckoutView />;
      case 'pago_exito': return <PagoExitoView />;
      case 'pago_error': return <PagoErrorView />;
      case 'ofertas': return <OfertasView />;
      case 'login': return <LoginView />;
      case 'registro': return <RegistroView />;
      case 'admin_dashboard': return <DashboardView />;
      case 'admin_panel': return <AdminDashboard />;
      default: return <Home />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{renderView()}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
}