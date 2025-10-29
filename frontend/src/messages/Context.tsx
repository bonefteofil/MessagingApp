import { createContext, useState } from "react";
import type MessageScheme from "./schema";

export const EditingMessageContext = createContext<{
    editingMessage: MessageScheme | null;
    setEditingMessage: (message: MessageScheme | null) => void;
}>({ editingMessage: null, setEditingMessage: () => {} });

export const EditingMessageProvider = ({ children }: { children: React.ReactNode }) => {
    const [editingMessage, setEditingMessage] = useState<MessageScheme | null>(null);

    return (
        <EditingMessageContext.Provider value={{ editingMessage, setEditingMessage }}>
            {children}
        </EditingMessageContext.Provider>
    );
}