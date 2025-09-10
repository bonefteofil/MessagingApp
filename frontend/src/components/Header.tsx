import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group, Button, Text, Avatar } from "@mantine/core";
import type GroupScheme from "../types/group";

export default function Header({currentGroup, removeCurrentGroup} : {currentGroup: GroupScheme, removeCurrentGroup: () => void}) {

    return (
        <Group gap='5'>
            <Button px='5' variant="subtle" onClick={removeCurrentGroup}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <Text size="lg">Back</Text>
            </Button>
            <Avatar />
            <Text size="xl" className=""> {currentGroup.name} (ID: {currentGroup.id}) </Text>
        </Group>
    );
}