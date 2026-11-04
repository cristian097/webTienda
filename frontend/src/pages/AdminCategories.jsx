import { useEffect, useState } from "react";
import "/styles/adminCategories.css";
import AdminBackButton from "../components/AdminBackButton";

function AdminCategories() {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState("");

    const loadCategories = async () => {

        try {

            const response = await fetch(
                "http://localhost:3000/api/categories"
            );

            const data = await response.json();

            setCategories(data);

        } catch (error) {

            console.error(error);

            setError(
                "No fue posible cargar las categorías."
            );
        }
    };


    useEffect(() => {
        loadCategories();
    }, []);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        try {

            const url = editingId
                ? `http://localhost:3000/api/categories/${editingId}`
                : "http://localhost:3000/api/categories";

            const method = editingId
                ? "PUT"
                : "POST";

            const token = localStorage.getItem("token");

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        description
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.error ||
                    "No fue posible guardar la categoría."
                );

                return;
            }

            setName("");
            setDescription("");
            setEditingId(null);

            await loadCategories();

        } catch (error) {

            console.error(error);

            setError(
                "Error de conexión con el servidor."
            );
        }
    };


    const handleEdit = (category) => {

        setEditingId(category.id);

        setName(category.name);

        setDescription(
            category.description || ""
        );
    };


    const handleToggleStatus = async (category) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:3000/api/categories/${category.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        active: !category.active
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.error ||
                    "No fue posible cambiar el estado."
                );

                return;
            }

            await loadCategories();

        } catch (error) {

            console.error(error);

            setError(
                "Error de conexión con el servidor."
            );
        }
    };


    const cancelEdit = () => {

        setEditingId(null);

        setName("");

        setDescription("");
    };


    return (


        <main className="admin-categories-page">

            <AdminBackButton />

            <header className="admin-categories-header">

                <div>
                    <span>
                        GESTIÓN DE LA TIENDA
                    </span>

                     

                    <h1>
                        Administración de categorías
                    </h1>

                    <p>
                        Crea y administra las categorías disponibles
                        para organizar los productos de tu tienda.
                    </p>
                </div>

                <div className="admin-categories-count">
                    <strong>
                        {categories.length}
                    </strong>

                    <span>
                        Categorías
                    </span>
                </div>

            </header>


            {error && (
                <div className="admin-categories-error">
                    <span>!</span>

                    <p>
                        {error}
                    </p>
                </div>
            )}


            <section className="admin-category-form-card">

                <div className="admin-category-form-header">

                    <div className="admin-category-form-icon">
                        {editingId ? "✎" : "+"}
                    </div>

                    <div>
                        <h2>
                            {editingId
                                ? "Editar categoría"
                                : "Nueva categoría"}
                        </h2>

                        <p>
                            {editingId
                                ? "Modifica la información de la categoría seleccionada."
                                : "Agrega una nueva categoría a tu tienda."}
                        </p>
                    </div>

                </div>


                <form
                    className="admin-category-form"
                    onSubmit={handleSubmit}
                >

                    <div className="admin-category-form-fields">

                        <div className="admin-category-form-group">

                            <label htmlFor="name">
                                Nombre
                            </label>

                            <input
                                id="name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="Ej. Alimentos"
                                required
                            />

                        </div>


                        <div className="admin-category-form-group">

                            <label htmlFor="description">
                                Descripción
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="Describe brevemente esta categoría..."
                                rows="3"
                            />

                        </div>

                    </div>


                    <div className="admin-category-form-actions">

                        <button
                            type="submit"
                            className="admin-category-save-button"
                        >
                            {editingId
                                ? "Actualizar categoría"
                                : "Crear categoría"}
                        </button>


                        {editingId && (
                            <button
                                type="button"
                                className="admin-category-cancel-button"
                                onClick={cancelEdit}
                            >
                                Cancelar
                            </button>
                        )}

                    </div>

                </form>

            </section>


            <section className="admin-category-list-section">

                <div className="admin-category-list-header">

                    <div>
                        <span>
                            CATEGORÍAS
                        </span>

                        <h2>
                            Categorías existentes
                        </h2>
                    </div>

                </div>


                {categories.length === 0 ? (

                    <div className="admin-category-empty">

                        <div>
                            ◈
                        </div>

                        <h3>
                            No existen categorías
                        </h3>

                        <p>
                            Crea tu primera categoría utilizando
                            el formulario superior.
                        </p>

                    </div>

                ) : (

                    <div className="admin-category-table-wrapper">

                        <table className="admin-category-table">

                            <thead>

                                <tr>
                                    <th>
                                        Categoría
                                    </th>

                                    <th>
                                        Descripción
                                    </th>

                                    <th>
                                        Estado
                                    </th>

                                    <th>
                                        Acciones
                                    </th>
                                </tr>

                            </thead>


                            <tbody>

                                {categories.map((category) => (

                                    <tr key={category.id}>

                                        <td>
                                            <strong>
                                                {category.name}
                                            </strong>
                                        </td>


                                        <td>
                                            <span className="admin-category-description">
                                                {category.description ||
                                                    "Sin descripción"}
                                            </span>
                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    category.active
                                                        ? "category-status category-status-active"
                                                        : "category-status category-status-inactive"
                                                }
                                            >
                                                {category.active
                                                    ? "Activa"
                                                    : "Inactiva"}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="admin-category-actions">

                                                <button
                                                    className="category-edit-button"
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                >
                                                    Editar
                                                </button>


                                                <button
                                                    className={
                                                        category.active
                                                            ? "category-status-button category-disable-button"
                                                            : "category-status-button category-enable-button"
                                                    }
                                                    onClick={() =>
                                                        handleToggleStatus(category)
                                                    }
                                                >
                                                    {category.active
                                                        ? "Desactivar"
                                                        : "Activar"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </main>
    );
}

export default AdminCategories;