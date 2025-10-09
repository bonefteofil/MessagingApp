import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ResponsiveCard from "../components/ResponsiveCard";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <ResponsiveCard title="404 - Page Not Found :(">
            <Button radius="md" onClick={() => { navigate("/") }}>Go to Home Page</Button>
        </ResponsiveCard>
    );
}