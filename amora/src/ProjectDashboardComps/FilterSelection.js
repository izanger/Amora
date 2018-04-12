import React, { Component } from 'react'
import rebase from "../rebase";

class FilterSelection extends Component {
    constructor() {
        super()
        this.state = {
            filter: "",
            filtersSynced: false,

        }
    }

    componentWillMount = () => {
        this.bindingref = rebase.syncState(`users/${this.props.getAppState().user.uid}/projects/${this.props.project.key}/filter`, {
            context: this,
            state: 'filter',
            then: () => {
                const newState = { ...this.state }
                newState.filtersSynced = true;
                newState.filter = "Priority"
                this.setState(newState)
            }
        })

    }

    handleSelect = (event) => {
        const newState = { ...this.state }
        newState.filter = event.target.value
        this.setState(newState)
    }

    renderFilterOptions = () => {
        let filterOptions = []
            filterOptions.push(<option key={0} value={"Default"}>{"Default"}</option>)
            filterOptions.push(<option key={1} value={"Priority"}>{"Priority"}</option>)
            filterOptions.push(<option key={2} value={"Due Date"}>{"Due Date"}</option>)
            filterOptions.push(<option key={3} value={"Time to Complete (Ascending)"}>{"Time to Complete (Ascending)"}</option>)
            filterOptions.push(<option key={4} value={"Time to Complete (Descending)"}>{"Time to Complete (Descending)"}</option>)

            var i = 5;
            for(var category in this.props.project.taskCategories){
                filterOptions.push(<option key={i} value={category}>{"Task Category: " + category}</option>)
                i++;
            }
        // if(this.state.filtersSynced){ //Filter is synced so we know which one is selected already
        //     switch (this.state.filter){
        //         case "Default":
        //             filterOptions.push(<option key={0} value={"0"} selected="selected">{"Default"}</option>)
        //             filterOptions.push(<option key={1} value={"1"}>{"Priority"}</option>)
        //             filterOptions.push(<option key={2} value={"2"}>{"Due Date"}</option>)
        //             filterOptions.push(<option key={3} value={"3"}>{"Time to Complete (Ascending)"}</option>)
        //             filterOptions.push(<option key={4} value={"4"}>{"Time to Complete (Descending)"}</option>)
        //             break;
        //         case "Priority":
        //             filterOptions.push(<option key={0} value={"0"}>{"Default"}</option>)
        //             filterOptions.push(<option key={1} value={"1"} selected="selected">{"Priority"}</option>)
        //             filterOptions.push(<option key={2} value={"2"}>{"Due Date"}</option>)
        //             filterOptions.push(<option key={3} value={"3"}>{"Time to Complete (Ascending)"}</option>)
        //             filterOptions.push(<option key={4} value={"4"}>{"Time to Complete (Descending)"}</option>)
        //             break;
        //         case "Due Date":
        //             filterOptions.push(<option key={0} value={"0"}>{"Default"}</option>)
        //             filterOptions.push(<option key={1} value={"1"}>{"Priority"}</option>)
        //             filterOptions.push(<option key={2} value={"2"} selected="selected">{"Due Date"}</option>)
        //             filterOptions.push(<option key={3} value={"3"}>{"Time to Complete (Ascending)"}</option>)
        //             filterOptions.push(<option key={4} value={"4"}>{"Time to Complete (Descending)"}</option>)
        //             break;
        //         case "Time to Complete (Ascending)":
        //             filterOptions.push(<option key={0} value={"0"}>{"Default"}</option>)
        //             filterOptions.push(<option key={1} value={"1"}>{"Priority"}</option>)
        //             filterOptions.push(<option key={2} value={"2"}>{"Due Date"}</option>)
        //             filterOptions.push(<option key={3} value={"3"} selected="selected">{"Time to Complete (Ascending)"}</option>)
        //             filterOptions.push(<option key={4} value={"4"}>{"Time to Complete (Descending)"}</option>)
        //             break;
        //         case "Time to Complete (Descending)":
        //             filterOptions.push(<option key={0} value={"0"}>{"Default"}</option>)
        //             filterOptions.push(<option key={1} value={"1"}>{"Priority"}</option>)
        //             filterOptions.push(<option key={2} value={"2"}>{"Due Date"}</option>)
        //             filterOptions.push(<option key={3} value={"3"}>{"Time to Complete (Ascending)"}</option>)
        //             filterOptions.push(<option key={4} value={"4"} selected="selected">{"Time to Complete (Descending)"}</option>)
        //             break;
        //         default:
        //             filterOptions.push(<option key={0} value={"0"}>{"Default"}</option>)
        //             filterOptions.push(<option key={1} value={"1"}>{"Priority"}</option>)
        //             filterOptions.push(<option key={2} value={"2"}>{"Due Date"}</option>)
        //             filterOptions.push(<option key={3} value={"3"}>{"Time to Complete (Ascending)"}</option>)
        //             filterOptions.push(<option key={4} value={"4"}>{"Time to Complete (Descending)"}</option>)
        //     }

        //     var i = 5;
        //     for(var category in this.props.project.taskCategories){
        //         if(category === this.state.filter){
        //             filterOptions.push(<option key={i} value={i.toString()} selected="selected">{"Task Category: " + category}</option>)
        //         } else {
        //             filterOptions.push(<option key={i} value={i.toString()}>{"Task Category: " + category}</option>)
        //         }
        //         i++;
        //     }

        // } else {
        //     filterOptions.push(<option key={0} value={"0"} selected="selected">{"Default"}</option>)
        //     filterOptions.push(<option key={1} value={"1"}>{"Priority"}</option>)
        //     filterOptions.push(<option key={2} value={"2"}>{"Due Date"}</option>)
        //     filterOptions.push(<option key={3} value={"3"}>{"Time to Complete (Ascending)"}</option>)
        //     filterOptions.push(<option key={4} value={"4"}>{"Time to Complete (Descending)"}</option>)

        //     var i = 5;
        //     for(var category in this.props.project.taskCategories){
        //         filterOptions.push(<option key={i} value={i.toString()}>{"Task Category: " + category}</option>)
        //         i++;
        //     }
        // }
        return filterOptions
    }

    render = () => {
        let filterOptions = this.renderFilterOptions()
        return (
            <div>
                <div style={{display: 'flex', 'flex-direction': 'row', marginLeft: '14px', marginTop: '6px', color: 'white'}}>
                    <p className="text_header">{this.props.title}</p>
                    <p style={{marginLeft: '10px', marginRight: '10px', marginTop: '-1px', fontSize: '15pt'}}>|</p>
                </div>

                <h2>Filter Tasks By:</h2>

                <div>
                    <select value={this.state.filter} onChange={this.handleSelect} name="dropdown" id="categoryDropdown">
                     {filterOptions}
                    </select>
                </div>

            </div>
        )
    }

}
export default FilterSelection