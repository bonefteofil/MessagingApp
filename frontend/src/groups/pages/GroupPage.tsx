import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Avatar, Button, Center } from "@mantine/core";

import { getGroupById, deleteGroup } from "@groups/api";

import GroupForm from "@groups/components/GroupForm";
import Header from '@messages/components/Header';
import Loading from "@components/Loading";
import ResponsiveCard from "@components/ResponsiveCard";


export default function GroupPage() {
    const params = useParams();
    const navigate = useNavigate();
    const deleteMutation = deleteGroup();
    const { data: groupData, isLoading: isLoadingGroup } = getGroupById(Number(params.groupId));

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            navigate("/", { replace: true });
        }
    }, [deleteMutation.isSuccess]);
    
    return (<>
        <Header element={
            <Text ml='md' size="xl" truncate="end">Group Info</Text>}
        />

        <ResponsiveCard title={groupData?.name}>
            {(isLoadingGroup || !groupData) ? <Loading /> : <>

                <Center><Avatar size='xl' /></Center>
                <Text>Created: {groupData!.createdAt}</Text>

                <div style={{ flexGrow: 1 }} />
                <GroupForm editingGroup={groupData} />
                <Button
                    radius='md'
                    color="red"
                    onClick={() => { deleteMutation.mutate({ id: groupData!.id!, name: groupData!.name }); }}
                    loading={deleteMutation.isPending}
                >
                    <FontAwesomeIcon icon={faTrash} />
                    Delete Group
                </Button>
            </>}
        </ResponsiveCard>
    </>);
}