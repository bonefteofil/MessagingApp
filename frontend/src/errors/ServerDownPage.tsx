import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ResponsiveCard from "../components/ResponsiveCard";

export default function ServerDownPage() {
    const { currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();

    return (
        <ResponsiveCard title="Server Down :(">
            <Text>The server is currently unreachable. Please try again later.</Text>
            {currentUser && <Button mt="md" radius="md" onClick={() => navigate("/logout")}>Logout</Button>}
        </ResponsiveCard>
    );
}