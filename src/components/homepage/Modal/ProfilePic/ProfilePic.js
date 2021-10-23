import React from 'react';
import AvatarEditor from 'react-avatar-editor';
export default class ProfilePic extends React.Component {
  state = {
    image: this.props.tempProfilePic.image,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    borderRadius: 0,
    preview: null,
    width: this.props.tempProfilePic.width,
    height: this.props.tempProfilePic.height
  };

  handleNewImage = (e) => {
    this.setState({ image: e.target.files[0] });
  };

  handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  };

  handlePositionChange = (position) => {
    this.setState({ position });
  };

  setEditorRef = (editor) => {
    if (editor) {
      this.editor = editor;
      const img = this.editor.getImageScaledToCanvas().toDataURL();
      console.log(img);
    }
  };
  render() {
    return (
      <div style={{ position: 'absolute' }}>
        <div>
          <AvatarEditor
            crossOrigin='anonymous'
            scale={parseFloat(this.state.scale)}
            image={this.state.image}
            width={this.state.width}
            height={this.state.height}
            position={this.state.position}
            borderRadius={this.state.width / 50}
            onPositionChange={this.handlePositionChange}
            ref={(ref) => this.setEditorRef(ref)}
            onLoadSuccess={this.loadSuccess}
          />
        </div>
        <br />
        New File:
        <input name='newImage' type='file' onChange={this.handleNewImage} />
        <br />
        Zoom:
        <input name='scale' type='range' onChange={this.handleScale} min='1' max='2' step='0.01' defaultValue='1' />
      </div>
    );
  }
}
