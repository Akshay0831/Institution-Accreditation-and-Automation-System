import SignIn from "./components/SignIn";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<SignIn />} />
            </Routes>
        </Router>
    );
}

export default App;
