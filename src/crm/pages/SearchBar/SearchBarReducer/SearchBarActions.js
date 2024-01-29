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

const exportDefault = {
  setAccountStmt,
  setSearchKey,
  setOrderId,
};

export default exportDefault;
