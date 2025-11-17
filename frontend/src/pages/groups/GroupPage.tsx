import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { faRightFromBracket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Avatar, Button, Center } from "@mantine/core";

import { getGroupById, deleteGroup, getGroupMembers, leaveGroup } from "@api/groups";

import GroupMembers from "./components/GroupMembers";
import TransferOewnership from "./components/TransferOwnership";
import GroupForm from "./components/GroupForm";
import Header from '@components/Header';
import Loading from "@components/Loading";
import ResponsiveCard from "@components/ResponsiveCard";
import ErrorPage from "@errors/ErrorPage";


export default function GroupPage() {
    const params = useParams();
    const [cookies] = useCookies(['userId']);
    const navigate = useNavigate();
    const groupId = Number(params.groupId);
    const deleteMutation = deleteGroup();
    const leaveMutation = leaveGroup();
    const { data: groupData, isLoading: isLoadingGroup, error: groupError } = getGroupById(groupId);
    const { data: membersData, error: membersError } = getGroupMembers(groupId);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }, []);

    useEffect(() => {
        console.log("Delete or leave successful, navigating to inbox");
        if (deleteMutation.isSuccess || leaveMutation.isSuccess) {
            navigate("/", { replace: true });
        }
    }, [deleteMutation.isSuccess, leaveMutation.isSuccess]);

    if (groupError || membersError) {
        return (<>
            <Header element={
                <Text ml='md' size="xl" truncate="end">Group Info</Text>}
            />
            <ErrorPage message={groupError?.message ?? membersError!.message} />
        </>);
    }

    const AdminActions = (<>
        {/* Edit Button */}
        <GroupForm editingGroup={groupData} actualMembers={membersData} />

        {/* Transfer Ownership Button */}
        <TransferOewnership actualMembers={membersData!} />

        {/* Delete Button */}
        <Button
            radius='md'
            color="red"
            onClick={() => {
                deleteMutation.mutate({
                    body: groupData!,
                    groupId: groupData!.id!
                });
            }}
            loading={deleteMutation.isPending}
            disabled={leaveMutation.isPending}
        >
            Delete Group
            <FontAwesomeIcon icon={faTrash} />
        </Button>
    </>);

    const MemberActions = (<>
        {/* Leave Button */}
        <Button
            radius='md'
            onClick={() => { leaveMutation.mutate(groupData!.id!); }}
            loading={leaveMutation.isPending}
            disabled={deleteMutation.isPending}
        >
            Leave Group
            <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
    </>);
    
    return (<>
        <Header element={
            <Text ml='md' size="xl" truncate="end">Group Info</Text>}
        />

        <ResponsiveCard title={groupData?.name}>
            {(isLoadingGroup || !groupData) ? <Loading /> : <>

                <Center><Avatar size='xl' /></Center>
                <Text size="xl">Owner: {groupData!.owner}</Text>
                <Text size="xl">Created time: {groupData!.createdAt}</Text>

                {!membersData ? <Loading /> :
                    groupData!.ownerId === Number(cookies.userId) ? AdminActions : MemberActions
                }
            </>}
        </ResponsiveCard>

        <GroupMembers groupMembers={membersData} />
    </>);
}