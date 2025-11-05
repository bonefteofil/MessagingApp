import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Switch, Text, Button, Code, Avatar, Group, Center } from "@mantine/core";

import CurrentUserIdContext from "@user/Context";
import CurrentGroupContext from "@groups/Context";
import DeveloperModeContext from "@components/DeveloperModeContext";

import ResponsiveCard from "@components/ResponsiveCard";


export default function AccountPage() {
    const { developerMode, setDeveloperMode } = useContext(DeveloperModeContext);
    const { currentUserId } = useContext(CurrentUserIdContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentGroup(null);
    }, []);

    return (<>
        <ResponsiveCard title="Account settings">
            <Center><Avatar size='xl' /></Center>
            <Text>User ID: {currentUserId}</Text>

            <Group>
                <Text>Developer mode:</Text>
                <Switch size="lg" onLabel="On" offLabel="Off" checked={developerMode} onChange={() => {setDeveloperMode(!developerMode)}}/>
            </Group>

            <Button mt='sm' radius='md' onClick={() => { navigate("/logout"); }}>
                Logout
            </Button>
            <Button mt='sm' radius='md' color="red" onClick={() => { navigate("/delete-account"); }}>
                Delete Account
            </Button>
        </ResponsiveCard>

        {developerMode && (
            <ResponsiveCard title="Current User Data">
                <Code block>
                    {JSON.stringify(currentUserId, null, 2)}
                </Code>
            </ResponsiveCard>
        )}
    </>);
}