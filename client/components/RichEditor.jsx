import React, { PropTypes } from 'react'
import TinyMCE from 'react-tinymce'
import _isEqual from 'lodash/isEqual'
// import _isEmpty from 'lodash/isEmpty'

class RichEditor extends React.PureComponent {

  shouldComponentUpdate(nextProps, nextState) {
    console.log(_isEqual(this.props.value, nextProps.value));
    return !!this.editor.initialized
      && (!_isEqual(this.props.config, nextProps.config)
      || !_isEqual(this.props.value, nextProps.value));
    // return super.shouldComponentUpdate(nextProps, nextState) && this.editor.initialized;
  }

  setupEditor(editor) {
    this.editor = editor;
  }

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    if (this.props.onChange) {
      this.props.onChange(content);
    }
  }

  render() {
    return (<TinyMCE
      content={this.props.value}
      config={{
        plugins: 'link image code',
        language: 'zh_CN',
        setup: ::this.setupEditor,
        min_height: document.body.clientHeight - 450
      }}
      onChange={::this.handleEditorChange}
    />);
  }
}

RichEditor.propTypes = {
  value: PropTypes.string
}

export default RichEditor;