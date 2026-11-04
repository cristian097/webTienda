import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {

    const {
        cart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartTotal
    } = useCart();


    const total = getCartTotal();


    if (cart.length === 0) {

        return (
            <main className="cart-page">

                <section className="cart-empty">

                    <div className="cart-empty-icon">
                        🛒
                    </div>

                    <h1>
                        Tu carrito está vacío
                    </h1>

                    <p>
                        Todavía no has agregado productos a tu carrito.
                    </p>

                    <Link
                        to="/tienda"
                        className="cart-primary-button"
                    >
                        Explorar la tienda
                    </Link>

                </section>

            </main>
        );
    }


    return (
        <main className="cart-page">

            <div className="cart-header">

                <div>
                    <h1>
                        Tu carrito
                    </h1>

                    <p>
                        Revisa tus productos antes de continuar.
                    </p>
                </div>

                <span className="cart-count">
                    {cart.length} producto{cart.length !== 1 ? "s" : ""}
                </span>

            </div>


            <div className="cart-layout">

                <section className="cart-products">

                    {cart.map(item => (

                        <article
                            key={item.id}
                            className="cart-item"
                        >

                            <div className="cart-item-image">

                                {item.imageUrl ? (

                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                    />

                                ) : (

                                    <span>
                                        Sin imagen
                                    </span>

                                )}

                            </div>


                            <div className="cart-item-info">

                                <h2>
                                    {item.name}
                                </h2>


                                <p className="cart-item-price">
                                    $
                                    {Number(
                                        item.price
                                    ).toLocaleString("es-CO")}
                                    {" "}por unidad
                                </p>


                                <div className="cart-item-actions">

                                    <div className="quantity-control">

                                        <button
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                            aria-label="Disminuir cantidad"
                                        >
                                            −
                                        </button>


                                        <span>
                                            {item.quantity}
                                        </span>


                                        <button
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                            aria-label="Aumentar cantidad"
                                        >
                                            +
                                        </button>

                                    </div>


                                    <button
                                        className="cart-remove-button"
                                        onClick={() =>
                                            removeFromCart(item.id)
                                        }
                                    >
                                        Eliminar
                                    </button>

                                </div>

                            </div>


                            <div className="cart-item-subtotal">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    $
                                    {(
                                        Number(item.price) *
                                        item.quantity
                                    ).toLocaleString("es-CO")}
                                </strong>

                            </div>

                        </article>

                    ))}

                </section>


                <aside className="cart-summary">

                    <h2>
                        Resumen de compra
                    </h2>


                    <div className="cart-summary-row">

                        <span>
                            Productos
                        </span>

                        <span>
                            {cart.reduce(
                                (total, item) =>
                                    total + item.quantity,
                                0
                            )}
                        </span>

                    </div>


                    <div className="cart-summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            $
                            {total.toLocaleString("es-CO")}
                        </span>

                    </div>


                    <div className="cart-summary-divider">
                    </div>


                    <div className="cart-summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            $
                            {total.toLocaleString("es-CO")}
                        </strong>

                    </div>


                    <Link
                        to="/checkout"
                        className="cart-checkout-button"
                    >
                        Continuar compra
                    </Link>


                    <Link
                        to="/tienda"
                        className="cart-continue-button"
                    >
                        Seguir comprando
                    </Link>

                </aside>

            </div>

        </main>
    );
}

export default Cart;