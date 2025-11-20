import { Table, Button } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import ResponsiveCard from '@components/ResponsiveCard';
import Loading from '@components/Loading';

import { revokeSession } from '@api/auth';

import type { SessionDetails } from '@schema/user';


export default function LoginHistory({data} : {data: SessionDetails[] | undefined}) {
    const revokeMutation = revokeSession();

    return (
        <ResponsiveCard title="Login History">
            <Table
                horizontalSpacing="xs"
                verticalSpacing="xs" 
                classNames={{
                    td: 'py-[4px] px-[6px]',
                    th: 'py-[4px] px-[6px]'
            }}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Device</Table.Th>
                        <Table.Th>Time</Table.Th>
                        <Table.Th align="center">Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                {data && data.map((session) => (
                    
                    <Table.Tr key={session.id}>
                        <Table.Td>{session.deviceName}</Table.Td>
                        <Table.Td>{session.createdAt}</Table.Td>
                        <Table.Td>
                            <Button
                                size='xs'
                                color='green'
                                loading={revokeMutation.isPending && revokeMutation.variables === session.id}
                                disabled={session.revoked || session.expired}
                                onClick={() => { revokeMutation.mutate(session.id) }}
                                rightSection={ !session.revoked && !session.expired &&
                                    <FontAwesomeIcon size='xs' icon={ faRightFromBracket } />
                                }
                            >
                                { session.revoked ? "Logged out "
                                : session.expired ? "Expired "
                                : "Logout " }
                            </Button>
                        </Table.Td>
                    </Table.Tr>
                ))}
                </Table.Tbody>
            </Table>

            <Loading loading={!data} />
        </ResponsiveCard>
    );
}