import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, ActionIcon, Input, MultiSelect, Text } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";

import { getUsers } from "@api/user";
import { createGroup, editGroup } from "@api/groups";

import type { GroupMemberScheme, GroupScheme } from "@schema/groups";
import type { UserScheme } from "@schema/user";


export default function GroupForm({ editingGroup, actualMembers } : { editingGroup?: GroupScheme, actualMembers?: GroupMemberScheme[] }) {
    const [opened, { open, close }] = useDisclosure(false);
    const { data: users } = getUsers();
    const createMutation = createGroup();
    const editMutation = editGroup();
    const [cookies] = useCookies(['userId']);
    const actualUserId = cookies.userId;

    const form = useForm({
        initialValues: {
            name: '',
            membersId: [] as string[]
        },
    });

    // If editing, set form values to current group data
    useEffect(() => {
        if (opened && editingGroup && actualMembers) {
            form.setValues({
                name: editingGroup?.name,
                membersId: actualMembers
                    .filter((member: GroupMemberScheme) => member.userId !== actualUserId)
                    .map((member: GroupMemberScheme) => member.userId.toString())
            });
        }
    }, [opened]);

    useEffect(() => {
        const mutation = editingGroup ? editMutation : createMutation;
        if (mutation.isSuccess && mutation.data) {
            close();
            form.reset();
        }
    }, [createMutation.isSuccess, editMutation.isSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let name = form.values.name;
        let members = form.values.membersId.map(id => Number(id));

        const mutation = editingGroup ? editMutation : createMutation;
        mutation.mutate({ body: { name, membersIds: members }, groupId: editingGroup?.id });
    };

    return (<>

        {/* Open form button */}
        {editingGroup ? (
            <Button
                radius='md'
                onClick={open}
            >
                Edit Group
                <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
        ) : (
            <ActionIcon
                p="md"
                variant="light"
                radius={editingGroup ? 'md' : 'xl'}
                onClick={open}
            >
                <FontAwesomeIcon icon={faPlus} />
            </ActionIcon>
        )}

        <Modal
            opened={opened}
            onClose={close}
            title={editingGroup ? "Edit group" : "Create a new group"}
            centered
            radius='lg'>
            <form onSubmit={handleSubmit}>

                {/* Group name input */}
                <Input
                    type="text"
                    data-autofocus
                    placeholder="Group Name"
                    radius='md'
                    size="md"
                    mb='sm'
                    {...form.getInputProps('name')}
                />

                {/* Select group members */}
                <Text mt='md' mb='sm'>Add members</Text>
                {!users ? <Text>Loading...</Text> : (
                    <MultiSelect
                        radius='md'
                        placeholder="Select members"
                        data={!users ? [] : users
                            .filter((user: UserScheme) => user.id !== actualUserId)
                            .map((user: UserScheme) => ({
                                value: user.id!.toString(),
                                label: user.username
                            }))
                        }
                        value={form.values.membersId}
                        onChange={(value) => form.setValues({ ...form.values, membersId: value })}
                        searchable
                        hidePickedOptions
                        nothingFoundMessage="Not found..."
                        comboboxProps={{ width: 200 }}
                    />
                )}

                {/* Submit button */}
                <Button
                    variant="gradient"
                    type="submit"
                    radius='md'
                    mt='lg'
                    size='input-md'
                    fullWidth
                    disabled={form.values.name.trim() === '' || !users}
                    loading={createMutation.isPending || editMutation.isPending}
                    loaderProps={{ size: 'sm' }}
                >
                    {editingGroup ? "Save group changes" : "Create group"}
                </Button>
            </form>
        </Modal>
    </>);
}
