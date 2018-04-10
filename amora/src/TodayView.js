import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import rebase from "./rebase.js"

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
            viewSynced: false,
            tasks: []
        };
    }

    componentDidMount = () => {
        const newState = { ...this.state }
        let userID = this.props.getAppState().user.uid
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

    componentWillUnmount = () => {
        this.setState({
            viewSynced: false
        })
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
        let n = 0;
        if (this.state.viewSynced){
            if (this.state.tasks){
                var tasks = (Object.values(this.state.tasks))
                var keys = (Object.keys(this.state.tasks))
                n = tasks.length

                //bubblesort to get indices correct
                var i;
                var j;
                for (i = 0; i < n-1; i++){
                    for (j = 0; j < n-i-1; j++){
                        if (tasks[j].index > tasks[j+1].index){
                            let temp = tasks[j];
                            tasks[j] = tasks[j+1];
                            tasks[j+1] = temp;

                            let temp1 = keys[j];
                            keys[j] = keys[j+1];
                            keys[j+1] = temp1
                        }
                    }
                }

                finalRender = (
                    <div>
                        <div id="myDayTitleContainer">
                            <h1>My Day</h1>
                        </div>
                        <div style={{'overflow-y': 'scroll', height: '100%'}}>

                            <Droppable droppableId="TodayView">

                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>

                                        {Object.keys(keys).map((item, index) => (
                                            <Draggable key={item} draggableId={keys[index]} index={index}>
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
                <div></div>
            }
        }
        return (
            <div>
                <div>{finalRender}
                </div>

            </div>
        )
    }
}

export default TodayView;
