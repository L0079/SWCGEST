import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';

import {GetMenusItems} from '../Utilities/getTitles';
import resetStates from '../Utilities/resetStates';
import GetMessages from '../Utilities/getMessages';

export default function AddContactDialog(props) {
  const axios    = require('axios');
  const Messages = GetMessages();
  const setOpen  = props.fopen;
  var   fstate   = props.fstate;
  const MItems   = GetMenusItems();
  // const Titles = GetTitles();
  let premises   = props.premises;

  const [selPremise, setSelPremise]   = useState('');

  const useStyles = makeStyles(theme => ({
    dialogPaper: { maxWidth : '800px' },
  }));
  const classes = useStyles();

  function cancel(){ resetStates(props.fstate,props.previous);}
  function handleChangePremise(event) { setSelPremise(event.target.value); }

  function handleClose() {
    setOpen(false);
    resetStates(fstate,props.back);
  };
  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }

  return (
      <Dialog
        classes={{ paper : classes.dialogPaper}}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle  id="alert-dialog-title">{Messages.addContact}</DialogTitle>
        <DialogContent>
          <form onSubmit={insertRecord}>
                    <Typography color="secondary" gutterBottom>
                        {MItems.newContact}
                    </Typography>
                    <br></br>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.name}</mat-label>
                                    <input id='NAME' name='NAME' className='coname' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.surname}</mat-label>
                                    <input id='SURNAME' name='SURNAME' className='cosurname' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.role}</mat-label>
                                    <input id='ROLE' name='ROLE' className='corole' ></input>
                                </mat-form-field>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.telephone}</mat-label>
                                    <input id='TELEPHONE' name='TELEPHONE' className='cotelephone' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.mobile}</mat-label>
                                    <input id='MOBILE' name='MOBILE' className='comobile' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label className='cselLabel'>{MItems.premise}</mat-label>
                                <Select value={selPremise} onChange={handleChangePremise} name='PREMISEID' className='cselOptPrem'>
                                    {premises.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.PREMISE}</option>); })}
                                </Select>
                            </mat-form-field>
                            </div>
                        </Grid>
                    </Grid>
                    <br></br>
                    <div className='cosubmit'>
                        <Button variant="contained" color="secondary" type='submit' >
                            <p>{MItems.save}</p>
                            <SendIcon />
                        </Button>
                    </div>
                    <div className='cocancel'>
                        <Button variant="contained" color="secondary" onClick={cancel} >
                            <p>{MItems.cancel}</p>
                            <CancelIcon />
                        </Button>
                    </div>
                    <br></br>
                </form>
        </DialogContent>
      </Dialog>
  );


  function insertRecord(event){
    event.preventDefault();
    var postData='table=CONTACTS&CREATEDBY='+props.user[0].ID+'&CUSTOMERID='+props.customerData.ID;
    var mod = false;
    let inputs = event.target.getElementsByTagName('input');
    let iFields={};
    for(var i=0; i<inputs.length; i++) {
      var input=inputs[i];
      if (input.value.length > 0) {
        postData = postData+'&'+input.name+'='+input.value;
        iFields[input.name]=input.value;
        mod = true;
      }
    }
    // Validate fields
    if ((iFields.NAME === undefined || iFields.NAME.length < 1) && (iFields.SURNAME === undefined || iFields.SURNAME.length < 1)) { setOpen(false); return; }
  //  if (iFields.CUSTOMERID === undefined) { setAlertOpen(true); return; }
    //---
    if (mod) {
      axios.post('http://localhost:3001/insertRecord',postData,{ headers: { 'jwt': props.user[1] }})
        .then(res=>{
          if(res.data.affectedRows === undefined || res.data.affectedRows < 1) {
              errorHandling(Messages.noRecordDeleted);
          }
          setOpen(false);
        })
        .catch(err=>{
          //if response.data is undefined a major error occurred
          if (err.response === undefined || err.response.data === null) { 
              if(err.message === undefined || err.message === null) { errorHandling(err);}
              else { errorHandling(err.message)}; }
          else { errorHandling((err.response.data.length > 0)?err.response.statusText+' - '+err.response.data : err.response.statusText); }
        }
      );
    } else { setOpen(false); return; }
  }
}