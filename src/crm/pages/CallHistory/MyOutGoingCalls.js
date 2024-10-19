import { memo } from "react";
import CallComponent from "./CallComponent";
import { useSelector } from "react-redux";

const MyOutGoingCalls = () => {
  const number = useSelector(
    (state) => state?.LoginReducer?.loggedInUser?.mobile
  );
  return (
    <>
      <CallComponent callType={"MyOutgoing"} number={number} />
    </>
  );
};

export default memo(MyOutGoingCalls);
