import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default () => {
    let navigate = useNavigate();
    let handleClick = () => {
        let auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log("Logged out!");
                sessionStorage.clear();
                navigate("/login");
            })
            .catch(() => {
                console.error("Couldn't log out");
            });
    };

    return (
        <button className="btn btn-danger" onClick={handleClick}>
            Sign Out
        </button>
    );
};
