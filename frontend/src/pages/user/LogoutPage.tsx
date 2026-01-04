import { useContext, useEffect } from "react";
import { logoutUser } from "@api/auth";

import EditingMessageContext from "@messages/components/EditingMessageContext";

import ResponsiveCard from "@components/ResponsiveCard";


export default function LogoutPage() {
    const { setEditingMessage } = useContext(EditingMessageContext);
    const logoutMutation = logoutUser();

    useEffect(() => {
        setEditingMessage(null);
        logoutMutation.mutate();
    }, []);

    return <ResponsiveCard title="Logging out..."/>;
}