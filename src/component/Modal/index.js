import React, { Component } from "react";
//check props
import propTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import CloseIcon from "@material-ui/icons/Clear";
//css
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";
//store
import { connect } from "react-redux";
import * as modalActions from "./../../actions/modal";
import { bindActionCreators } from "redux";
class CommonModal extends Component {
  render() {
    const {
      classes,
      showModal,
      title,
      component,
      modalActionsCreator,
    } = this.props;
    const { hideModal } = modalActionsCreator;
    return (
      <Modal open={showModal} onClose={hideModal}>
        <div className={classes.modal}>
          {/* header của modal */}
          <div className={classes.header}>
            <span className={classes.title}>{title}</span>
            {/* Icon X ở bên phải */}
            <CloseIcon className={classes.icon} onClick={hideModal} />
          </div>
          <div className={classes.content}>{component}</div>
        </div>
      </Modal>
    );
  }
}

CommonModal.propTypes = {
  showModal: propTypes.bool,
  title: propTypes.string,
  component: propTypes.object,
  classes: propTypes.object,
  modalActionsCreator: propTypes.shape({
    hideModal: propTypes.func,
  }),
};

const mapStateToProps = (state) => {
  return {
    showModal: state.modal.showModal,
    title: state.modal.title,
    component: state.modal.component,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CommonModal));
