import {Link} from "react-router-dom";
import '../index.css';

export const Navbar = () => (
    <nav className="navbar">
        <Link to="/" >Início </Link>
        <Link to="/clientes">Clientes </Link>
        <Link to="/culturas">Culturas </Link>
        <Link to="/sacas">Sacas </Link>
    </nav>
);