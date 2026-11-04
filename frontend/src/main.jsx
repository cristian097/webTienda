import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "../styles/layout.css";
import "../styles/cart.css";


import App from "./App.jsx";
import { CartProvider } from "./context/CartContext";


ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <BrowserRouter>

            <CartProvider>
                <App />
            </CartProvider>

        </BrowserRouter>

    </React.StrictMode>
);