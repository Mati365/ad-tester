import React from 'react';

import 'codemirror/lib/codemirror.css';
import {UnControlled as CodeMirror} from 'react-codemirror2';

import './styles.css';

require('codemirror/mode/xml/xml');
require('codemirror/mode/htmlmixed/htmlmixed');

const AdEditor = () => (
  <CodeMirror
    value='AD CODE'
    options={{
      mode: 'htmlmixed',
      theme: 'default',
      lineNumbers: true,
      indentWithTabs: false,
      tabSize: 2,
    }}
  />
);

AdEditor.displayName = 'AdEditor';

export default AdEditor;
