import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'
import ReactDOM from 'react-dom';
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';

import amoraLogo from "./images/amora_logo.png"

class PoppedOutProfile extends React.Component {
  constructor() {
    super();

    this.state = { open: false }
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    return (
      <div>
        <button onClick={this.onOpenModal}>Profile Image Goes Here</button>
        <Modal open={open} onClose={this.onCloseModal} little>
          <h2>Simple centered modal.<br/><br/>Here is some more text.<br/><br/>The rest of it.</h2>
        </Modal>
      </div>
    );
  }
}

export default PoppedOutProfile;