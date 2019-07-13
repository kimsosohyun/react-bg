
import  reducers from "./reducers";
import  thunk from "redux-thunk";
import  {composeWithDevTools}  from "redux-devtools-extension";
import  {createStore,applyMiddleware}  from "redux";

export default  createStore(reducers,composeWithDevTools(applyMiddleware(thunk)
));
