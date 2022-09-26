import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import store from "../store/index";
import { OPEN } from "../constants/actionTypes";
import { getPatients } from "../actions/index";

window.store = store;

const styles = theme => ({
  root: {
    width: "100%",
    height: 360,
    backgroundColor: theme.palette.background.paper
  },
  avatar: {
    color: "#fff",
    backgroundColor: "#F00"
  }
});

class PatientList extends React.Component {
  state = {
    patients: []
  };

  componentDidMount() {
    store.dispatch(getPatients());
    this.setState({
      patients: store.getState()["patients"],
    });

    store.subscribe(() => {
      this.setState({
        patients: store.getState()["patients"],
      });
    });
  }

  handleOpenDialog = value => () => {
    store.dispatch({
      type: OPEN,
      payload: value
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {this.state.patients.map(value => (
            <ListItem
              key={value.Id}
              dense
              button
              className={classes.listItem}
              onClick={this.handleOpenDialog(value)}
            >
              <ListItemText primary={value.Name} secondary={value.Id} />

            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

PatientList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PatientList);
