import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../Context";
import { CurrentGroupContext } from "../../groups/Context";
import { EditingMessageContext } from "../../messages/Context";
import { logoutUser } from "../api";
import ResponsiveCard from "../../shared/components/ResponsiveCard";
import { useNavigate } from "react-router-dom";

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