import { useEffect } from "react";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, ActionIcon, Input, MultiSelect, Text, Switch } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useForm } from "@mantine/form";

import { getUsers } from "@api/user";
import { createGroup, editGroup } from "@api/groups";

import type { GroupFormScheme, GroupMemberScheme, GroupScheme } from "@schema/groups";
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
            membersId: [] as string[],
            public: false
        },
    });

    // If editing, set form values to current group data
    useEffect(() => {
        if (opened && editingGroup && actualMembers) {
            form.setValues({
                name: editingGroup?.name,
                public: editingGroup?.public || false,
                membersId: actualMembers
                    .filter((member: GroupMemberScheme) => member.userId !== actualUserId)
                    .map((member: GroupMemberScheme) => member.userId.toString())
            });
        }
    }, [opened]);

    // Close modal on successful mutation
    useEffect(() => {
        const mutation = editingGroup ? editMutation : createMutation;
        if (mutation.isSuccess && mutation.data) {
            close();
            form.reset();
        }
    }, [createMutation.isSuccess, editMutation.isSuccess]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const group: GroupFormScheme = {
            name: form.values.name,
            public: form.values.public,
            membersIds: form.values.membersId.map(id => Number(id)),
        };
        const mutation = editingGroup ? editMutation : createMutation;
        mutation.mutate({ body: group, groupId: editingGroup?.id });
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
            size="md"
            opened={opened}
            onClose={close}
            title={editingGroup ? "Edit group" : "Create a new group"}
            centered
            radius='lg'>
            <form onSubmit={handleSubmit}>

                {/* Group name input */}
                <Text mb='sm'>Group Name</Text>
                <Input
                    size="md"
                    radius='md'
                    data-autofocus
                    type="text"
                    placeholder="Group Name"
                    {...form.getInputProps('name')}
                />

                {/* Select group members */}
                <Text mt='lg' mb='sm'>Add members</Text>
                {!users ? <Text>Loading...</Text> : (
                    <MultiSelect
                        size="md"
                        radius='md'
                        placeholder={form.values.public ? "Public group - no members" : "Select members"}
                        searchable
                        hidePickedOptions
                        nothingFoundMessage="Not found..."
                        comboboxProps={{ width: 200 }}
                        disabled={form.values.public}
                        data={!users ? [] : users
                            .filter((user: UserScheme) => user.id !== actualUserId)
                            .map((user: UserScheme) => ({
                                value: user.id!.toString(),
                                label: user.username
                            }))
                        }
                        {...form.getInputProps('membersId')}
                    />
                )}

                {/* Public group switch */}
                {editingGroup ? <Text mt='lg'>Public: {editingGroup.public ? "Yes" : "No"}</Text> :
                    <Switch
                        mt='lg'
                        size="md"
                        label="Public:"
                        labelPosition="left"
                        defaultChecked={form.values.public}
                        disabled={form.values.membersId.length > 0 || editingGroup != null}
                        {...form.getInputProps('public')}
                    />
                }

                {/* Submit button */}
                <Button
                    mt='lg'
                    size='md'
                    radius='md'
                    variant="gradient"
                    type="submit"
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
