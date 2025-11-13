import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { logoutUser } from "@user/api";

import EditingMessageContext from "@messages/Context";

import ResponsiveCard from "@components/ResponsiveCard";


export default function LogoutRoute() {
    const { setEditingMessage } = useContext(EditingMessageContext);

    const [cookies] = useCookies(['userId']);
    const logoutMutation = logoutUser();
    const navigate = useNavigate();

    useEffect(() => {
        setEditingMessage(null);
        logoutMutation.mutate();
    }, []);

    useEffect(() => {
        if (!cookies.userId)
            navigate("/login", { replace: true });

    }, [cookies.userId]);

    return <ResponsiveCard title="Logging out..."/>;
}