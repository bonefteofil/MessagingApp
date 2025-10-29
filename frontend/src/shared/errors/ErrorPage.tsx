import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { CurrentUserContext } from "../../user/Context";
import ResponsiveCard from "../components/ResponsiveCard";

export default function ErrorPage({ message }: { message: string }) {
    const { currentUser } = useContext(CurrentUserContext);
    const navigate = useNavigate();

    return (
        <ResponsiveCard title="An Error Occurred">
            <Text size="lg" c="red">{message}</Text>
            <Button mt="md" radius="md" onClick={() => window.location.reload()}>Reload</Button>
            {currentUser && <Button mt="md" radius="md" onClick={() => navigate("/logout")}>Logout</Button>}
        </ResponsiveCard>
    );
}