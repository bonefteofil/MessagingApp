import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { ActionIcon, Button, Drawer, Stack, Text } from "@mantine/core";
import { getGroups } from "../queries/groupsQueries";
import Error from "./Error";
import type GroupScheme from "../types/group";

export default function Menu({currentGroup, setCurrentGroup} : {currentGroup: GroupScheme | null, setCurrentGroup: (id: GroupScheme | null) => void}) {
    const [opened, setOpened] = React.useState(false);
    const { error, data } = getGroups();

    const toggle = () => setOpened((o) => !o);
    if (error)
        return <Error message={"Error loading groups: " + error?.message} />;

    return (
        <>
            <ActionIcon variant="gradient" radius="md" size='xl' pos='fixed' top={20} left={20}
                className="z-1000"
                onClick={toggle}
                loading={!data}
            >
                <FontAwesomeIcon icon={faBars} size="lg" />
            </ActionIcon>
            
            <Drawer
                opened={opened}
                onClose={toggle}
                withCloseButton={false}
                padding="md"
                size="md"
                zIndex={1001}
            >
                <Stack>
                    <Text size="xl">Wellcome user!</Text>
                    <Button variant="light" color="red" onClick={() => { setCurrentGroup(null); toggle(); }}> None group </Button>

                    {data && data.map((group: any) => (
                        <Button
                            key={group.id}
                            disabled={group.id === currentGroup?.id}
                            style={{ cursor: 'pointer', fontWeight: group.id === currentGroup?.id ? 'bold' : 'normal' }}
                            onClick={() => { setCurrentGroup(group); toggle(); }}
                        >
                            {group.name} (ID: {group.id})
                        </Button>
                    ))}
                </Stack>
            </Drawer>
        </>
    );
}