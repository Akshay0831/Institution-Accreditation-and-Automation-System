import SignIn from "./components/SignIn";
import Home from "./components/Home.js";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route exact path="/login" element={<SignIn />} />
                <Route exact path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
