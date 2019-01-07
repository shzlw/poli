
import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/theme/xcode';

class Test extends React.PureComponent {

  onChange = (newValue) => {
    console.log('change',newValue);
  }

  submit = () => {
    console.log('submit', );
  }

  render() {
    return (
      <div>
        <AceEditor
          mode="mysql"
          theme="xcode"
          name="blah2"
          onChange={this.onChange}
          height={'300px'}
          width={'300px'}
          fontSize={18}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 2,
            }}
          />
          <button onClick={this.submit}>Submit</button>
      </div>
    )
  }
}

export default Test;
