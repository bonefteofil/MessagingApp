import { Table, Badge } from '@mantine/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCalendarXmark, faUserSlash } from '@fortawesome/free-solid-svg-icons';

import ResponsiveCard from '@components/ResponsiveCard';
import Loading from '@components/Loading';

import type { SessionDetails } from '@user/schema';


export default function LoginHistory({data} : {data: SessionDetails[] | undefined}) {
    return (
        <ResponsiveCard title="Login History">
            <Table horizontalSpacing="xs" verticalSpacing="xs">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Device</Table.Th>
                        <Table.Th>Time</Table.Th>
                        <Table.Th align="center">Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                {data && data.map((session, index) => (
                    
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
                                <Badge className="hidden! md:inline!" color="green">Active</Badge>
                                <FontAwesomeIcon  className='md:hidden!' color='green' icon={faBolt} />
                            </>)}
                        </Table.Td>
                    </Table.Tr>

                ))}
                </Table.Tbody>
            </Table>
            <Loading loading={!data} />
        </ResponsiveCard>
    );
}