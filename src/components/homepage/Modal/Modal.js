import { Form, Card } from 'react-bootstrap';
import classes from './Modal.module.css';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import ModalContainer from './ModalContainer';
import { useRef, useState, useEffect } from 'react';
import ProfilePic from './ProfilePic/ProfilePic';

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500
    }
  },
  exit: {
    y: '100vh',
    opacity: 0
  }
};
export default function Modal({ setOpen, changeProfilePic, isOpen, profilePic, setProfilePic }) {
  const fileInputRef = useRef();
  const [tempProfilePic, setTempProfilePic] = useState({
    image: profilePic.image,
    position: { x: 0.5, y: 0.5 },
    scale: profilePic.scale,
    height: 165,
    width: 165
  });
  useEffect(
    () => {
      if (tempProfilePic.image !== profilePic.image && tempProfilePic.scale !== profilePic.scale)
        setTempProfilePic({ ...tempProfilePic, image: profilePic.image, scale: profilePic.scale });
      else if (tempProfilePic.image !== profilePic.image)
        setTempProfilePic({ ...tempProfilePic, image: profilePic.image });
      else if (tempProfilePic.scale !== profilePic.scale)
        setTempProfilePic({ ...tempProfilePic, scale: profilePic.scale });
    },
    // eslint-disable-next-line
    [profilePic, tempProfilePic]
  );
  function newProfilePicFile(e) {
    var files = e.target.files[0]; // FileList object
    if (files === undefined) return;
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(file) {
      return function(e) {
        setTempProfilePic({ ...tempProfilePic, image: e.target.result });
        console.log(tempProfilePic.scale);
        changeProfilePic(file);
      };
    })(files);

    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
  }
  return (
    <ModalContainer>
      {isOpen && (
        <Backdrop onClick={() => setOpen(false)}>
          <motion.div
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
            className={classes.modal}
            variants={dropIn}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <Card className={classes['orange-gradient'] + ' ' + classes['imageCard']}>
              <Card.Body>
                <ProfilePic tempProfilePic={tempProfilePic}>
                  <Card.Text className='d-flex align-items-center justify-content-center'>
                    <ModalButton
                      onClick={() => {
                        setProfilePic({
                          image: tempProfilePic.image,
                          scale: tempProfilePic.scale
                        });
                      }}
                      label='Submit'
                      btnClass='modal-button2'
                    />
                  </Card.Text>
                </ProfilePic>

                <Card.Title className={`text-center mb-4 ${classes.cardTitle}`}>Change Profile Picture</Card.Title>
                <Form style={{ marginLeft: '14.5rem' }}>
                  <Form.Group id='image'>
                    <Form.Label>Image url:</Form.Label>
                    <Form.Control type='url' placeholder='e.g, https://images.chesscomfiles.com/uploads/picture.png' />
                  </Form.Group>

                  <Form.Group className='mt-2' style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label>File:</Form.Label>
                    <input
                      accept='image/*'
                      type='file'
                      id='select-image'
                      onChange={newProfilePicFile}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor='select-image'>
                      <ModalButton
                        onClick={() => fileInputRef.current.click()}
                        label='Upload Image'
                        btnClass='modal-button3'
                      />
                    </label>
                  </Form.Group>
                </Form>

                <Card.Text className='d-flex align-items-center justify-content-center mt-5'>
                  <ModalButton onClick={() => setOpen(false)} label='Close' btnClass='modal-button' />
                </Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
        </Backdrop>
      )}
    </ModalContainer>
  );
}

const ModalButton = ({ onClick, label, btnClass }) => (
  <motion.button
    className={classes[btnClass]}
    type='button'
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {label}
  </motion.button>
);
