import { useRef, useState, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
export default function ProfilePic({ tempProfilePic, children, setTempProfilePic, possible }) {
  const scaledImg = useRef(tempProfilePic);
  const [state, setState] = useState({
    image: tempProfilePic,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    height: 165,
    width: 165
  });
  useEffect(
    () => {
      // file upload as new profile pic preview
      if (state.image !== tempProfilePic && possible.current === true) setState({ ...state, image: tempProfilePic });
    },
    // eslint-disable-next-line
    [tempProfilePic]
  );
  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    possible.current = false;
    setState({ ...state, scale: scale });
    setTempProfilePic(scaledImg.current);
  };

  const handlePositionChange = (position) => {
    possible.current = false;
    setState({ ...state, position: position });
    setTempProfilePic(scaledImg.current);
  };

  const setEditorRef = (editor) => {
    if (editor) {
      scaledImg.current = editor.getImageScaledToCanvas().toDataURL();
    }
  };
  return (
    <div style={{ position: 'absolute' }}>
      <AvatarEditor
        crossOrigin='anonymous'
        scale={parseFloat(state.scale)}
        image={state.image}
        width={state.width}
        height={state.height}
        position={state.position}
        borderRadius={state.width / 2}
        onPositionChange={handlePositionChange}
        ref={(ref) => setEditorRef(ref)}
      />
      <br />
      <div className='d-flex align-items-center justify-content-center'>
        Zoom:
        <input
          name='scale'
          type='range'
          onChange={handleScale}
          min={'1'}
          max='2'
          step='0.01'
          defaultValue='1'
          style={{ width: state.width, marginLeft: '0.15rem', marginTop: '0.2rem' }}
        />
      </div>

      {children}
    </div>
  );
}
