const setAccountStmt = (accountStmt) => {
  return {
    type: "ACCOUNT_STATEMENT",
    payload: accountStmt,
  };
};

const setSearchKey = (sKey) => {
  return {
    type: "SEARCH_KEY",
    payload: sKey,
  };
};

const setOrderId = (oId) => {
  return {
    type: "ORDER_ID",
    payload: oId,
  };
};

const setSid = (sid) => {
  return {
    type: "S_ID",
    payload: sid,
  };
};

const setActivityData = (data) => {
  return {
    type: "ACTIVITY_DATA",
    payload: data,
  };
};

const exportDefault = {
  setActivityData,
  setAccountStmt,
  setSearchKey,
  setOrderId,
  setSid,
};

export default exportDefault;
