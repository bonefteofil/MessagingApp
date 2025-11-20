import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Group, Text, ScrollArea, Box, AppShell, ActionIcon } from "@mantine/core";

import { getInboxGroups } from "@api/groups"

import GroupForm from "@groups/components/GroupForm";
import Loading from "@components/Loading";
import Credits from "@components/Credits";
import ErrorPage from "@errors/ErrorPage";

import type { InboxGroupScheme } from "@schema/groups";
import { useEffect, useState } from "react";
import InboxComponent from "./components/InboxComponent";


export default function InboxPage() {
    const navigate = useNavigate();
    const [cookies] = useCookies(['userId']);
    const { data, error, isLoading } = getInboxGroups();

    const [publicGroups, setPublicGroups] = useState<InboxGroupScheme[]>([]);
    const [privateGroups, setPrivateGroups] = useState<InboxGroupScheme[]>([]);

    useEffect(() => {
        if (data) {
            setPublicGroups(data.filter((group: InboxGroupScheme) => group.public));
            setPrivateGroups(data.filter((group: InboxGroupScheme) => !group.public));
        }
    }, [data]);

    if (!cookies.userId) return <Navigate to="/login" replace />;
    if (error) return (<AppShell.Navbar withBorder><ErrorPage message={error.message} /></AppShell.Navbar>);

    return (
        <AppShell.Navbar withBorder>
            <Group p='md'>
                <Text flex={1} size="xl" variant="gradient" fw={700}>Chats</Text>
                <GroupForm />
                <ActionIcon
                    p="md"
                    variant="light"
                    radius='xl'
                    onClick={() => { navigate("/account"); }}
                >
                    <FontAwesomeIcon icon={faUser} />
                </ActionIcon>
            </Group>

            <ScrollArea type="scroll" px='sm' flex={1}>
                <Text size="lg" mt="sm" mb="xs" fw={500} px="md">Private Groups ({privateGroups.length})</Text>
                {privateGroups.map((group: InboxGroupScheme) => {
                    return <InboxComponent key={group.id} group={group} />
                })}

                <Text size="lg" mt="sm" mb="xs" fw={500} px="md">Public Groups ({publicGroups.length})</Text>
                {publicGroups.map((group: InboxGroupScheme) => {
                    return <InboxComponent key={group.id} group={group} />
                })}

                <Loading loading={isLoading} />

                <Box h='md' />
            </ScrollArea>

            <Credits />
        </AppShell.Navbar>
    );
}