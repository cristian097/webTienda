import { useEffect, useState } from "react";
import "/styles/store.css";
import { useCart } from "../context/CartContext";

function getProductImages(product) {
    if (product?.images?.length) return product.images.map(image => typeof image === "string" ? image : image.url).filter(Boolean);
    return product?.imageUrl ? [product.imageUrl] : [];
}

function ProductGalleryModal({ product, onClose, addToCart }) {
    const images = getProductImages(product);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKeyDown = event => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowRight") setActiveIndex(index => (index + 1) % images.length);
            if (event.key === "ArrowLeft") setActiveIndex(index => (index - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [onClose, images.length]);

    return (
        <div className="product-modal-backdrop" role="presentation" onMouseDown={event => {
            if (event.target === event.currentTarget) onClose();
        }}>
            <section className="product-modal" role="dialog" aria-modal="true" aria-label={`Detalle de ${product.name}`}>
                <button className="product-modal-close" onClick={onClose} aria-label="Cerrar detalle">×</button>
                <div className="product-modal-gallery">
                    <div className="product-modal-main-image">
                        {images.length ? <img src={images[activeIndex]} alt={`${product.name}, fotografía ${activeIndex + 1}`} /> : <div className="product-modal-no-image">Imagen no disponible</div>}
                        {images.length > 1 && <>
                            <button className="product-gallery-arrow product-gallery-prev" onClick={() => setActiveIndex(index => (index - 1 + images.length) % images.length)} aria-label="Imagen anterior">‹</button>
                            <button className="product-gallery-arrow product-gallery-next" onClick={() => setActiveIndex(index => (index + 1) % images.length)} aria-label="Imagen siguiente">›</button>
                            <span className="product-gallery-counter">{activeIndex + 1} / {images.length}</span>
                        </>}
                    </div>
                    {images.length > 1 && <div className="product-modal-thumbnails">
                        {images.map((image, index) => <button key={`${image}-${index}`} className={index === activeIndex ? "selected" : ""} onClick={() => setActiveIndex(index)} aria-label={`Ver fotografía ${index + 1}`}>
                            <img src={image} alt="" />
                        </button>)}
                    </div>}
                </div>
                <div className="product-modal-info">
                    <span className="product-modal-category">{product.category?.name || "Producto"}</span>
                    <h2>{product.name}</h2>
                    <p className="product-modal-price">${Number(product.price).toLocaleString("es-CO")}</p>
                    <p className="product-modal-description">{product.description || "Consulta con nosotros para conocer más detalles de este producto."}</p>
                    <button className="product-modal-add-button" onClick={() => { addToCart(product); onClose(); }}>Agregar al carrito</button>
                </div>
            </section>
        </div>
    );
}

function Store() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCategories = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/categories");
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "No fue posible cargar las categorías.");
            setCategories(data.filter(category => category.active));
        } catch (err) {
            console.error(err);
            setError("No fue posible cargar las categorías.");
        }
    };

    const loadProducts = async (categoryId = "") => {
        try {
            setLoading(true);
            setError("");
            let url = "http://localhost:3000/api/products";
            if (categoryId) url += `?categoryId=${encodeURIComponent(categoryId)}`;
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "No fue posible cargar los productos.");
            setProducts(data);
        } catch (err) {
            console.error(err);
            setError(err.message || "No fue posible conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const handleCategoryChange = event => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        loadProducts(categoryId);
    };

    return (
        <main className="store">
            <div className="store-heading">
                <span className="store-eyebrow">CATÁLOGO</span>
                <h1>Nuestra tienda</h1>
                <p>Encuentra los productos disponibles y explora sus detalles y fotografías.</p>
            </div>
            <section className="store-filter">
                <label htmlFor="category">Filtrar por categoría:</label>
                <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">Todas las categorías</option>
                    {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
            </section>

            {loading && <p className="store-message">Cargando productos...</p>}
            {error && <p className="store-message store-error">{error}</p>}
            {!loading && !error && products.length === 0 && <p className="store-message">No hay productos disponibles.</p>}

            {!loading && !error && products.length > 0 && <section className="product-grid">
                {products.map(product => {
                    const images = getProductImages(product);
                    return <article key={product.id} className="product-card">
                        <button className="product-card-image-button" onClick={() => setSelectedProduct(product)} aria-label={`Ver detalles de ${product.name}`}>
                            {images[0] ? <img src={images[0]} alt={product.name} loading="lazy" /> : <span className="product-card-image-placeholder">Imagen no disponible</span>}
                            {images.length > 1 && <span className="product-card-image-count">{images.length} fotos</span>}
                        </button>
                        <div className="product-card-content">
                            <p className="producto-category">{product.category?.name}</p>
                            <h2>{product.name}</h2>
                            <p className="product-card-description">{product.description || "Consulta los detalles de este producto."}</p>
                            <p className="product-price"><strong>${Number(product.price).toLocaleString("es-CO")}</strong></p>
                            <div className="product-card-actions">
                                <button className="product-details-button" onClick={() => {setSelectedProduct(product)}}>Ver detalles</button>
                                <button className="product-add-button" onClick={() => addToCart(product)}>Agregar al carrito</button>
                            </div>
                        </div>
                    </article>;
                })}
            </section>}
            {selectedProduct && <ProductGalleryModal product={selectedProduct} onClose={() => setSelectedProduct(null)} addToCart={addToCart} />}
        </main>
    );
}

export default Store;
