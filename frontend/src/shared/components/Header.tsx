import React from "react";
import { useNavigate } from "react-router-dom";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group, Button, Text, AppShell } from "@mantine/core";


export default function Header({ element } : { element: React.ReactNode }) {
    const navigate = useNavigate();

    return (
        <AppShell.Header p='sm' ml={{ base: 0, md: 400 }} className="!backdrop-blur-lg !bg-gray-700/30" >
            <Group gap='5' wrap="nowrap">

                <Button px='5' variant="subtle" onClick={() => { navigate(-1); }}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    <Text size="lg">Back</Text>
                </Button>

                {element}
            </Group>
        </AppShell.Header>
    );
}