import { createContext, useState } from "react";


const CurrentUserIdContext = createContext<{
    currentUserId: number | null;
    setCurrentUserId: (userId: number | null) => void;
}>({ currentUserId: null, setCurrentUserId: () => {} });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    return (
        <CurrentUserIdContext.Provider value={{ currentUserId, setCurrentUserId }}>
            {children}
        </CurrentUserIdContext.Provider>
    );
}

export default CurrentUserIdContext;