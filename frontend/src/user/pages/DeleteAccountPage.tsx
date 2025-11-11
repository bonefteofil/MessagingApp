import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Modal, Stack, Text, Title } from "@mantine/core";

import { deleteAccount, getAccountData } from "@user/api";


export default function DeleteAccountPage() {
    const deleteMutation = deleteAccount();
    const { data } = getAccountData();
    const navigate = useNavigate();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            navigate("/login", { replace: true });
        }
    }, [deleteMutation.isSuccess]);

    return (
        <Modal opened onClose={() => {}} withCloseButton={false} radius="lg" centered>

            <Stack gap="md">
                <Title order={2} >
                    <Text ta="center" inherit variant="gradient" >
                        Delete Account
                    </Text>
                </Title>

                <Text>Are you sure you want to delete account: "{data?.user.username}"?</Text>
                <Text>This action is irreversible and will remove all your data.</Text>
                <Button onClick={() => { navigate(-1) }} disabled={deleteMutation.isPending} radius="md" size="md">
                    Cancel
                </Button>
                <Button onClick={() => { deleteMutation.mutate(); }} disabled={deleteMutation.isPending} color="red" radius="md" size="md">
                    {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete My Account'}
                </Button>
            </Stack>
        </Modal>
    );
}