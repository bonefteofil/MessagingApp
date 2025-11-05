import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { FetchServerStatus } from "@utils/fetchServerStatus";
import { FetchUserStatus } from "@user/api";

import CurrentUserIdContext from "@user/Context";

import ServerDownPage from "@errors/ServerDownPage";


export default function Status() {
    const { error } = FetchServerStatus();
    const { isLoading, data, isFetching } = FetchUserStatus();

    const { setCurrentUserId } = useContext(CurrentUserIdContext);
    const [finished, setFinished] = useState(false);
    
    useEffect(() => {
        if (data && data !== "Unauthorized")
            setCurrentUserId(data);
        setFinished(data);
    }, [data]);

    if (error) return <ServerDownPage />;
    if (isLoading || isFetching || !finished) return null;
    return <Outlet />;
}