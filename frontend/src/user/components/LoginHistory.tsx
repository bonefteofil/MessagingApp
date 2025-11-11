import { useContext } from 'react';

import { Table, Badge, ActionIcon, Button, Code } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarXmark, faRightFromBracket, faUserSlash } from '@fortawesome/free-solid-svg-icons';

import DeveloperModeContext from '@/shared/components/DeveloperModeContext';

import ResponsiveCard from '@components/ResponsiveCard';
import Loading from '@components/Loading';

import { revokeSession } from '@user/api';

import type { SessionDetails } from '@user/schema';


export default function LoginHistory({data} : {data: SessionDetails[] | undefined}) {
    const revokeMutation = revokeSession();
    const { developerMode } = useContext(DeveloperModeContext);

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
                {data && data.map((session, index) => (<>
                    
                    <Table.Tr key={index}>
                        <Table.Td>{session.deviceName}</Table.Td>
                        <Table.Td>{session.createdAt}</Table.Td>
                        <Table.Td>
                            {session.revoked ? (<>
                                <Badge className="hidden! md:inline!" color="gray">Logged out</Badge>
                                <FontAwesomeIcon  className='md:hidden!' icon={faUserSlash} />
                            </>) : session.expired ? (<>
                                <Badge className="hidden! md:inline!" color="gray">Expired</Badge>
                                <FontAwesomeIcon  className='md:hidden!' icon={faCalendarXmark} />
                            </>) : (<>
                                <Button
                                    className="hidden! md:inline!"
                                    size='xs'
                                    color='green'
                                    loading={revokeMutation.isPending && revokeMutation.variables === session.id}
                                    onClick={() => {
                                        revokeMutation.mutate(session.id);
                                    }}
                                >
                                    Logout
                                </Button>
                                <ActionIcon
                                    className='md:hidden!'
                                    size="sm"
                                    color="green"
                                    radius="xl"
                                    loading={revokeMutation.isPending && revokeMutation.variables === session.id}
                                    onClick={() => {
                                        revokeMutation.mutate(session.id);
                                    }}
                                >
                                    <FontAwesomeIcon size='xs' icon={faRightFromBracket} />
                                </ActionIcon>
                            </>)}
                        </Table.Td>
                    </Table.Tr>

                    {developerMode && (
                        <Code block>
                            {JSON.stringify(session, null, 2)}
                        </Code>
                    )}
                </>))}
                </Table.Tbody>
            </Table>
            <Loading loading={!data} />
        </ResponsiveCard>
    );
}