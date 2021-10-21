import React from 'react';
import ReactAvatarEditor from 'react-avatar-editor';

export default class ProfilePic extends React.Component {
  state = {
    image: this.props.src,
    allowZoomOut: false,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 0,
    preview: null,
    width: 200,
    height: 200
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

  render() {
    return (
      <div style={{ position: 'absolute' }}>
        <div>
          <ReactAvatarEditor
            scale={parseFloat(this.state.scale)}
            width={this.state.width}
            height={this.state.height}
            position={this.state.position}
            onPositionChange={this.handlePositionChange}
            rotate={parseFloat(this.state.rotate)}
            borderRadius={this.state.width / (100 / this.state.borderRadius)}
            image={this.state.image}
          />
        </div>
        <br />
        New File:
        <input name='newImage' type='file' onChange={this.handleNewImage} />
        <br />
        Zoom:
        <input
          name='scale'
          type='range'
          onChange={this.handleScale}
          min={this.state.allowZoomOut ? '0.1' : '1'}
          max='2'
          step='0.01'
          defaultValue='1'
        />
      </div>
    );
  }
}
