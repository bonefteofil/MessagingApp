import { useContext } from "react";

import { Code, Table, Text } from "@mantine/core";

import DeveloperModeContext from "@components/DeveloperModeContext";

import ResponsiveCard from "@components/ResponsiveCard";
import Loading from "@components/Loading";

import type { GroupMemberScheme } from "@schema/groups";


export default function GroupMembers({groupMembers} : {groupMembers?: GroupMemberScheme[]}) {
    const { developerMode } = useContext(DeveloperModeContext);

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
            <Loading loading={!groupMembers} />
        </ResponsiveCard>
    );
}