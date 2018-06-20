import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
state = {
    text: ""
};

handleChange = (e) => {
    const newText = e.target.value;
    this.setState({
        text: newText
    })
}

handleKeyDown = (e) => {
    console.log(e);
    if (e.key === 'Enter') {
        this.props.submit(this.state.text);
        this.setState({text: ""});
    }
 }

    render () {
        const { text } = this.state;
        return (
            <TextField
            label="Add a new todo..."
            margin="normal"
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            value={text}
            multiline
            rowsMax="4"
            fullWidth
          />
        )
    }
}