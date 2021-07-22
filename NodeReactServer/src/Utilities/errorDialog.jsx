import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import resetStates from './resetStates';

export default function ErrorDialog(props) {
  const handleClose = () => {
    if (props.message.type === 'ERROR') resetStates(props.fstate,'');
    else props.fopen(false);
  };

  return (
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>{props.message.alert}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.message.message}<br></br><br></br>{props.message.message2}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary" autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
  );
}