import { memo } from "react";
import CallComponent from "./CallComponent";
import { useSelector } from "react-redux";

const MyInComingCalls = () => {
  const number = useSelector(
    (state) => state?.LoginReducer?.loggedInUser?.mobile
  );
  return (
    <>
      <CallComponent callType={"MyIncoming"} number={number} />
    </>
  );
};

export default memo(MyInComingCalls);
