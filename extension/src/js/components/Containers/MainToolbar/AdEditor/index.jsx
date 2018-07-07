import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import 'codemirror/lib/codemirror.css';
import {Controlled as CodeMirror} from 'react-codemirror2';

import './styles.css';

require('codemirror/mode/htmlmixed/htmlmixed');

export default class AdEditor extends React.PureComponent {
  static propTypes = {
    onEditorLoaded: PropTypes.func,
  };

  static defaultProps = {
    onEditorLoaded: R.T,
  };

  state = {
    editorMounted: false,
  };

  componentDidMount() {
    setTimeout(
      () => {
        this.setState(
          {editorMounted: true},
          () => {
            this.props.onEditorLoaded();
          },
        );
      },
      250,
    );
  }

  render() {
    const {withRef, value, onChange} = this.props;

    if (!this.state.editorMounted)
      return null;

    return (
      <CodeMirror
        ref={withRef}
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
