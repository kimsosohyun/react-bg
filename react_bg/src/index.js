import React from 'react';
import ReactDOM from 'react-dom';

import Login from "./containers/login";
import Register from "./containers/register";
import  Main from "./containers/main1"
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import store  from  "./redux/store";
import  {Provider} from "react-redux";
import "./assets/index.less";


ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
          <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route  component={Main} />
          </Switch>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);


