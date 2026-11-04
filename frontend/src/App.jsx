import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Store from "./pages/Store";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AdminCategories from "./pages/AdminCategories";
import AdminProducts from "./pages/AdminProducts";
import Checkout from "./pages/Checkout";
import { useCart } from "./context/CartContext";


import ProtectedRoute from "./components/ProtectedRoute";



function App() {

    const { cart } = useCart();

    const cartCount = cart.reduce(
        (total, product) => total + product.quantity,
        0
    );

    const [navbarHidden, setNavbarHidden] = useState(false);

useEffect(() => {
    let previousScroll = window.scrollY;

    const handleScroll = () => {
        const currentScroll = window.scrollY;
        const isMobile = window.innerWidth <= 768;

        if (!isMobile || currentScroll < 80) {
            setNavbarHidden(false);
        } else if (currentScroll > previousScroll + 5) {
            // Al bajar, ocultar el menú.
            setNavbarHidden(true);
        } else if (currentScroll < previousScroll - 5) {
            // Al subir, mostrar el menú.
            setNavbarHidden(false);
        }

        previousScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}, []);

    
    return (
        
        <>
            <header
    className={`app-header ${navbarHidden ? "navbar-hidden" : ""}`}>
    <nav className="navbar">
        <Link to="/" className="navbar-logo">
            MGraphix
        </Link>

        <div className="navbar-links">
            <Link to="/">Inicio</Link>
            <Link to="/tienda">Tienda</Link>
            <Link to="/empresa">Empresa</Link>
            <Link to="/contacto">Contacto</Link>

            
                <Link to="/carrito" className="navbar-cart">
                    <span className="navbar-cart-label">
                        🛒 Carrito
                    </span>

                    {cartCount > 0 && (
                        <span className="cart-badge">
                            {cartCount > 99 ? "99+" : cartCount}
                        </span>
                    )}
                </Link>


            <Link to="/login">Administrador</Link>
        </div>
    </nav>
</header>

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/tienda"
                    element={<Store />}
                />

                <Route
                    path="/empresa"
                    element={<Company />}
                />

                <Route
                    path="/contacto"
                    element={<Contact />}
                />

                <Route
                    path="/carrito"
                    element={<Cart />}
                />

                <Route
                            path="/checkout"
                            element={<Checkout />}
                     />

                <Route
                    path="/login"
                    element={<Login />}
                />

               <Route
                    path="/admin"
                    element={
                    <ProtectedRoute>
                         <Admin />
                    </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/categorias"
                    element={
                    <ProtectedRoute>
                        <AdminCategories />
                    </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/productos"
                    element={
                        <ProtectedRoute>
                            <AdminProducts />
                        </ProtectedRoute>
                    }
                />




            </Routes>
        </>
    );
}

export default App;
