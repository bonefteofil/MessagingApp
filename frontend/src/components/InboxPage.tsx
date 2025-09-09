import { Avatar, Divider, Group, Stack, Text } from "@mantine/core";
import { getGroups } from "../queries/groupsQueries";
import Error from "./Error";
import type GroupScheme from "../types/group";
import Loading from "./Loading";

interface InboxPageProps {
    setCurrentGroup: (id: GroupScheme | null) => void;
}

export default function InboxPage({setCurrentGroup} : InboxPageProps) {
    const { error, data } = getGroups();

    if (error)
        return <Error message={"Error loading groups: " + error?.message} />;

    return (
        <Stack p={{ base: "xs", sm: "xl" }} gap={0}>
            <Text size="xl" m="md">Wellcome user!</Text>

            <Loading loading={!data} />

            {data && data.map((group: GroupScheme) => (<div key={group.id}>
<Group gap="md" p="xs" align="top"
  classNames={{ root: 'hover:bg-gray-700 cursor-pointer rounded-lg' }}
  onClick={() => { setCurrentGroup(group); }}
>
  <Avatar size="lg" />

                <Stack gap="0" justify="start" className="overflow-hidden h-max flex-1">
                    <Group className="w-full" justify="space-between">
                        <Text size="lg" className="truncate max-w-[60%]"> {group.name} </Text>
                        <Text size="sm" className="ml-auto whitespace-nowrap text-gray-400"> 3 days ago </Text>
                    </Group>

                    <Text size="sm" c="dimmed">Last message </Text>
                </Stack>
                </Group>

                <Divider w={'70%'} mx={'auto'} />
            </div>))}
        </Stack>
    );
}