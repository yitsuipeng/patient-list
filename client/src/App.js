import React, { Component } from "react";
import OrderDialog from "./components/OrderDialog";
import store from "./store/index";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PatientList from "./components/PatientList";
window.store = store;

class AppComponent extends Component {
  render() {
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography color="secondary">
              Patient List
            </Typography>
          </Toolbar>
        </AppBar>
        <PatientList />
        <OrderDialog />
      </div>
    );
  }
}

export default AppComponent;
