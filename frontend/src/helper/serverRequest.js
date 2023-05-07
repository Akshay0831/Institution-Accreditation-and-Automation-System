import { auth } from "../firebase-config";

const serverRequest = async (url, method, body, options) => {
    const token = await auth?.currentUser?.getIdToken() || sessionStorage.getItem("token");

    if (method && !["GET", "POST", "PUT", "DELETE"].includes(method.toUpperCase())) {
        return Promise.resolve("Invalid request");
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options,
    };

    const requestOptions = {
        method: method || "GET",
        headers,
    };

    const result = await fetch(url, (method == "GET") ? requestOptions : { ...requestOptions, body: JSON.stringify(body) });
    return result;
};

export default serverRequest;