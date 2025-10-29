import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Text } from "@mantine/core";
import { deleteAccount } from "../api";
import { CurrentUserContext } from "../Context";
import ResponsiveCard from "../../shared/components/ResponsiveCard";

export default function DeleteAccountPage() {
    const { currentUser } = useContext(CurrentUserContext);
    const deleteMutation = deleteAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            navigate("/login", { replace: true });
        }
    }, [deleteMutation.isSuccess]);

    return (
        <ResponsiveCard title="Delete Account">
            <Text>Are you sure you want to delete "{currentUser?.username}" account?</Text>
            <Text>This action is irreversible and will remove all your data.</Text>
            <Button onClick={() => { navigate("/settings"); }} disabled={deleteMutation.isPending} radius="md" size="md" mt="md">
                Cancel
            </Button>
            <Button onClick={() => { deleteMutation.mutate(); }} disabled={deleteMutation.isPending} color="red" radius="md" size="md" mt="md">
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
        </ResponsiveCard>
    );
}