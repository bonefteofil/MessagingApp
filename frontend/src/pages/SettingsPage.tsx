import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch, Text, Button, Code } from "@mantine/core";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import ResponsiveCard from "../components/ResponsiveCard";

export default function SettingsPage() {
    const { developerMode, setDeveloperMode } = useContext(DeveloperModeContext);
    const { currentUser } = useContext(CurrentUserContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentGroup(null);
    }, []);

    return (<>
        <ResponsiveCard title="Account settings">
            <Text size="md">Username: {currentUser?.username}</Text>
            <Text size="md">Id: {currentUser?.id}</Text>

            <Button mt='sm' radius='md' onClick={() => { navigate("/logout"); }}>
                Logout
            </Button>
            <Button mt='sm' radius='md' color="red" onClick={() => { navigate("/delete-account"); }}>
                Delete Account
            </Button>
        </ResponsiveCard>

        <ResponsiveCard title="Developer Mode">
            <Switch size="lg" onLabel="Developer" offLabel="Production" checked={developerMode} onChange={() => {setDeveloperMode(!developerMode)}}/>
        </ResponsiveCard>

        {developerMode && (
            <ResponsiveCard title="Current User Data">
                <Code block>
                    {JSON.stringify(currentUser, null, 2)}
                </Code>
            </ResponsiveCard>
        )}
    </>);
}