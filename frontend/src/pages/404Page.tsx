import { Button, Card, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Card shadow="lg" padding="lg" maw={400} mt='xl' radius='lg' mx='auto'>
            <Text size="xl">404 - Page Not Found</Text>
            <Button mt="xl" radius="md" onClick={() => { navigate("/") }}>Go to Home</Button>
        </Card>
    );
}