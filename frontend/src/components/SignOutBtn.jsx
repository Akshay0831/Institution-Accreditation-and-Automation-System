import { useNavigate } from "react-router-dom";
import signOut from "../helper/signOut";

export default ({ btnClass = "btn btn-danger", btnValue = "Sign Out" }) => {
    let navigate = useNavigate();
    let handleClick = () => {
        signOut();
        navigate("/login");
    };

    return (
        <button className={btnClass} onClick={handleClick}>
            {btnValue}
        </button>
    );
};
