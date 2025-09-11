import { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDisclosure } from '@mantine/hooks';
import { createGroup, editGroup } from "../queries/groupsQueries";
import type GroupScheme from "../types/group";
import Error from "./Error";
import { Modal, Button, ActionIcon } from "@mantine/core";
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

    const isLoading = createMutation.isPending || editMutation.isPending;
    const error = createMutation.error || editMutation.error;

    return (
        <>
            <ActionIcon
                p="md"
                variant="outline"
                radius={editingGroup ? 'md' : 'xl'}
                onClick={open}
                loading={isLoading}
            >
                <FontAwesomeIcon icon={editingGroup ? faPenToSquare : faPlus} />
            </ActionIcon>

            <Modal opened={opened} onClose={close} title="Create a new group" centered radius='md'>
                <form onSubmit={handleSubmit}>
                    {error && <Error message={`Error: ${error.message}`} />}
                    <input
                        type="text"
                        placeholder="Group Name"
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                        {...form.getInputProps('name')}
                    />
                    <Button type="submit" fullWidth loading={isLoading}>
                        {editingGroup ? "Save group changes" : "Create group"}
                    </Button>
                </form>
            </Modal>
        </>
    );
}
