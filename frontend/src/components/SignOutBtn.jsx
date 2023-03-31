import { useNavigate } from "react-router-dom";

export default ({ btnClass = "btn btn-danger", btnValue = "Sign Out" }) => {
    let navigate = useNavigate();
    let handleClick = () => {
        import("../helper/signOut").then((module) => {
            module.SignOut();
        });
        navigate("/login");
    };

    return (
        <button style={{ marginRight: "15px" }} className={btnClass} onClick={handleClick}>
            <i class="fa-solid fa-power-off me-2"></i>
            {btnValue}
        </button>
    );
};
