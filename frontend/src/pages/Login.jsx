import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/styles/login.css";

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Error al iniciar sesión"
                );
                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/admin");

        } catch (error) {
            console.error(error);

            setError(
                "No fue posible conectar con el servidor."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            <section className="login-card">

                <div className="login-icon">
                    🔐
                </div>

                <div className="login-header">
                    <span>
                        ÁREA RESTRINGIDA
                    </span>

                    <h1>
                        Acceso administrador
                    </h1>

                    <p>
                        Ingresa tus credenciales para acceder
                        al panel de administración.
                    </p>
                </div>


                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="login-form-group">
                        <label htmlFor="username">
                            Usuario
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Ingresa tu usuario"
                            autoComplete="username"
                            required
                        />
                    </div>


                    <div className="login-form-group">
                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Ingresa tu contraseña"
                            autoComplete="current-password"
                            required
                        />
                    </div>


                    {error && (
                        <div className="login-error">
                            <span>!</span>
                            <p>
                                {error}
                            </p>
                        </div>
                    )}


                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"}
                    </button>

                </form>


                <div className="login-security">
                    <span>🔒</span>
                    <p>
                        Acceso protegido para administradores autorizados.
                    </p>
                </div>

            </section>

        </main>
    );
}

export default Login;