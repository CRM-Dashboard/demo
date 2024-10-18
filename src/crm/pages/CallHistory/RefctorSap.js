import { memo } from "react";
import CallComponent from "./CallComponent";
const RefctorSap = () => {
    return (
        <>
            <CallComponent callType={"SAPCall"} />
        </>
    )
}

export default memo(RefctorSap);




