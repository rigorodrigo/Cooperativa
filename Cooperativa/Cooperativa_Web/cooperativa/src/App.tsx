import './App.css'
import {Navbar} from "./components/Navbar.tsx";
import {AppRoutes} from "./router";

function App() {
    return (
        <div>
            <Navbar/>
            <AppRoutes/>
        </div>
    )
}

export default App