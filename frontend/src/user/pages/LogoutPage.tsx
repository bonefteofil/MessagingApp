import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { logoutUser } from "@user/api";

import CurrentUserContext from "@user/Context";
import CurrentGroupContext from "@groups/Context";
import EditingMessageContext from "@messages/Context";

import ResponsiveCard from "@components/ResponsiveCard";


export default function LogoutRoute() {
    const { setCurrentUser } = useContext(CurrentUserContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const { setEditingMessage } = useContext(EditingMessageContext);
    const navigate = useNavigate();
    const logoutMutation = logoutUser();

    useEffect(() => {
        setCurrentUser(null);
        setCurrentGroup(null);
        setEditingMessage(null);
        logoutMutation.mutate();
    }, []);

    useEffect(() => {
        if (logoutMutation.isSuccess) {
            navigate("/login");
        }
    }, [logoutMutation.isSuccess]);

    return <ResponsiveCard title="Logging out..."/>;
}