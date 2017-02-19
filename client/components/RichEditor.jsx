import React, { PropTypes } from 'react'
import TinyMCE from 'react-tinymce'
import _isEqual from 'lodash/isEqual'
import EditorConfig from './editorConfig'
import _isEmpty from 'lodash/isEmpty'
import SelectImgModal from './selectImgModal'

class RichEditor extends React.PureComponent {

  state = {
    chooseImgKey: Math.random() * 100,
    chooseImgVisible: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      if (_isEmpty(nextProps.value)) {
        this.setContent('')
      } else {
        this.setContent(nextProps.value);
      }
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
      const curText = this.editor.getContent().trim();
      const tarText = text.trim();
      if (curText !== tarText) {
        this.editor.setContent(text);
      }
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
    const imgElm = this.editor.selection.getNode();
    const isImgElm = imgElm.nodeName === 'IMG';
    const chooseProps = {
      visible: true,
      onOk: ::this.handleChooseImg,
      onCancel: ::this.cancelChooseImg,
      canSelectCount: isImgElm ? 1 : 10, // 替换img模式
      width: 864
    };
    this.imgModal = SelectImgModal.show(chooseProps);
  }

  handleChooseImg(checkedImgs) {
    if (this.imgModal) {
      this.imgModal.destroy();
    }
    this.editor.focus();
    const one = checkedImgs[0];
    if (one) {
      const editor = this.editor;
      const dom = editor.dom;
      let imgElm = editor.selection.getNode();
      const isImgElm = imgElm.nodeName === 'IMG';
      let data = null;
      /* eslint-disable no-shadow*/
      const waitLoad = (imgElm) => {
        const selectImage = () => {
          imgElm.onload = imgElm.onerror = null;
          editor.nodeChanged();
        }

        imgElm.onload = () => {
          selectImage();
        };

        imgElm.onerror = selectImage;
      }
      /* eslint-enable no-shadow */

      editor.undoManager.transact(() => {
        if (!one.path) {
          if (imgElm) {
            dom.remove(imgElm);
            editor.nodeChanged();
          }

          return;
        }

        data = {
          id: '__mcenew',
          src: `api/contentImgs/getFile?file=${one.path}`,
          alt: one.file_origin_name
        }
        if (!isImgElm) {
          checkedImgs.forEach((img, index) => {
            data = {
              src: `api/contentImgs/getFile?file=${img.path}`,
              alt: img.file_origin_name
            };
            if (index === checkedImgs.length - 1) {
              data.id = '__mcenew';
            }
            editor.selection.setContent(`<p>${dom.createHTML('img', data)}</p>`);
          })
          imgElm = dom.get('__mcenew');
          dom.setAttrib(imgElm, 'id', null);
        } else {
          dom.setAttribs(imgElm, data);
        }

        waitLoad(imgElm);
      });
    }
  }

  cancelChooseImg() {
    if (this.imgModal) {
      this.imgModal.destroy();
    }
    this.editor.focus();
  }

  render() {
    const config = Object.assign({}, {
      language: 'zh_CN',
      setup: ::this.setupEditor,
      // min_height: document.body.clientHeight - 450,
      chooseImgFn: ::this.openChooseImg
    }, EditorConfig)
    return (
      <TinyMCE
        content={this.props.value}
        config={config}
        onChange={::this.handleEditorChange}
        onBlur={::this.handleEditorBlur}
      />
    );
  }
}

RichEditor.propTypes = {
  value: PropTypes.string
}

export default RichEditor;
