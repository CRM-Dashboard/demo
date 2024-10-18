import { memo } from "react";
import CallComponent from "./CallComponent";
import { useSelector } from "react-redux";


const RefactorIncomingCalls = () => {
    const reducerData = useSelector((state) => state);

    const customerMobileNumber = reducerData?.dashboard?.customerContactNo;
    return (
        <>
            <CallComponent callType={"Outgoing"} number={customerMobileNumber} />
        </>
    );
};

export default memo(RefactorIncomingCalls);
