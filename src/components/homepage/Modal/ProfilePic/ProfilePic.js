import ReactAvatarEditor from 'react-avatar-editor';

export default function ProfilePic({ tempProfilePic, setTempProfilePic, children }) {
  const handleScale = (e) => {
    const scale = parseFloat(e.target.value);
    setTempProfilePic({ ...tempProfilePic, scale: scale });
  };

  const handlePositionChange = (position) => {
    setTempProfilePic({ ...tempProfilePic, position: position });
  };

  return (
    <div style={{ position: 'absolute' }}>
      <ReactAvatarEditor
        scale={parseFloat(tempProfilePic.scale)}
        width={tempProfilePic.width}
        height={tempProfilePic.height}
        position={tempProfilePic.position}
        onPositionChange={handlePositionChange}
        borderRadius={tempProfilePic.width / 2}
        image={tempProfilePic.image}
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
          style={{ width: tempProfilePic.width, marginLeft: '0.15rem', marginTop: '0.2rem' }}
        />
      </div>
      {children}
    </div>
  );
}
