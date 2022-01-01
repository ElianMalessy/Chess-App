import { Form, Card, Button } from 'react-bootstrap';
import classes from './Modal.module.css';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop.jsx';
import ModalContainer from './ModalContainer';
import { useRef, useState, useEffect } from 'react';
import ProfilePic from './ProfilePic/ProfilePic.jsx';
import dataURLtoFile from '../convertToFile';

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
  const [tempProfilePic, setTempProfilePic] = useState(profilePic);
  useEffect(
    () => {
      if (tempProfilePic !== profilePic) setTempProfilePic(profilePic);
    },
    // eslint-disable-next-line
    [profilePic]
  );

  const [possibleSwitch, setPossibleSwitch] = useState(true);

  function submitUrl(e) {
    console.log(e.target.value);

    setPossibleSwitch(true);
    setTempProfilePic(e.target.value);
  }

  function newProfilePicFile(e) {
    var files = e.target.files[0]; // FileList object
    if (files === undefined) return;
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(file) {
      return function(e) {
        setPossibleSwitch(true);
        setTempProfilePic(e.target.result);
      };
    })(files);

    // Read in the image file as a data URL.
    reader.readAsDataURL(files);
  }
  async function createFile(url) {
    console.log(url);
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: 'image/jpeg'
    };
    let f = new File([data], 'test.jpg', metadata);
    changeProfilePic(f);
    // ... do something with the file or return it
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
              <Card.Body className='d-flex h-100' style={{ flexDirection: 'column', position: 'relative' }}>
                <ProfilePic
                  tempProfilePic={tempProfilePic}
                  setTempProfilePic={setTempProfilePic}
                  possible={possibleSwitch}
                  setPossible={setPossibleSwitch}
                >
                  <Card.Text className='d-flex align-items-center justify-content-center'>
                    <ModalButton
                      onClick={() => {
                        setProfilePic(tempProfilePic);

                        try {
                          const file = dataURLtoFile(tempProfilePic, 'user.jpg');
                          changeProfilePic(file);
                        } catch (error) {
                          createFile(tempProfilePic);
                        }
                      }}
                      label='Save'
                      btnClass='modal-button2'
                    />
                  </Card.Text>
                </ProfilePic>

                <Card.Title className={`text-center mb-4 ${classes.cardTitle}`}>Change Profile Picture</Card.Title>
                <Form style={{ marginLeft: '14.5rem' }}>
                  <Form.Group id='image'>
                    <Form.Label>Image url:</Form.Label>
                    <Form.Control
                      type='url'
                      placeholder='e.g, https://images.chesscomfiles.com/uploads/picture.png'
                      onChange={submitUrl}
                    />
                  </Form.Group>

                  <Form.Group className='d-flex' style={{ flexDirection: 'column' }}>
                    <Form.Label>File:</Form.Label>
                    <input
                      accept='image/*'
                      type='file'
                      id='select-image'
                      onChange={newProfilePicFile}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor='select-image' style={{ width: '10.3rem' }}>
                      <Button
                        onClick={() => fileInputRef.current.click()}
                        className={classes['modal-button3']}
                        style={{ marginTop: '-1rem', fontSize: '0.8rem', fontWeight: '800' }}
                      >
                        Upload Image
                      </Button>
                    </label>
                  </Form.Group>
                </Form>

                <Card.Text
                  className='d-flex justify-content-center w-100'
                  style={{ position: 'absolute', bottom: '0.8rem' }}
                >
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
