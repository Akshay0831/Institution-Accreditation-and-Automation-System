import { auth } from "../firebase-config";

let serverRequest = async (url, method, body, options) => {
    const token = await auth?.currentUser?.getIdToken() || sessionStorage.getItem("token");

    if (method &&
        method.toUpperCase() != 'GET' &&
        method.toUpperCase() != 'POST' &&
        method.toUpperCase() != 'PUT' &&
        method.toUpperCase() != 'DELETE' &&
        !token) {
        return Promise.resolve("Invalid request");
    } else {
        method = method ? method : "GET";
        let obj = {
            method: method,
            headers: { ...options, "Authorization": `Bearer ${token}` }
        };
        const result = fetch(url, method == "GET" ? obj : { ...obj, body: JSON.stringify(body) });
        return result;
    }
}

export default serverRequest;