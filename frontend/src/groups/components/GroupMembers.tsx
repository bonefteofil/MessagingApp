import { useContext } from "react";
import { useParams } from "react-router-dom";

import { Code, Table, Text } from "@mantine/core";

import { getGroupMembers } from "@groups/api";

import DeveloperModeContext from "@components/DeveloperModeContext";

import ResponsiveCard from "@components/ResponsiveCard";
import Loading from "@components/Loading";
import ErrorPage from "@errors/ErrorPage";

import type { GroupMemberScheme } from "@groups/schema";


export default function GroupMembers() {
    const params = useParams();
    const groupId = Number(params.groupId);
    const { data: groupMembers, isLoading, error } = getGroupMembers(groupId);
    const { developerMode } = useContext(DeveloperModeContext);

    if (error) return <ErrorPage message={error.message} />;

    return (
        <ResponsiveCard title={"Members (" + (groupMembers?.length ?? ".") + ")"}>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Username</Table.Th>
                        <Table.Th>Added on</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                
                {groupMembers && groupMembers.map((member: GroupMemberScheme) => (
                    <Table.Tr key={member.id}>
                        <Table.Td><Text>{member.username}</Text></Table.Td>
                        <Table.Td><Text>{member.createdAt}</Text></Table.Td>
                    </Table.Tr>
                ))}
                </Table.Tbody>
            </Table>
            {developerMode && (
                <Code block>
                    {JSON.stringify(groupMembers, null, 2)}
                </Code>
            )}
            <Loading loading={isLoading} />
        </ResponsiveCard>
    );
}