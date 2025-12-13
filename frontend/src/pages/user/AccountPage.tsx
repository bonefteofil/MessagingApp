import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import { Text, Button, Avatar, Center } from "@mantine/core";

import { getAccountData } from "@api/user";

import LoginHistory from "@user/components/LoginHistory";
import Header from "@components/Header";
import ResponsiveCard from "@components/ResponsiveCard";
import ErrorPage from "@errors/ErrorPage";


export default function AccountPage() {
    const { data, error } = getAccountData();
    const navigate = useNavigate();
    const [cookies] = useCookies(['userId']);

    if (!cookies.userId) return <Navigate to="/" replace />;

    if (error) {
        return (<>
            <Header element={
                <Text ml="md" size="xl" truncate="end">Account Info</Text>
            } />
            <ErrorPage message={error.message} />
        </>);
    }

    return (<>
        <Header element={
            <Text ml="md" size="xl" truncate="end">Account Info</Text>
        } />
        <Outlet />

        <ResponsiveCard title={data?.user.username || "..."}>

            <Center><Avatar size='xl' /></Center>

            <Button mt='sm' radius='md' onClick={() => { navigate("/logout"); }}>
                Logout
            </Button>
            <Button mt='sm' radius='md' color="red" onClick={() => { navigate("/account/delete"); }}>
                Delete Account
            </Button>
        </ResponsiveCard>

        <LoginHistory data={data?.sessions} />
    </>);
}