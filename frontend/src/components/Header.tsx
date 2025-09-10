import { useContext } from "react";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group, Button, Text, Avatar } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";

export default function Header() {
    const { currentGroup, setCurrentGroup } = useContext(CurrentGroupContext);

    return (
        <Group gap='5'>
            <Button px='5' variant="subtle" onClick={() => setCurrentGroup(null)}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <Text size="lg">Back</Text>
            </Button>
            <Avatar />
            <Text size="xl" className=""> {currentGroup!.name} (ID: {currentGroup!.id}) </Text>
        </Group>
    );
}