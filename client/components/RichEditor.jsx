import React, { PropTypes } from 'react'
import TinyMCE from 'react-tinymce'
import _isEqual from 'lodash/isEqual'
import EditorConfig from './editorConfig'
import _isEmpty from 'lodash/isEmpty'
import SelectImgModal from './selectImgModal'

class RichEditor extends React.PureComponent {

  state = {
    chooseImgVisible: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value && _isEmpty(nextProps.value)) {
      this.setContent('');
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!this.editor.initialized
      && (!_isEqual(this.props.config, nextProps.config)
          || !_isEqual(this.state, nextState));
    // return super.shouldComponentUpdate(nextProps, nextState) && this.editor.initialized;
  }

  setupEditor(editor) {
    this.editor = editor;
  }

  setContent(text = '') {
    if (this.editor) {
      this.editor.setContent(text);
    }
  }

  handleEditorChange = (e) => {
    const content = e.target.getContent();
    const { onChange } = this.props;
    if (onChange) {
      onChange(content);
    }
  }

  handleEditorBlur = (e) => {
    const content = e.target.getContent();
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(content);
    }
  }

  openChooseImg() {
    console.log(111);
    this.setState({
      chooseImgVisible: true
    })
  }

  handleChooseImg(checkedImgs) {
    this.setState({
      chooseImgVisible: false
    });
    const one = checkedImgs[0];
    console.log(checkedImgs);
  }

  cancelChooseImg() {
    this.setState({
      chooseImgVisible: false
    });
  }

  render() {
    const config = Object.assign({}, {
      language: 'zh_CN',
      setup: ::this.setupEditor,
      min_height: document.body.clientHeight - 450,
      chooseImgFn: ::this.openChooseImg
    }, EditorConfig)
    const chooseProps = {
      visible: this.state.chooseImgVisible,
      onOk: ::this.handleChooseImg,
      onCancel: ::this.cancelChooseImg,
      canSelectCount: 10,
      width: 864
    }
    return (
      <div>
        <TinyMCE
          content={this.props.value}
          config={config}
          onChange={::this.handleEditorChange}
          onBlur={::this.handleEditorBlur}
        />
        <SelectImgModal {...chooseProps} />
      </div>
    );
  }
}

RichEditor.propTypes = {
  value: PropTypes.string
}

export default RichEditor;
