import React, { Component } from 'react'
import rebase from "../rebase";

class FilterSelection extends Component {
    constructor() {
        super()
        this.state = {
            //filter: "Default",
            //filtersSynced: false,

        }
    }

    handleSelect = (event) => {
        rebase.update(`users/${this.props.getAppState().user.uid}/projects/${this.props.project.key}`,{
            data: {
                filter: event.target.value
            }
        })
    }

    renderFilterOptions = () => {
        let filterOptions = []
        filterOptions.push(<option key={0} value={"Default"}>{"Default"}</option>)
        filterOptions.push(<option key={1} value={"Chronological"}>{"Chronological"}</option>)
        filterOptions.push(<option key={2} value={"Priority"}>{"Priority"}</option>)
        filterOptions.push(<option key={3} value={"Deadline"}>{"Deadline"}</option>)
        filterOptions.push(<option key={4} value={"Time to Complete (Ascending)"}>{"Time to Complete (Ascending)"}</option>)
        filterOptions.push(<option key={5} value={"Time to Complete (Descending)"}>{"Time to Complete (Descending)"}</option>)

        var i = 6;
        for(var category in this.props.project.taskCategories){
            filterOptions.push(<option key={i} value={category}>{"Task Category: " + category}</option>)
            i++;
        }
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
                    <select value={this.props.getAppState().user.projects[this.props.project.key].filter} onChange={this.handleSelect} name="dropdown" id="categoryDropdown">
                        {filterOptions}
                    </select>
                </div>

            </div>
        )
    }

}
export default FilterSelection