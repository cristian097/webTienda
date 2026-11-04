import { Link } from "react-router-dom";
import "/styles/admin.css";

function Admin() {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <main className="admin-page">

            <section className="admin-header">

                <div>
                    <span className="admin-section-label">
                        ÁREA ADMINISTRATIVA
                    </span>

                    <h1>
                        Panel de administración
                    </h1>

                    <p>
                        Bienvenido. Desde aquí puedes gestionar
                        el contenido de tu tienda.
                    </p>
                </div>

                <div className="admin-user">
                    <div className="admin-user-icon">
                        👤
                    </div>

                    <div>
                        <span>
                            Usuario
                        </span>

                        <strong>
                            Administrador
                        </strong>
                    </div>
                </div>

            </section>


            <section className="admin-content">

                <div className="admin-section-title">
                    <span>
                        GESTIÓN DE LA TIENDA
                    </span>

                    <h2>
                        ¿Qué deseas administrar?
                    </h2>
                </div>


                <div className="admin-cards">

                    <article className="admin-card">

                        <div className="admin-card-icon">
                            ◈
                        </div>

                        <div className="admin-card-content">

                            <h3>
                                Categorías
                            </h3>

                            <p>
                                Crea, modifica y administra las categorías
                                disponibles en tu tienda.
                            </p>

                            <Link
                                to="/admin/categorias"
                                className="admin-card-button"
                            >
                                Administrar categorías
                                <span>→</span>
                            </Link>

                        </div>

                    </article>


                    <article className="admin-card">

                        <div className="admin-card-icon">
                            ▦
                        </div>

                        <div className="admin-card-content">

                            <h3>
                                Productos
                            </h3>

                            <p>
                                Agrega, edita, consulta y administra
                                los productos de tu tienda.
                            </p>

                            <Link
                                to="/admin/productos"
                                className="admin-card-button"
                            >
                                Administrar productos
                                <span>→</span>
                            </Link>

                        </div>

                    </article>

                </div>

            </section>


            <section className="admin-bottom">

                <div>
                    <span>
                        SESIÓN ACTIVA
                    </span>

                    <p>
                        Tu sesión de administrador está activa.
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="admin-logout-button"
                >
                    Cerrar sesión
                </button>

            </section>

        </main>
    );
}

export default Admin;