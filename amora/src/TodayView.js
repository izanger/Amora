import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import rebase from "./rebase.js"


// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle, multiplier, color) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  height: grid * multiplier * 3.75,
  margin: `0 0 ${15}px 0`,
  padding: '5px',

  // change background colour if dragging
  //background: isDragging ? 'lightgreen' : 'grey',
  background: color,
  'border-radius': '5px',
  'color': 'white',
  'font-size': '11pt',
  'text-align': 'left',


  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: grid,
  width: '350px',
  height: '100%',

});

class TodayView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        items: getItems(10),
        viewSynced: false,
        tasks: []
      };
      this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount = () => {
      const newState = { ...this.state }
      let userID = this.props.getAppState().user.uid
      console.log(userID)
      rebase.fetch(`users/${userID}/todayView`, {
          context: this,
          then: (data) => {
              newState.tasks = data
          }
      }).then(() => {
          this.bindingref = rebase.syncState(`users/${userID}/todayView`, {
              context: this,
              state: 'tasks',
              then: () => {
                newState.viewSynced = true
                this.setState(newState)
              }
          })
      })
  }

  // componentWillReceiveProps = (nextProps) => {
  //     const nextId = nextProps.match.params.id
  //     this.setState({projectSynced: false})
  //     if (nextId !== this.props.match.params.id) {
  //         this.setState({projectSynced: false})
  //         if (this.bindingref) {
  //             rebase.removeBinding(this.bindingref)
  //         }
  //         const newState = { ...this.state }
  //         rebase.fetch(`projects/${nextId}`, {
  //             context: this,
  //             then: (data) => {
  //                 newState.project = data
  //             }
  //         }).then(() => {
  //             this.bindingref = rebase.syncState(`projects/${nextId}`, {
  //                 context: this,
  //                 state: 'project',
  //                 then: () => {
  //                     newState.projectSynced = true
  //                     this.setState(newState)
  //                 }
  //             })
  //         })
  //     }
  //     this.setState({projectSynced: true})
  // }

  componentWillUnmount = () => {
      this.setState({
          viewSynced: false
      })
  }

    onDragEnd(result) {
      //dropped outside the list
      if (!result.destination) {
        return;
      }
      console.log(result);
      console.log("hello")


      // if (source.droppableId === destination.droppableId) {
      //   const reordered = reorder(
      //     current,
      //     source.index,
      //     destination.index,
      //   );
      //   // const result: QuoteMap = {
      //   //   ...quoteMap,
      //   //   [source.droppableId]: reordered,
      //   // };
      //   // return {
      //   //   quoteMap: result,
      //   //   // not auto focusing in own list
      //   //   autoFocusQuoteId: null,
      //   // };
      // }

      // moving to different list

      // remove from original
      // current.splice(source.index, 1);
      // // insert into next
      // next.splice(destination.index, 0, target);

      // const result: QuoteMap = {
      //   ...quoteMap,
      //   [source.droppableId]: current,
      //   [destination.droppableId]: next,
      // };

      const items = reorder(
        this.state.items,
        result.source.index,
        result.destination.index,
      );

      this.setState({
        items
      });
    }


    testfunction = (completed, name) => {
      if (completed){
        return '<strike>'+ name +'</strike>'
    }else {
        return name
    }

    }




    render = () => {
      let finalRender
      let taskArr = []
      console.log("Checkpoint1")
      if (this.state.viewSynced){
        console.log("Checkpoint2")
        console.log(this.state.tasks.length)
        console.log(this.state.tasks)
        if (this.state.tasks){

          // for (var task in this.state.tasks){
             let tasks = (Object.values(this.state.tasks))
          //   taskArr.push(task)
          // }

          finalRender = (
              <div>
              <div id="myDayTitleContainer">
                  <h1>My Day</h1>
              </div>
              <div style={{'overflow-y': 'scroll', height: '100%'}}>
        <Droppable droppableId="TodayView">

                  {(provided, snapshot) => (
                  <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>

                  {Object.keys(this.state.tasks).map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                      {(provided, snapshot) => (
                      <div>
                      <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                           snapshot.isDragging,
                              provided.draggableProps.style, tasks[index].EstimatedTimeValue, tasks[index].color
                          )}
                          >
                          {/* console.log("hi") */}
                          {/* put tasks here */}
                          { console.log(tasks[index].estimatedTimeValue) }
                          {/* {tasks} */}
                          {this.testfunction(tasks[index].completed, tasks[index].taskName)}


                          </div>
                          {provided.placeholder}
                      </div>
                      )}
                  </Draggable>
                  ))}
                  {provided.placeholder}
              </div>
              )}
                   </Droppable>
                   </div>
                   </div>
          )
        }
        else {
          <div>Hello</div>

        }




      }
      return (
        <div>
                    <div>{finalRender}
          </div>

        </div>


//  <Droppable droppableId="TodayView">
//             {(provided, snapshot) => (
//               <div
//                 ref={provided.innerRef}
//                 style={getListStyle(snapshot.isDraggingOver)}
//               >
//                 {this.state.items.map((item, index) => (
//                   <Draggable key={item.id} draggableId={item.id} index={index}>
//                     {(provided, snapshot) => (
//                       <div>
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           style={getItemStyle(
//                             snapshot.isDragging,
//                             provided.draggableProps.style
//                           )}
//                         >
//                           {item.content}
//                         </div>
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>

          )

    }
  }

  export default TodayView;
