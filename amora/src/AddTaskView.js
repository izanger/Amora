import React, { Component } from 'react'
import rebase, { auth, google} from "./rebase.js"
import { Row, Grid, Col } from 'react-bootstrap'
import 'react-responsive-modal/lib/react-responsive-modal.css';
import Modal from 'react-responsive-modal/lib/css';


class AddTaskView extends React.Component {
    constructor() {
      super();
      
      this.state = { 
        open: false,
        contact: "",

      }
    }


    changeFirstName = (event) => {
      const { contact } = this.state;
      const newContact = {
        ...contact,
        firstName: event.target.value
      };
      this.setState({ contact: newContact });
    }
    changeLastName = (event) => {
      const { contact } = this.state;
      const newContact = {
        ...contact,
        lastName: event.target.value
      };
      this.setState({ contact: newContact });
    }
    changePhone = (event) => {
      const { contact } = this.state;
      const newContact = {
        ...contact,
        phone: event.target.value
      };
      this.setState({ contact: newContact });
    }



    // changeFirstName: function (event) {
      // const contact = this.state.contact;
      // contact.firstName = event.target.value;
      // this.setState({ contact: contact });
    // }

//     changeFirstName = () => {
//       const contact = this.state.contact;
//       contact.firstName = event.target.value;
//       this.setState({ contact: contact });

//       this.setState(prevState => ({
//         contact: [...prevState.contact, taskName]
//     }))
//   }
//   changeLastName = () => {
//     const contact = this.state.contact;
//       contact.lastName = event.target.value;
//       this.setState({ contact: contact });
// }
// changePhone = () => {
//   const contact = this.state.contact;
//       contact.phone = event.target.value;
//       this.setState({ contact: contact });
// }
    
    // changeLastName: function (event) {
    //   const contact = this.state.contact;
    //   contact.lastName = event.target.value;
    //   this.setState({ contact: contact });
    // }
  
    // changePhone: function (event) {
    //   const contact = this.state.contact;
    //   contact.phone = event.target.value;
    //   this.setState({ contact: contact });
    // } 



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
          <button onClick={this.onOpenModal}>Add Task</button>
          <Modal open={open} onClose={this.onCloseModal} little>
        <h5> Enter Task Name </h5>
        <input type="text" onChange={this.changeFirstName.bind(this)} value={this.state.contact.firstName}/>
        <br></br>
        <h5> Enter Task Description </h5>
        <input type="text" onChange={this.changeLastName.bind(this)} value={this.state.contact.lastName}/>
        <br></br>
        <h5> Enter Task Estimated time </h5>
        <input type="text" onChange={this.changePhone.bind(this)} value={this.state.contact.phone}/>
        <br></br>
        // SAVE THIS STUFF INTO FIREBASE
        <button onClick={this.addTask} onClick={this.onCloseModal}>Add task</button>
                    {/* {keys.map((key) => {
                        return <div>{this.state.tasks[key]}</div>
                    })} */}
          </Modal>
        </div>
      );
    };
  }
   export default AddTaskView;

  // render: function () {
  //   return (
      // <div>
      //   <input type="text" onChange={this.changeFirstName.bind(this)} value={this.state.contact.firstName}/>
      //   <input type="text" onChange={this.changeLastName.bind(this)} value={this.state.contact.lastName}/>
      //   <input type="text" onChange={this.changePhone.bind(this)} value={this.state.contact.phone}/>
      // </div>
  //   );
  // }
