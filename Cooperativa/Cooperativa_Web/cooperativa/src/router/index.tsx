import {Routes, Route} from "react-router";
import ClientesPage from "../pages/Cliente.tsx";
import CulturasPage from "../pages/Cultura.tsx";
import SacasPage from "../pages/Saca.tsx";
import HomePage from "../pages/Home.tsx";

export function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/culturas" element={<CulturasPage />} />
            <Route path="/sacas" element={<SacasPage />} />
        </Routes>
    )
}
