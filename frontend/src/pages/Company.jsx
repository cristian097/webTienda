import "/styles/company.css";

function Company() {

    return (
        <main className="company-page">

            {/* =========================
                ENCABEZADO
            ========================= */}

            <section className="company-hero">

                <div className="company-hero-content">

                    <span>
                        NUESTRA EMPRESA
                    </span>

                    <h1>
                        Conoce quiénes somos
                    </h1>

                    <p>
                        Conoce nuestra historia, nuestra forma de trabajar
                        y los principios que orientan nuestro compromiso
                        con nuestros clientes.
                    </p>

                </div>

            </section>


            {/* =========================
                QUIÉNES SOMOS
            ========================= */}

            <section className="company-about">

                <div className="company-about-content">

                    <span className="company-section-label">
                        QUIÉNES SOMOS
                    </span>

                    <h2>
                        Una empresa construida sobre confianza y compromiso
                    </h2>

                    <p>
                        Somos una empresa comercial familiar que nació en el hogar, impulsada por el deseo de ofrecer productos variados y brindar una experiencia de compra cercana, confiable y satisfactoria. Desde nuestros inicios, hemos mantenido la esencia de un negocio construido con dedicación, compromiso y atención personalizada, donde cada cliente representa una parte importante de nuestro crecimiento.
                    </p>

                    <p>
                        ENos dedicamos a la comercialización de una amplia variedad de productos que acompañan diferentes momentos de la vida, desde artículos para el cuidado y bienestar de pequeñas mascotas hasta elementos decorativos para el hogar, adornos navideños, productos para celebraciones y muchas otras opciones pensadas para satisfacer las necesidades y preferencias de nuestros clientes.
                    </p>

                    <p>
                        Nuestra identidad se fundamenta en el trato familiar, la honestidad y la disposición de escuchar y comprender a cada persona para ofrecerle una atención amable y acorde con sus necesidades. Creemos que una buena experiencia de compra no consiste únicamente en ofrecer productos, sino también en generar confianza, brindar orientación y procurar que cada cliente se sienta valorado.
                    </p>

                    <p>
                        Aunque nuestra historia comenzó y continúa desarrollándose en un entorno doméstico, nuestra visión va más allá de las fronteras del hogar. Trabajamos cada día con la intención de fortalecer nuestra actividad comercial, ampliar nuestras oportunidades y acercar nuestros productos a más personas, conservando siempre la esencia familiar que nos caracteriza.
                    </p>

                    <p>
                        Más que una tienda, somos un emprendimiento familiar que busca construir relaciones duraderas con sus clientes, crecer con responsabilidad y demostrar que, detrás de cada producto y cada servicio, hay personas comprometidas con ofrecer lo mejor. Nuestra razón de ser es hacer de cada compra una experiencia sencilla, agradable y satisfactoria, basada en la confianza, la cercanía y el compromiso con quienes nos eligen.
                    </p>

                </div>


                <div className="company-about-placeholder">

                    <div>
                        <span>
                            Imagen corporativa
                        </span>

                        <strong>
                            Próximamente
                        </strong>
                    </div>

                </div>

            </section>


            {/* =========================
                MISIÓN / VISIÓN
            ========================= */}

            <section className="company-purpose">

                <div className="company-section-title">

                    <span>
                        NUESTRO PROPÓSITO
                    </span>

                    <h2>
                        Lo que nos mueve
                    </h2>

                </div>


                <div className="company-purpose-grid">

                    <article className="company-purpose-card">

                        <div className="company-card-icon">
                            M
                        </div>

                        <h3>
                            Misión
                        </h3>

                        <p>
                            Somos una empresa dedicada a la comercialización de una amplia variedad de productos para el hogar, las celebraciones y el cuidado de pequeñas mascotas, ofreciendo artículos que combinan utilidad, decoración y entretenimiento. Nos comprometemos a brindar una atención cercana, responsable y transparente, proporcionando productos de calidad a precios competitivos, con el propósito de satisfacer las necesidades de nuestros clientes y construir relaciones basadas en la confianza, el respeto y el compromiso.
                        </p>

                    </article>


                    <article className="company-purpose-card">

                        <div className="company-card-icon">
                            V
                        </div>

                        <h3>
                            Visión
                        </h3>

                        <p>
                            Para el año 2030, consolidarnos como una empresa comercial reconocida por la variedad de nuestros productos, la calidad de nuestro servicio y la confianza de nuestros clientes, ampliando progresivamente nuestra oferta comercial y fortaleciendo nuestra presencia en los canales digitales. Aspiramos a crecer de manera sostenible, manteniendo la cercanía que nos caracteriza y convirtiéndonos en una alternativa confiable para quienes buscan productos útiles, decorativos y especiales para diferentes momentos de la vida.
                        </p>

                    </article>

                </div>

            </section>


            {/* =========================
                VALORES
            ========================= */}

            <section className="company-values">

                <div className="company-section-title">

                    <span>
                        NUESTROS VALORES
                    </span>

                    <h2>
                        Principios que nos representan
                    </h2>

                    <p>
                        Trabajamos bajo 4 pilares fundamentales como empresa:
                    </p>

                </div>


                <div className="company-values-grid">

                    <article className="company-value-card">

                        <div className="company-card-icon">
                            ✓
                        </div>

                        <h3>
                            Responsabilidad
                        </h3>

                        <p>
                            Actuamos con compromiso y responsabilidad en cada
                            una de nuestras actividades.
                        </p>

                    </article>


                    <article className="company-value-card">

                        <div className="company-card-icon">
                            ★
                        </div>

                        <h3>
                            Calidad
                        </h3>

                        <p>
                            Buscamos ofrecer productos y servicios que
                            respondan a las expectativas de nuestros clientes.
                        </p>

                    </article>


                    <article className="company-value-card">

                        <div className="company-card-icon">
                            +
                        </div>

                        <h3>
                            Compromiso
                        </h3>

                        <p>
                            Trabajamos para construir relaciones duraderas
                            basadas en confianza.
                        </p>

                    </article>


                    <article className="company-value-card">

                        <div className="company-card-icon">
                            →
                        </div>

                        <h3>
                            Innovación
                        </h3>

                        <p>
                            Buscamos mejorar continuamente nuestra forma de
                            trabajar y ofrecer soluciones.
                        </p>

                    </article>

                </div>

            </section>

        </main>
    );
}

export default Company;