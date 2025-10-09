import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, ActionIcon, Input } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";
import { createGroup, editGroup } from "../queries/groupsQueries";
import { DeveloperModeContext } from "../contexts/DeveloperModeContext";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";
import type GroupScheme from "../types/groupScheme";

export default function GroupForm({ editingGroup } : { editingGroup?: GroupScheme }) {
    const [opened, { open, close }] = useDisclosure(false);
    const { developerMode } = useContext(DeveloperModeContext);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const createMutation = createGroup();
    const editMutation = editGroup();
    const navigate = useNavigate();

    const form = useForm({
        initialValues: { name: '' },
    });

    useEffect(() => { form.setValues({ name: editingGroup?.name || '' }); }, [editingGroup]);

    useEffect(() => {
        const mutation = editingGroup ? editMutation : createMutation;
        if (mutation.isSuccess && mutation.data) {
            close();
            form.reset();
            setCurrentGroup(mutation.data);
            navigate(`/groups/${mutation.data.id}`);
        }
    }, [createMutation.isSuccess, editMutation.isSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let name = form.values.name;
        if (developerMode && name === '') name = 'Dev Group';
        if (editingGroup) {
            editMutation.mutate({ id: editingGroup.id, name: name });
        } else {
            createMutation.mutate({ name: name });
        }
    };

    return (
        <>
            <ActionIcon
                p="md"
                variant="light"
                radius={editingGroup ? 'md' : 'xl'}
                onClick={open}
                loading={createMutation.isPending || editMutation.isPending}
            >
                <FontAwesomeIcon icon={editingGroup ? faPenToSquare : faPlus} />
            </ActionIcon>

            <Modal
                opened={opened}
                onClose={close}
                title={editingGroup ? "Edit group" : "Create a new group"}
                centered
                radius='md'>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        data-autofocus
                        placeholder="Group Name"
                        radius='md'
                        size="md"
                        mb='sm'
                        {...form.getInputProps('name')}
                    />
                    <Button
                        variant="gradient"
                        type="submit"
                        radius='md'
                        size='input-md'
                        fullWidth
                        disabled={form.values.name.trim() === '' && !developerMode}
                        loading={createMutation.isPending || editMutation.isPending}
                        loaderProps={{ size: 'sm' }}
                    >
                        {editingGroup ? "Save group changes" : "Create group"}
                    </Button>
                </form>
            </Modal>
        </>
    );
}
