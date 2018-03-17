import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

  const getSecondItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k+9}`,
    content: `item ${k+9}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
});

class TodayView extends Component {
    constructor(props) {
      super(props);
      this.state = {
        items: getItems(10),
        secondItems: getSecondItems(10)
      };
      this.onDragEnd = this.onDragEnd.bind(this);
    }
  
    onDragEnd(result) {
      //dropped outside the list
      if (!result.destination) {
        return;
      }
      console.log(result);


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

      if (result.destination.droppableId === "droppable" && result.source.droppableId === "droppable1"){
          //add to secondItems
          const newState = { ...this.state }
        newState.secondItems = 
        this.setState(newState)
      }
  
      const items = reorder(
        this.state.items,
        result.source.index,
        result.destination.index,
      );

      const secondItems = reorder (
        this.state.secondItems,
        result.source.index,
        result.destination.index,

      );
  
      this.setState({
        items
      });
    }
  
    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
      return (
        //  <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {item.content}
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
         //{/* </DragDropContext> */}
          )
            {/* //</DragDropContext> */}
    }
  }
  
  // Put the thing into the DOM!
  //ReactDOM.render(<TodayView />, document.getElementById('root'));
  export default TodayView;
  