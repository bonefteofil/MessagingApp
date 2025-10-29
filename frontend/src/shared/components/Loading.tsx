import { Skeleton, Stack } from "@mantine/core";

export default function Loading({loading} : {loading: boolean}) {
    if (!loading) return null;
    return (
        <Stack>
            <Skeleton p={16} height={48} radius='lg' width='70%' />
            <Skeleton p={16} height={48} radius='lg' width='30%' />
            <Skeleton p={16} height={48} radius='lg' width='70%' />
            <Skeleton p={16} height={48} radius='lg' width='30%' />
        </Stack>
    );
}
        