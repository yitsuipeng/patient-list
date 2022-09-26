import React from "react";
import Button from "@material-ui/core/Button";
import ToggleButton from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import store from "../store/index";
import { CLOSE } from "../constants/actionTypes";
import { createOrder, getPatients } from "../actions/index";
import AddIcon from "@material-ui/icons/Add";
import { Tooltip } from "@material-ui/core";
window.store = store;

export default class OrderDialog extends React.Component {
  state = {
    open: false,
    patient: {
      Id: "",
      Name: "",
      OrderId: null
    },
    message:null,
    plus:false,
    helperText:null
  };

  handlePlus = async() => {
    this.setState({ 
      plus: !this.state.plus,
      message: this.state.patient.OrderId ? this.state.patient.OrderId.message : null,
      helperText: null
    });
  };

  handleClose = async() => {
    this.setState({ 
      plus: false,
      message: null,
      helperText: null 
    });
    store.dispatch({ type: CLOSE });
  };

  handleChange = name => event => {
    this.setState({ message: event.target.value });};

  handleSave = async() => {
    if (this.state.message == null || this.state.message.length == 0) {
      this.setState({ helperText: "不可為空" });
    } else {
      await store.dispatch(createOrder(this.state.patient.Id, { message: this.state.message }));
      await this.handleClose();
      await store.dispatch(getPatients());
    }
  };

  componentDidMount() {
    store.subscribe(() => {
      this.setState({
        open: store.getState()["orderState"]["openDialog"],
        patient: store.getState()["orderState"]["patient"],
      });
    });
  }

  render() {
    return (
      <div>
        <Dialog
          fullWidth
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Order
            <Tooltip title="新增 / 更新醫囑">
              <ToggleButton
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10
                }}
                selected={this.state.plus}
                onClick={this.handlePlus}
                color="secondary"
              >
                <AddIcon />
              </ToggleButton>
            </Tooltip>
          </DialogTitle>

          <DialogContent>
            {this.state.plus == false ? 
              this.state.patient.OrderId == null ? 
                <DialogContentText>無</DialogContentText>
                : 
                <DialogContentText>{this.state.patient.OrderId.message}</DialogContentText>
            :
              <DialogActions>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label={this.state.patient.OrderId == null ? "新增醫囑" : "更新醫囑"}
                multiline
                fullWidth
                defaultValue={this.state.message}
                onChange={this.handleChange("multiline")}
                helperText={this.state.helperText}
              />
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
            }
          </DialogContent>


        </Dialog>
      </div>
    );
  }
}
