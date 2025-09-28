import { createContext, useEffect, useState } from "react";
import type UserScheme from "../types/userScheme";

export const CurrentUserContext = createContext<{
    currentUser: UserScheme | null;
    setCurrentUser: (user: UserScheme | null) => void;
}>({ currentUser: null, setCurrentUser: () => {} });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserScheme | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (currentUser)
            localStorage.setItem("user", JSON.stringify(currentUser));
        else
            localStorage.removeItem("user");
    }, [currentUser]);

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
}
