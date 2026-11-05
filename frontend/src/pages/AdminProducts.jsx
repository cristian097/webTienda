
import { useEffect, useRef, useState } from "react";
import "/styles/adminProducts.css";
import AdminBackButton from "../components/AdminBackButton";
import API_URL from "../api";

const API = `${API_URL}/api/products`;

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const fileInput = useRef(null);

    const token = () => localStorage.getItem("token");

    const loadProducts = async () => {
        const response = await fetch(`${API}/admin/all`, {
            headers: { Authorization: `Bearer ${token()}` }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "No fue posible cargar los productos.");
        }

        setProducts(data);
    };

    const loadCategories = async () => {
        const response = await fetch(`${API_URL}/api/categories`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "No fue posible cargar las categorías.");
        }

        setCategories(data);
    };

    useEffect(() => {
        Promise.all([loadProducts(), loadCategories()])
            .catch(err => setError(err.message));
    }, []);

    useEffect(() => () => filePreviews.forEach(URL.revokeObjectURL), [filePreviews]);

    const handleFilesChange = event => {
        const files = Array.from(event.target.files || []);
        const remainingSlots = 4 - existingImages.length;

        if (files.length > remainingSlots) {
            setError(`Puedes tener máximo 4 imágenes. Actualmente puedes añadir ${remainingSlots}.`);
            event.target.value = "";
            return;
        }

        if (files.some(file => !file.type.startsWith("image/"))) {
            setError("Selecciona únicamente archivos de imagen.");
            event.target.value = "";
            return;
        }

        if (files.some(file => file.size > 5 * 1024 * 1024)) {
            setError("Cada imagen debe pesar máximo 5 MB.");
            event.target.value = "";
            return;
        }

        setError("");
        setSelectedFiles(files);
        setFilePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const removeExistingImage = index => {
        setExistingImages(current => current.filter((_, i) => i !== index));
        setError("");
    };

    const clearForm = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setExistingImages([]);
        setSelectedFiles([]);
        setFilePreviews([]);

        if (fileInput.current) fileInput.current.value = "";

        setError("");
    };

    const handleEdit = product => {
        setEditingId(product.id);
        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(String(product.price));
        setCategoryId(String(product.categoryId));

        const images = product.images?.length
            ? product.images.map(image => ({
                url: image.url,
                publicId: image.publicId || null
            }))
            : (product.imageUrl
                ? [{ url: product.imageUrl, publicId: null }]
                : []);

        setExistingImages(images);
        setSelectedFiles([]);
        setFilePreviews([]);

        if (fileInput.current) fileInput.current.value = "";

        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setError("");

        const totalImages = existingImages.length + selectedFiles.length;

        if (totalImages < 2 || totalImages > 4) {
            setError("Cada producto debe tener entre 2 y 4 imágenes.");
            return;
        }

        setSaving(true);

        try {
            let uploadedImages = [];

            if (selectedFiles.length) {
                const formData = new FormData();

                selectedFiles.forEach(file => formData.append("images", file));

                const uploadResponse = await fetch(`${API}/upload-images`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token()}` },
                    body: formData
                });

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    throw new Error(uploadData.error || "No fue posible subir las imágenes.");
                }

                uploadedImages = uploadData.images || [];
            }

            const imageRecords = [
                ...existingImages,
                ...uploadedImages.map(image => ({
                    url: image.url,
                    publicId: image.publicId
                }))
            ];

            const payload = {
                name: name.trim(),
                description,
                price,
                categoryId,
                imageUrls: imageRecords.map(image => image.url),
                imagePublicIds: imageRecords.map(image => image.publicId || null)
            };

            const response = await fetch(
                editingId ? `${API}/${editingId}` : API,
                {
                    method: editingId ? "PUT" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token()}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No fue posible guardar el producto.");
            }

            clearForm();
            await loadProducts();

        } catch (err) {
            console.error(err);
            setError(err.message || "Error de conexión con el servidor.");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async product => {
        setError("");

        try {
            const response = await fetch(`${API}/${product.id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token()}`
                },
                body: JSON.stringify({ active: !product.active })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "No fue posible cambiar el estado.");
            }

            await loadProducts();

        } catch (err) {
            setError(err.message || "Error de conexión con el servidor.");
        }
    };

    return (
        <main className="admin-products-page">
            <AdminBackButton />

            <header className="admin-products-header">
                <div>
                    <span>GESTIÓN DE LA TIENDA</span>
                    <h1>Administración de productos</h1>
                    <p>Crea, modifica y administra los productos y sus fotografías.</p>
                </div>

                <div className="admin-products-count">
                    <strong>{products.length}</strong>
                    <span>Productos</span>
                </div>
            </header>

            {error && (
                <div className="admin-products-error" role="alert">
                    <span>!</span>
                    <p>{error}</p>
                </div>
            )}

            <section className="admin-product-form-card">
                <div className="admin-product-form-header">
                    <div className="admin-product-form-icon">
                        {editingId ? "✎" : "+"}
                    </div>

                    <div>
                        <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
                        <p>
                            {editingId
                                ? "Actualiza los datos y administra la galería de imágenes."
                                : "Completa los datos y selecciona entre 2 y 4 fotografías."}
                        </p>
                    </div>
                </div>

                <form className="admin-product-form" onSubmit={handleSubmit}>
                    <div className="admin-product-form-grid">
                        <div className="admin-product-form-group">
                            <label htmlFor="product-name">Nombre</label>
                            <input
                                id="product-name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ej. Producto Premium"
                                required
                            />
                        </div>

                        <div className="admin-product-form-group">
                            <label htmlFor="product-category">Categoría</label>
                            <select
                                id="product-category"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una categoría</option>

                                {categories.filter(category => category.active).map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="admin-product-form-group">
                            <label htmlFor="product-price">Precio</label>

                            <div className="admin-price-input">
                                <span>$</span>
                                <input
                                    id="product-price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-product-form-group admin-product-description">
                            <label htmlFor="product-description">Descripción</label>
                            <textarea
                                id="product-description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Describe las características del producto..."
                                rows="4"
                            />
                        </div>
                    </div>

                    <section className="product-image-uploader">
                        <div className="product-image-uploader-heading">
                            <div>
                                <h3>Fotografías del producto</h3>
                                <p>JPG, PNG, WEBP o AVIF · máximo 5 MB por imagen</p>
                            </div>

                            <span>{existingImages.length + selectedFiles.length} de 4</span>
                        </div>

                        <div className="product-image-preview-grid">
                            {existingImages.map((image, index) => (
                                <div
                                    className="product-image-preview"
                                    key={`${image.url}-${index}`}
                                >
                                    <img
                                        src={image.url}
                                        alt={`Fotografía existente ${index + 1}`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        aria-label={`Eliminar imagen ${index + 1}`}
                                    >
                                        ×
                                    </button>

                                    <small>
                                        {index === 0
                                            ? "Imagen principal si se guarda primero"
                                            : `Imagen ${index + 1}`}
                                    </small>
                                </div>
                            ))}

                            {filePreviews.map((src, index) => (
                                <div className="product-image-preview" key={src}>
                                    <img
                                        src={src}
                                        alt={`Nueva fotografía ${index + 1}`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFiles(files =>
                                                files.filter((_, i) => i !== index)
                                            );

                                            setFilePreviews(previews =>
                                                previews.filter((_, i) => i !== index)
                                            );

                                            if (fileInput.current) {
                                                fileInput.current.value = "";
                                            }
                                        }}
                                        aria-label={`Quitar nueva imagen ${index + 1}`}
                                    >
                                        ×
                                    </button>

                                    <small>Nueva imagen</small>
                                </div>
                            ))}

                            {existingImages.length + selectedFiles.length < 4 && (
                                <button
                                    className="product-image-add"
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <span>＋</span>
                                    <strong>Añadir imagen</strong>
                                    <small>Desde tu computador</small>
                                </button>
                            )}
                        </div>

                        <input
                            ref={fileInput}
                            className="product-image-file-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            multiple
                            onChange={handleFilesChange}
                        />

                        <p className="product-image-hint">
                            Selecciona entre 2 y 4 imágenes en total.
                            Puedes retirar las fotos antes de guardar.
                        </p>
                    </section>

                    <div className="admin-product-form-actions">
                        <button
                            type="submit"
                            className="admin-product-save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Guardando..."
                                : editingId
                                    ? "Actualizar producto"
                                    : "Crear producto"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-product-cancel-button"
                                onClick={clearForm}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="admin-product-list-section">
                <div className="admin-product-list-header">
                    <div>
                        <span>PRODUCTOS</span>
                        <h2>Productos existentes</h2>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="admin-product-empty">
                        <div>▦</div>
                        <h3>No existen productos</h3>
                        <p>
                            Crea tu primer producto utilizando el formulario superior.
                        </p>
                    </div>
                ) : (
                    <div className="admin-product-table-wrapper">
                        <table className="admin-product-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Imágenes</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map(product => {
                                    const images = product.images?.length
                                        ? product.images
                                        : (product.imageUrl
                                            ? [{ url: product.imageUrl }]
                                            : []);

                                    return (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="admin-product-name">
                                                    {images[0]?.url ? (
                                                        <img
                                                            className="admin-product-thumbnail"
                                                            src={images[0].url}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="admin-product-thumbnail admin-product-thumbnail-empty">
                                                            ▧
                                                        </div>
                                                    )}

                                                    <div>
                                                        <strong>{product.name}</strong>
                                                        <span>
                                                            {product.description || "Sin descripción"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="admin-product-category">
                                                {product.category?.name || "—"}
                                            </td>

                                            <td className="admin-product-price">
                                                ${Number(product.price).toLocaleString("es-CO")}
                                            </td>

                                            <td>{images.length}</td>

                                            <td>
                                                <span
                                                    className={`product-status ${
                                                        product.active
                                                            ? "product-status-active"
                                                            : "product-status-inactive"
                                                    }`}
                                                >
                                                    {product.active ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-product-actions">
                                                    <button
                                                        className="product-edit-button"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        className={`product-status-button ${
                                                            product.active
                                                                ? "product-disable-button"
                                                                : "product-enable-button"
                                                        }`}
                                                        onClick={() => handleToggleStatus(product)}
                                                    >
                                                        {product.active ? "Desactivar" : "Activar"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminProducts;
