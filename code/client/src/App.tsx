import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { UserDetails } from "./user-details";
import Home from "./Home";
import Modal from "react-modal";

Modal.setAppElement("#root");

const App: React.FC = () => {
    return (
        <Router>
            <h1 className="text-3xl font-bold mt-4 text-center">SimpleCrm</h1>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Home />} />
                <Route path="/users/:id" element={<UserDetails />} />
            </Routes>
        </Router>
    );
};

export default App;
