import { createContext, useEffect, useState } from "react";


const DeveloperModeContext = createContext<{
    developerMode: boolean;
    setDeveloperMode: (mode: boolean) => void;
}>({ developerMode: false, setDeveloperMode: () => {} });

export const DeveloperModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [developerMode, setDeveloperMode] = useState<boolean>(() => {
        const saved = localStorage.getItem("developerMode");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem("developerMode", JSON.stringify(developerMode));
    }, [developerMode]);

    return (
        <DeveloperModeContext.Provider value={{ developerMode, setDeveloperMode }}>
            {children}
        </DeveloperModeContext.Provider>
    );
}

export default DeveloperModeContext;