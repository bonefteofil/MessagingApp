import { Outlet } from "react-router-dom";

import { FetchServerStatus } from "@utils/fetchServerStatus";

import ServerDownPage from "@errors/ServerDownPage";


export default function Status() {
    const { error, isLoading } = FetchServerStatus();

    if (error) return <ServerDownPage />;
    if (isLoading) return null;
    return <Outlet />;
}