import { Link } from "react-router-dom";
import "/styles/home.css";


function Home() {

    return (
        <main className="home-page">

            {/* =========================
                HERO
            ========================= */}

            <section className="home-hero">

                <div className="home-hero-content">

                    <span className="home-hero-label">
                        SOLUCIONES PARA TI
                    </span>

                    <h1>
                        Calidad y confianza
                        <span> en cada producto.</span>
                    </h1>

                    <p>
                        Descubre nuestros productos y conoce una empresa
                        comprometida con ofrecer soluciones de calidad
                        para nuestros clientes.
                    </p>

                    <div className="home-hero-actions">

                        <Link
                            to="/tienda"
                            className="home-primary-button"
                        >
                            Explorar tienda
                        </Link>

                        <Link
                            to="/empresa"
                            className="home-secondary-button"
                        >
                            Conocer la empresa
                        </Link>

                    </div>

                </div>


                <div className="home-hero-decoration">


                    <div className="hero-product-placeholder">
                        <span>
                            <img src='/logo.png' alt="Logo Empresa"/> 
                        </span>
                    </div>

                </div>

            </section>


            {/* =========================
                PRESENTACIÓN
            ========================= */}

            <section className="home-about">

                <div className="home-section-title">

                    <span>
                        QUIÉNES SOMOS
                    </span>

                    <h2>
                        Una empresa enfocada en hacer las cosas bien
                    </h2>

                    <p>
                        Nuestra diferencia está en la esencia familiar que nos caracteriza y en la forma cercana y personalizada en que atendemos a cada cliente. Más que vender productos, buscamos comprender sus necesidades, ofrecer alternativas para diferentes gustos y ocasiones, y brindar una experiencia de compra basada en la confianza, la honestidad y el compromiso. Combinamos la variedad de nuestro catálogo con un trato humano y flexible, donde cada persona importa y cada compra es una oportunidad para demostrar que hacer las cosas bien significa escuchar, cumplir y ofrecer un servicio que invite a regresar.
                    </p>

                    
                </div>


                <div className="home-about-grid">

                    <article className="home-info-card">

                        <div className="home-info-icon">
                            ✓
                        </div>

                        <h3>
                            Calidad
                        </h3>

                        <p>
                            Productos seleccionados pensando en las necesidades
                            de nuestros clientes.
                        </p>

                    </article>


                    <article className="home-info-card">

                        <div className="home-info-icon">
                            ★
                        </div>

                        <h3>
                            Confianza
                        </h3>

                        <p>
                            Construimos relaciones duraderas basadas en
                            responsabilidad y compromiso.
                        </p>

                    </article>


                    <article className="home-info-card">

                        <div className="home-info-icon">
                            →
                        </div>

                        <h3>
                            Servicio
                        </h3>

                        <p>
                            Estamos preparados para atender y acompañar
                            a nuestros clientes.
                        </p>

                    </article>

                </div>

            </section>


            {/* =========================
                PRODUCTOS DESTACADOS
            ========================= */}

            <section className="home-featured">

                <div className="home-section-title">

                    <span>
                        NUESTROS PRODUCTOS
                    </span>

                    <h2>
                        Productos destacados
                    </h2>

                    <p>
                        Próximamente podremos mostrar aquí los productos
                        destacados de nuestra tienda.
                    </p>

                </div>


                <div className="home-featured-placeholder">

                    <div className="featured-placeholder-icon">
                        🛍️
                    </div>

                    <h3>
                        Próximamente
                    </h3>

                    <p>
                        Estamos preparando una selección de nuestros
                        productos destacados.
                    </p>

                    <Link
                        to="/tienda"
                        className="home-primary-button"
                    >
                        Ver todos los productos
                    </Link>

                </div>

            </section>


            {/* =========================
                LLAMADO A LA ACCIÓN
            ========================= */}

            <section className="home-cta">

                <div>

                    <span>
                        ¿TIENES ALGUNA PREGUNTA?
                    </span>

                    <h2>
                        Estamos aquí para ayudarte.
                    </h2>

                    <p>
                        Ponte en contacto con nosotros y te ayudaremos
                        a encontrar la mejor opción.
                    </p>

                </div>


                <Link
                    to="/contacto"
                    className="home-cta-button"
                >
                    Contáctanos
                </Link>

            </section>

        </main>
    );
}

export default Home;