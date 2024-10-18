
import { memo } from "react";
import CallComponent from "./CallComponent";

const MyInComingCalls = () => {
    const toNumber = "9822599905";
    return (
        <>
            <CallComponent callType={"MyIncoming"} number={toNumber} />
        </>
    );
};

export default memo(MyInComingCalls);
