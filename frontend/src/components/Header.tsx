import { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { faAngleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteGroup } from "../queries/groupsQueries";
import { Group, Button, Text, Avatar, ActionIcon, AppShell } from "@mantine/core";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import GroupForm from "./GroupForm";

export default function Header() {
    const deleteMutation = deleteGroup();
    const { currentGroup, setCurrentGroup } = useContext(CurrentGroupContext);
    const { developerMode } = useContext(DeveloperModeContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            setCurrentGroup(null);
            navigate("/");
        }
    }, [deleteMutation.isSuccess]);

    return (
        <AppShell.Header display={location.pathname === "/" ? "none" : "inherit"} p='sm' ml={{ base: 0, md: 400 }} className="!backdrop-blur-lg !bg-gray-700/30" >
            <Group gap='5'>

                <Button px='5' variant="subtle" onClick={() => { navigate('/'); }}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    <Text size="lg">Back</Text>
                </Button>

                {currentGroup ? (<>
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
                </>) : location.pathname === "/settings" && (
                    <Text ml="md" size="xl">Settings</Text>
                )}
                
            </Group>
        </AppShell.Header>
    );
}