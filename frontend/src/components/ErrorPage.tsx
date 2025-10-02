import { useNavigate } from "react-router-dom";
import { Button, Stack, Text } from "@mantine/core";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

export default function ErrorPage({ message }: { message: string }) {
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentUserContext);

    return (
        <Stack align="center" justify="center" className="h-full">
            <Text size="lg" c="red">{message}</Text>
            <Button mt="md" onClick={() => window.location.reload()}>Reload</Button>
            <Button mt="md" onClick={() => navigate("/logout")} disabled={!currentUser}>Logout</Button>
        </Stack>
    );
}