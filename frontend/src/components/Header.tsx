import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faAngleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteGroup } from "../queries/groupsQueries";
import { Group, Button, Text, Avatar, ActionIcon } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import GroupForm from "./GroupForm";

export default function Header() {
    const deleteMutation = deleteGroup();
    const { currentGroup, setCurrentGroup } = useContext(CurrentGroupContext);
    const { developerMode } = useContext(DeveloperModeContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            setCurrentGroup(null);
            navigate("/");
        }
    }, [deleteMutation.isSuccess]);

    return (
        <Group gap='5'>
            <Button px='5' variant="subtle" onClick={() => { navigate('/'); }}>
                <FontAwesomeIcon icon={faAngleLeft} />
                <Text size="lg">Back</Text>
            </Button>
            <Avatar />
            <Text size="sm" className="truncate max-w-[38%]">{currentGroup?.name} {developerMode && `ID: ${Number(useParams().groupId)}`}</Text>
            <div style={{ flexGrow: 1 }} />

            <GroupForm editingGroup={currentGroup!} />
            <ActionIcon
                variant="light"
                size='lg'
                radius='md'
                color="red"
                mx='xs'
                onClick={() => { deleteMutation.mutate(currentGroup!.id!); }}
                loading={deleteMutation.isPending}
            >
                <FontAwesomeIcon icon={faTrash} />
            </ActionIcon>
        </Group>
    );
}