import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { Switch, Text, Button, Code, Avatar, Group, Center } from "@mantine/core";

import { getAccountData } from "../api";

import CurrentGroupContext from "@groups/Context";
import DeveloperModeContext from "@components/DeveloperModeContext";

import LoginHistory from "@user/components/LoginHistory";
import ResponsiveCard from "@components/ResponsiveCard";
import Loading from "@components/Loading";


export default function AccountPage() {
    const { developerMode, setDeveloperMode } = useContext(DeveloperModeContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const { data, isLoading } = getAccountData();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Account data:", data);
    }, [data]);

    useEffect(() => {
        setCurrentGroup(null);
    }, []);

    return (<>
        <Outlet />
        <ResponsiveCard title="Account">
            <Loading loading={isLoading} />

            {data && <>
                <Center><Avatar size='xl' /></Center>
                <Text>Username: <Text component="span" fw={700}>{data.user.username}</Text> </Text>
            </>}

            <Group>
                <Text>Developer mode:</Text>
                <Switch size="lg" onLabel="On" offLabel="Off" checked={developerMode} onChange={() => {setDeveloperMode(!developerMode)}}/>
            </Group>

            <Button mt='sm' radius='md' onClick={() => { navigate("/logout"); }}>
                Logout
            </Button>
            <Button mt='sm' radius='md' color="red" onClick={() => { navigate("/account/delete"); }}>
                Delete Account
            </Button>
        </ResponsiveCard>

        <LoginHistory data={data?.sessions} />

        {developerMode && (
            <ResponsiveCard title="Current User Data">
                <Code block>
                    {JSON.stringify(data, null, 2)}
                </Code>
            </ResponsiveCard>
        )}
    </>);
}