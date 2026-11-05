const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.error("No se ha configurado VITE_API_URL");
}

export default API_URL;