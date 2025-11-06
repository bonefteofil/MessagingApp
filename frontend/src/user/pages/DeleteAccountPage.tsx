import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Button, Text } from "@mantine/core";

import { deleteAccount } from "@user/api";

import ResponsiveCard from "@components/ResponsiveCard";


export default function DeleteAccountPage() {
    const [cookie] = useCookies(['userId']);
    const deleteMutation = deleteAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            navigate("/login", { replace: true });
        }
    }, [deleteMutation.isSuccess]);

    return (
        <ResponsiveCard title="Delete Account">
            <Text>Are you sure you want to delete account with ID: "{cookie.userId}"?</Text>
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