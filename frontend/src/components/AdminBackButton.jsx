
import { Link } from "react-router-dom";
import "./AdminBackButton.css";

function AdminBackButton() {
    return (
        <div className="admin-back-container">
            <Link to="/admin" className="admin-back-button">
                <span aria-hidden="true">←</span>
                <span>Volver al panel administrativo</span>
            </Link>
        </div>
    );
}

export default AdminBackButton;
