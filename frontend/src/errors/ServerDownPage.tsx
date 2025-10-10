import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { GetStatus } from "../queries/statusQuery";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ResponsiveCard from "../components/ResponsiveCard";

export default function ServerDownPage() {
    const { error, isLoading } = GetStatus();
    const { currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();

    if (isLoading) return null;

    if (!error) return <Outlet />;

    return (
        <ResponsiveCard title="503 - Server Down :(">
            <Text>The server is currently unreachable. Please try again later.</Text>
            {currentUser && <Button mt="md" radius="md" onClick={() => navigate("/logout")}>Logout</Button>}
        </ResponsiveCard>
    );
}