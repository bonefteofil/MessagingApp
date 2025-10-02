import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Stack, Switch, Tooltip, Text, Button, Group, Code } from "@mantine/core";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";

export default function SettingsPage() {
    const { developerMode, setDeveloperMode } = useContext(DeveloperModeContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentGroup(null);
    }, []);

    return (
        <Stack m='lg'>
            <Text size="xl" mb='md'>Settings</Text>
            <Card radius='lg'>
                <Text size="lg">Account</Text>
                <Text size="md">Username: {currentUser?.username}</Text>
                <Button mt='sm' radius='md' onClick={() => { navigate("/logout"); }}>
                    Logout
                </Button>
            </Card>

            <Card radius='lg'>
                <Group>
                    <Text size="lg">Developer Mode</Text>
                    <Tooltip label="Development Mode"  refProp="rootRef">
                        <Switch size="lg" onLabel="Dev" offLabel="Prod" checked={developerMode} onChange={() => {setDeveloperMode(!developerMode)}}/>
                    </Tooltip>
                </Group>
            </Card>

            {developerMode && (
                <Card radius='lg'>
                    <Text size="lg">Current User data</Text>
                    <Code block>
                        {JSON.stringify(currentUser, null, 2)}
                    </Code>
                </Card>
            )}
        </Stack>
    );
}