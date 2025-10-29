import { Card, Stack, Text, Title } from "@mantine/core";


export default function ResponsiveCard({children, title} : { children?: React.ReactNode, title?: string}) {
    return (
        <Card shadow="lg" padding="lg" w="90%" maw="600" withBorder mt='xl' mx='auto' radius='lg'>
            <Stack gap='sm'>
                {title && (
                    <Title order={2} >
                        <Text ta="center" inherit variant="gradient" >
                            {title}
                        </Text>
                    </Title>
                )}
                {children}
            </Stack>
        </Card>
    );
}