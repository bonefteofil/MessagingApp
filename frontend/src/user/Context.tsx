import { createContext, useState } from "react";

import type { UserScheme } from "./schema";


const CurrentUserContext = createContext<{
    currentUser: UserScheme | null;
    setCurrentUser: (user: UserScheme | null) => void;
}>({ currentUser: null, setCurrentUser: () => {} });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserScheme | null>(null);

    return (
        <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
}

export default CurrentUserContext;