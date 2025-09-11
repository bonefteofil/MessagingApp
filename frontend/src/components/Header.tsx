import { useContext, useEffect } from "react";
import { faAngleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteGroup } from "../queries/groupsQueries";
import { Group, Button, Text, Avatar, ActionIcon } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import GroupForm from "./GroupForm";

export default function Header() {
    const { currentGroup, setCurrentGroup } = useContext(CurrentGroupContext);
    const deleteMutation = deleteGroup();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            setCurrentGroup(null);
        }
    }, [deleteMutation.isSuccess]);

    return (
        <Group gap='5'>
            <Button px='5' variant="subtle" onClick={() => setCurrentGroup(null)}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <Text size="lg">Back</Text>
            </Button>
            <Avatar />
            <Text size="sm" className="truncate max-w-[38%]"> {currentGroup!.name} (ID: {currentGroup!.id}) </Text>
            <div style={{ flexGrow: 1 }} />

            <GroupForm editingGroup={currentGroup!} />
            <ActionIcon
                variant="outline"
                size='lg'
                radius='md'
                color="red"
                mx='xs'
                onClick={() => {deleteMutation.mutate(currentGroup!)}}
                loading={deleteMutation.isPending}
            >
                <FontAwesomeIcon icon={faTrash} />
            </ActionIcon>
        </Group>
    );
}