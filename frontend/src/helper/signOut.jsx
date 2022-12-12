import { getAuth, signOut } from "firebase/auth";

export const SignOut = () => {
    let auth = getAuth();
    signOut(auth)
        .then(() => {
            console.log("Logged out!");
            sessionStorage.clear();
        })
        .catch(() => {
            console.error("Couldn't log out");
        });
};
