import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'

import amoraLogo from "./images/amora_logo.png"

class PoppedOutProfile extends React.Component {
  constructor(props) { super(props) }

  render() {
    return (
      <div>
        {this.props.profile.map(msg =>
          <div>
            {item.date}
            <pre>{msg.text}</pre>
          </div>
        )}
      </div>
    )
  }
}