import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDisclosure } from '@mantine/hooks';
import { createGroup, editGroup } from "../queries/groupsQueries";
import type GroupScheme from "../types/group";
import { Modal, Button, ActionIcon, Input } from "@mantine/core";
import { useForm } from "@mantine/form";
import { CurrentGroupContext } from "../contexts/CurrentGroupContext";

export default function GroupForm({ editingGroup } : { editingGroup?: GroupScheme }) {
    const [opened, { open, close }] = useDisclosure(false);
    const { setCurrentGroup } = useContext(CurrentGroupContext);
    const createMutation = createGroup();
    const editMutation = editGroup();

    const form = useForm({
        initialValues: { name: '' },
    });

    useEffect(() => { form.setValues({ name: editingGroup?.name || '' }); }, [editingGroup]);

    useEffect(() => {
        const mutation = editingGroup ? editMutation : createMutation;
        if (mutation.isSuccess) {
            close();
            form.reset();
            setCurrentGroup(mutation.data);
        }
    }, [createMutation.isSuccess, editMutation.isSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingGroup) {
            editMutation.mutate({ id: editingGroup.id, name: form.values.name });
        } else {
            createMutation.mutate({ name: form.values.name });
        }
    };

    return (
        <>
            <ActionIcon
                p="md"
                variant="outline"
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
