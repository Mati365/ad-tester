import React from 'react';

import 'codemirror/lib/codemirror.css';
import {Controlled as CodeMirror} from 'react-codemirror2';

import './styles.css';

require('codemirror/mode/htmlmixed/htmlmixed');

export default class AdEditor extends React.PureComponent {
  state = {
    editorMounted: false,
  };

  componentDidMount() {
    setTimeout(
      () => this.setState({editorMounted: true}),
      500,
    );
  }

  render() {
    const {value, onChange} = this.props;

    if (!this.state.editorMounted)
      return null;

    return (
      <CodeMirror
        value={value}
        options={{
          mode: 'htmlmixed',
          theme: 'default',
          lineNumbers: true,
          tabSize: 2,
        }}
        onBeforeChange={(editor, data, newValue) => {
          if (onChange && newValue !== value)
            onChange(newValue);
        }}
      />
    );
  }
}
