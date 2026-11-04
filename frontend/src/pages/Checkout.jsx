import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "/styles/checkout.css";

function Checkout() {

    const {
        cart,
        getCartTotal
    } = useCart();


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        message: "",
        acceptData: false
    });


    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setFormData({
            ...formData,
            [name]: type === "checkbox"
                ? checked
                : value
        });
    };


    const handleSubmit = (event) => {

        event.preventDefault();


        if (!formData.acceptData) {

            alert(
                "Debes aceptar el tratamiento de datos."
            );

            return;
        }


        const productsText = cart
            .map(item => {

                const subtotal =
                    Number(item.price) *
                    item.quantity;


                return (
                    `- ${item.name} x${item.quantity} = $` +
                    `${subtotal.toLocaleString("es-CO")}`
                );

            })
            .join("\n");


        /*
            Usamos Unicode escapes para los emojis.
            Esto evita problemas de codificación.
        */

        const message = `
\u{1F514} NUEVO PEDIDO

\u{1F9FE} DATOS DEL CLIENTE

\u{1F464} Nombre: ${formData.name}
\u{1F4DE} Teléfono: ${formData.phone}
\u{1F4CD} Dirección: ${formData.address}

\u{2709}\u{FE0F} Mensaje:
${formData.message || "Sin mensaje adicional"}


\u{1F6D2} DETALLE DEL PEDIDO

${productsText}


\u{1F4B5} TOTAL: $${getCartTotal().toLocaleString("es-CO")}

\u{2705} El cliente aceptó el tratamiento de sus datos.
`;


        const whatsappNumber = "573155752247";


        const whatsappUrl =
            `https://wa.me/${whatsappNumber}?text=` +
            encodeURIComponent(message);


        window.open(
            whatsappUrl,
            "_blank"
        );
    };


    const total = getCartTotal();


    if (cart.length === 0) {

        return (
            <main className="checkout-page">

                <section className="checkout-empty">

                    <div className="checkout-empty-icon">
                        🛒
                    </div>

                    <h1>
                        No hay productos
                    </h1>

                    <p>
                        No hay productos en tu carrito.
                    </p>

                    <Link
                        to="/tienda"
                        className="checkout-primary-button"
                    >
                        Ir a la tienda
                    </Link>

                </section>

            </main>
        );
    }


    return (

        <main className="checkout-page">

            <div className="checkout-header">

                <h1>
                    Finalizar compra
                </h1>

                <p>
                    Completa tus datos para enviar tu pedido por WhatsApp.
                </p>

            </div>


            <div className="checkout-layout">

                {/* =========================
                    FORMULARIO
                ========================= */}

                <section className="checkout-form-card">

                    <div className="checkout-section-header">

                        <span className="checkout-section-icon">
                            👤
                        </span>

                        <div>

                            <h2>
                                Datos de contacto
                            </h2>

                            <p>
                                Necesitamos estos datos para gestionar tu pedido.
                            </p>

                        </div>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="checkout-form-group">

                            <label htmlFor="name">
                                Nombre y apellido
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ej. Juan Pérez"
                                required
                            />

                        </div>


                        <div className="checkout-form-group">

                            <label htmlFor="phone">
                                Teléfono
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Ej. 315 123 4567"
                                required
                            />

                        </div>


                        <div className="checkout-form-group">

                            <label htmlFor="address">
                                Dirección de entrega
                            </label>

                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Ej. Calle 10 #20-30"
                                required
                            />

                        </div>


                        <div className="checkout-form-group">

                            <label htmlFor="message">
                                Mensaje
                            </label>

                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Información adicional para el pedido"
                                rows="4"
                            />

                        </div>


                        <label className="checkout-checkbox">

                            <input
                                type="checkbox"
                                name="acceptData"
                                checked={formData.acceptData}
                                onChange={handleChange}
                                required
                            />

                            <span>
                                Acepto el tratamiento de mis datos personales
                                para gestionar este pedido.
                            </span>

                        </label>


                        <button
                            type="submit"
                            className="checkout-submit-button"
                        >
                            Enviar pedido por WhatsApp
                        </button>

                    </form>

                </section>


                {/* =========================
                    RESUMEN
                ========================= */}

                <aside className="checkout-summary">

                    <div className="checkout-section-header">

                        <span className="checkout-section-icon">
                            🛒
                        </span>

                        <div>

                            <h2>
                                Resumen del pedido
                            </h2>

                            <p>
                                Revisa tus productos.
                            </p>

                        </div>

                    </div>


                    <div className="checkout-products">

                        {cart.map(item => (

                            <article
                                key={item.id}
                                className="checkout-product"
                            >

                                <div className="checkout-product-info">

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        {item.quantity} × $
                                        {Number(
                                            item.price
                                        ).toLocaleString("es-CO")}
                                    </p>

                                </div>


                                <strong>
                                    $
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toLocaleString("es-CO")}
                                </strong>

                            </article>

                        ))}

                    </div>


                    <div className="checkout-summary-divider">
                    </div>


                    <div className="checkout-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            $
                            {total.toLocaleString("es-CO")}
                        </strong>

                    </div>


                    <Link
                        to="/carrito"
                        className="checkout-back-cart"
                    >
                        ← Volver al carrito
                    </Link>

                </aside>

            </div>

        </main>
    );
}

export default Checkout;