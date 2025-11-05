import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { FetchServerStatus } from "@utils/fetchServerStatus";
import { FetchUserStatus } from "@user/api";

import CurrentUserContext from "@user/Context";

import ServerDownPage from "@errors/ServerDownPage";


export default function Status() {
    const { error } = FetchServerStatus();
    const { isLoading, data, isFetching } = FetchUserStatus();

    const { setCurrentUser } = useContext(CurrentUserContext);
    const [finished, setFinished] = useState(false);
    
    useEffect(() => {
        if (data && data !== "Unauthorized")
            setCurrentUser({id: data, username: "Unknown"});
        setFinished(data);
    }, [data]);

    if (error) return <ServerDownPage />;
    if (isLoading || isFetching || !finished) return null;
    return <Outlet />;
}