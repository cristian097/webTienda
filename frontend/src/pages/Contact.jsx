import "/styles/contact.css";

function Contact() {
    return (
        <main className="contact-page">

            <section className="contact-hero">
                <div className="contact-hero-content">
                    <span>ESTAMOS PARA AYUDARTE</span>

                    <h1>
                        Ponte en contacto con nosotros
                    </h1>

                    <p>
                        ¿Tienes alguna pregunta, necesitas información
                        sobre nuestros productos o quieres realizar una
                        consulta? Escríbenos y estaremos encantados de atenderte.
                    </p>
                </div>
            </section>


            <section className="contact-content">

                <div className="contact-info">

                    <span className="contact-section-label">
                        CONTÁCTANOS
                    </span>

                    <h2>
                        Hablemos de lo que necesitas
                    </h2>

                    <p>
                        Completa el formulario y envíanos tu mensaje.
                        Nuestro equipo podrá ponerse en contacto contigo
                        para brindarte la información que necesitas.
                    </p>

                    <div className="contact-info-list">

                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                ✉
                            </div>

                            <div>
                                <strong>
                                    Correo electrónico
                                </strong>

                                <span>
                                    contacto@mgraphix.com
                                </span>
                            </div>
                        </div>


                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                ☎
                            </div>

                            <div>
                                <strong>
                                    Teléfono
                                </strong>

                                <span>
                                    +57 320 920 0939
                                </span>
                            </div>
                        </div>


                        <div className="contact-info-item">
                            <div className="contact-info-icon">
                                ⌖
                            </div>

                            <div>
                                <strong>
                                    Atención
                                </strong>

                                <span>
                                    Estamos disponibles para atender tus consultas.
                                </span>
                            </div>
                        </div>

                    </div>

                </div>


                <div className="contact-form-card">

                    <div className="contact-form-header">
                        <h2>
                            Envíanos un mensaje
                        </h2>

                        <p>
                            Completa los siguientes campos.
                        </p>
                    </div>


                    <form>

                        <div className="contact-form-group">
                            <label htmlFor="name">
                                Nombre completo
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                required
                            />
                        </div>


                        <div className="contact-form-group">
                            <label htmlFor="email">
                                Correo electrónico
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>


                        <div className="contact-form-group">
                            <label htmlFor="phone">
                                Teléfono
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                placeholder="Ej. 315 123 4567"
                                required
                            />
                        </div>


                        <div className="contact-form-group">
                            <label htmlFor="message">
                                Mensaje
                            </label>

                            <textarea
                                id="message"
                                placeholder="Escribe aquí tu mensaje..."
                                rows="5"
                                required
                            />
                        </div>


                        <label className="contact-checkbox">
                            <input
                                id="dataTreatment"
                                type="checkbox"
                                required
                            />

                            <span>
                                Acepto el tratamiento de mis datos personales.
                            </span>
                        </label>


                        <button
                            type="submit"
                            className="contact-submit-button"
                        >
                            Enviar mensaje
                        </button>

                    </form>

                </div>

            </section>

        </main>
    );
}

export default Contact;