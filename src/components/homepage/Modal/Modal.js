import { Form, Card, Button } from 'react-bootstrap';
import classes from './Modal.module.css';
import { motion } from 'framer-motion';
import Backdrop from './Backdrop';
import ModalContainer from './ModalContainer';
import { useRef, useState } from 'react';
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
  function newProfilePicFile(e) {
    var files = e.target.files; // FileList object

    // use the 1st file from the list
    var f = files[0];
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        console.log(e.target.result);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
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
                <ProfilePic src={profilePic} />

                <Card.Title className={`text-center mb-4 ${classes.cardTitle}`}>Change Profile Picture</Card.Title>
                <Form onSubmit={changeProfilePic}>
                  <Form.Group id='image'>
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type='url' placeholder='e.g, https://images.chesscomfiles.com/uploads/picture.png' />
                  </Form.Group>

                  <Form.Group className='mt-2' style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.Label>File</Form.Label>
                    <input
                      accept='image/*'
                      type='file'
                      id='select-image'
                      onChange={newProfilePicFile}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor='select-image'>
                      <Button variant='dark' onClick={() => fileInputRef.current.click()}>
                        Upload Image
                      </Button>
                    </label>
                  </Form.Group>
                </Form>
                <Card.Text className='d-flex align-items-center justify-content-center text-align-center'>
                  <ModalButton onClick={() => setOpen(false)} label='Close' />
                </Card.Text>
              </Card.Body>
            </Card>
          </motion.div>
        </Backdrop>
      )}
    </ModalContainer>
  );
}

const ModalButton = ({ onClick, label }) => (
  <motion.button
    className={classes['modal-button']}
    type='button'
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {label}
  </motion.button>
);
