import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Modal, Select, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { transferOewnership } from "@api/groups";

import type { GroupMemberScheme } from "@schema/groups";


export default function TransferOewnership({ actualMembers } : { actualMembers: GroupMemberScheme[] }) {
    const [opened, { open, close }] = useDisclosure(false);
    const [newOwnerId, setNewOwnerId] = useState<number | null>(null);
    const [cookies] = useCookies(['userId']);
    const actualUserId = cookies.userId;
    const transferMutation = transferOewnership();

    const handleTransfer = () => {
        if (newOwnerId)
            transferMutation.mutate({ groupId: actualMembers[0].groupId, newOwnerId: newOwnerId });
    };

    useEffect(() => {
        if (transferMutation.isSuccess) {
            setNewOwnerId(null);
            close();
        }
    }, [transferMutation.isSuccess]);


    return (<>
        <Button
            radius='md'
            onClick={open}
            loading={transferMutation.isPending}
        >
            Transfer Ownership
            <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>

        <Modal
            opened={opened}
            onClose={close}
            title="Transfer Group Ownership"
            centered
            radius='lg'
        >
            {/* Select new owner */}
            <Select
                radius='md'
                label="Select new owner"
                placeholder="Choose member"
                searchable
                nothingFoundMessage="No members found"
                comboboxProps={{ width: 200 }}
                data={actualMembers
                    .filter((member: GroupMemberScheme) => member.userId !== actualUserId)
                    .map((member: GroupMemberScheme) => ({
                        value: member.userId!.toString(),
                        label: member.username
                    }))
                }
                onChange={(value) => setNewOwnerId(value ? Number(value) : null)}
            />

            {/* Submit button */}
            <Button
                variant="gradient"
                radius='md'
                mt='lg'
                size='input-md'
                fullWidth
                loading={transferMutation.isPending}
                loaderProps={{ size: 'sm' }}
                onClick={handleTransfer}
            >
                Transfer
            </Button>
        </Modal>
    </>)
}