import React  from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import resetStates from '../Utilities/resetStates';

import GetMessages from '../Utilities/getMessages';

export default function ConfirmInsertDialog(props) {
  const axios    = require('axios');
  const Messages = GetMessages();
  const setOpen  = props.fopen;
  var   fstate   = props.fstate;

  function handleClose() {
    setOpen(false);
    resetStates(fstate,'GetTable');
  };
  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }
  function handleConfirm() {
    if (props.modified){
      axios.post('http://localhost:3001/insertRecord',props.postData,{ headers: { 'jwt': props.user[1] }})
        .then(res=>{
          if(res.data.affectedRows === undefined || res.data.affectedRows < 1) {
              errorHandling(Messages.noRecordDeleted);
          }
      })
      .catch(err=>{
          //if response.data is undefined a major error occurred
          if (err.response === undefined || err.response.data === null) { 
              if(err.message === undefined || err.message === null) { errorHandling(err);}
              else { errorHandling(err.message)}; }
          else { errorHandling((err.response.data.length > 0)?err.response.statusText+' - '+err.response.data : err.response.statusText); }
      });
      resetStates(fstate,'GetTable');
    }
    setOpen(false);
  };

  return (
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle  id="alert-dialog-title">{Messages.alert}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}<br></br><br></br>{props.message2}
          </DialogContentText>
       
          <div className='formButtons'>
            <Button onClick={handleClose} variant="contained" color="secondary" autoFocus>
              {Messages.cancel}
            </Button>
            <Button onClick={handleConfirm} variant="contained" color="secondary" autoFocus>
              {Messages.confirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}