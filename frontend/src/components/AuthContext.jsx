import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext({
    user: null,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const tokenResult = await auth.currentUser.getIdTokenResult();
                setUser({
                    uid: user.uid,
                    userMail: user.email,
                    userType: tokenResult.claims.userType,
                    token: tokenResult.token,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser: setUser }}>
            {children}
        </AuthContext.Provider>
    );
};