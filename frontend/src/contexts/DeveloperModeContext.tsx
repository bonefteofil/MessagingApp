import { createContext, useState } from "react";

export const DeveloperModeContext = createContext<{
    developerMode: boolean;
    setDeveloperMode: (mode: boolean) => void;
}>({ developerMode: false, setDeveloperMode: () => {} });

export const DeveloperModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [developerMode, setDeveloperMode] = useState<boolean>(false);

    return (
        <DeveloperModeContext.Provider value={{ developerMode, setDeveloperMode }}>
            {children}
        </DeveloperModeContext.Provider>
    );
}