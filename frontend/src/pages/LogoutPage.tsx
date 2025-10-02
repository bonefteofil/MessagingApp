import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { EditingMessageContext } from "../contexts/EditingMessageContext";

export default function LogoutRoute() {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const { setCurrentGroup } = useContext(CurrentGroupContext);
  const { setEditingMessage } = useContext(EditingMessageContext);

  useEffect(() => {
    setCurrentUser(null);
    setCurrentGroup(null);
    setEditingMessage(null);
    console.log("User logged out");
  }, []);

  return <Navigate to="/login" replace />;
}