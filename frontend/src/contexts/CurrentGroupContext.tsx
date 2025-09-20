import { createContext, useState } from "react";
import type GroupScheme from "../types/groupScheme";

export const CurrentGroupContext = createContext<{
    currentGroup: GroupScheme | null;
    setCurrentGroup: (group: GroupScheme | null) => void;
}>({ currentGroup: null, setCurrentGroup: () => {} });

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentGroup, setCurrentGroup] = useState<GroupScheme | null>(null);

    return (
        <CurrentGroupContext value={{ currentGroup, setCurrentGroup }}>
            {children}
        </CurrentGroupContext>
    );
}