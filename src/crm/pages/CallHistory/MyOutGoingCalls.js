
import { memo } from "react";
import CallComponent from "./CallComponent";

const MyOutGoingCalls = () => {
    const fromNumber = "9822599905";
    return (
        <>
            <CallComponent callType={"MyOutgoing"} number={fromNumber} />
        </>
    );
};

export default memo(MyOutGoingCalls);
