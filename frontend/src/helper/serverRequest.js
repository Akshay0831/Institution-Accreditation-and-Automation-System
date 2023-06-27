import { auth } from "../firebase";

const serverRequest = async (url, method, body, options) => {
    await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe(); // Unsubscribe to prevent multiple calls
            resolve(user); // Resolve the promise if the user is signed in
        });
    });

    const token = await auth?.currentUser?.getIdToken();

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