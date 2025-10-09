import { useContext, useEffect } from "react";
import { deleteUser } from "../queries/usersQueries";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Button, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import ResponsiveCard from "../components/ResponsiveCard";

export default function DeleteUserPage() {
    const { currentUser } = useContext(CurrentUserContext);
    const deleteMutation = deleteUser();
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
            <Button onClick={() => { navigate("/settings"); }} radius="md" size="md" mt="md">
                Cancel
            </Button>
            <Button onClick={() => { deleteMutation.mutate(currentUser!.id!); }} color="red" radius="md" size="md" mt="md">
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete My Account'}
            </Button>
        </ResponsiveCard>
    );
}