import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { PersistGate } from "redux-persist/es/integration/react";

import rootReducer from "../src/reducer/rootReducer";
import { legacy_createStore as createStore } from "redux";
import "./crm/utils/GlobalCss.css";
import "./crm/utils/Theme.css";

const persistConfig = {
  key: "ocRoot",
  storage: storageSession,
};

const enhancers = [];
const middlewares = [thunk];

const composedEnhancers = compose(
  composeWithDevTools(applyMiddleware(...middlewares)),
  ...enhancers
);

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, composedEnhancers);
const persistor = persistStore(store);

// const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware(thunk)),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );
document.title = "CRM";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />{" "}
    </PersistGate>
  </Provider>
);
