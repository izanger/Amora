import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"

class Profile extends React.Component {
    constructor(props) {
    super(props)
    this.popout = this.popout.bind(this)
    this.state = {
      poppedOut: false
    }
  }

  popout() {
    this.setState({ poppedOut: true });
  }

  render() {
    if (this.state.isPoppedOut) {
        return (
          <Popout title='Window title' onClosing={this.popupClosed}>
            <PoppedOutProfile messages={this.props.messages} />
          </Popout>
        );
      } else {
        return (
          <div>
          <span onClick={this.popout} className="buttonGlyphicon glyphicon glyphicon-export"></span>
            {this.props.messages.map(msg =>
              <div>
                {msg.date}
                <pre>{msg.text}</pre>
              </div>
            )}
          </div>
        );
      }
  }

}