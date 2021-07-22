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
import GetMessages from '../Utilities/getMessages';

export default function AddPremisetDialog(props) {
  const axios    = require('axios');
  const Messages = GetMessages();
  const setOpen  = props.fopen;
  const MItems   = GetMenusItems();
  // const Titles = GetTitles();
  const [selCountry, setSelCountry] = useState({'A2CODE': 'IT', 'NAME':'Italy'});
  const useStyles = makeStyles(theme => ({ dialogPaper: { maxWidth : '1100px' } }));
  const classes   = useStyles();

  function cancel() { setOpen(false); }
  function handleChangeC(event) { 
    var index = props.countriesCodes.map(function(e) { return e.NAME; }).indexOf(event.target.value);
    setSelCountry(props.countriesCodes[index]);
  }
  function handleChangeCC(event) { 
    var index = props.countriesCodes.map(function(e) { return e.A2CODE; }).indexOf(event.target.value);
    setSelCountry(props.countriesCodes[index]);
  }
  function errorHandling(e){ props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;}); }

//  console.log(props);
  return (
      <Dialog
        classes={{ paper : classes.dialogPaper}}
        open={props.open}

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
              <Grid item xs={12} sm={4}>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.name}</mat-label>
                        <input id='PREMISE' name='PREMISE' className='cpremise' ></input>
                    </mat-form-field>
                </div>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.street}</mat-label>
                        <input id='STREET' name='STREET' className='cstreet' ></input>
                    </mat-form-field>
                </div>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.city}</mat-label>
                        <input id='CITY' name='CITY' className='ccity' ></input>
                    </mat-form-field>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.zip}</mat-label>
                        <input id='ZIP' name='ZIP' className='czip' ></input>
                    </mat-form-field>
                </div>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.telephone}</mat-label>
                        <input id='TELEPHONE' name='TELEPHONE' className='ctelephone' ></input>
                    </mat-form-field>
                </div>
              </Grid>
              <Grid item xs={12} sm={4}>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.country}</mat-label>
                            <Select value={selCountry.NAME} onChange={handleChangeC} name='COUNTRY' className='pdselC'>
                                {props.countriesCodes.map((e)=>{ return(<option value={e.NAME} key={e.A2CODE} >{e.NAME}</option>); })}
                            </Select>
                    </mat-form-field>
                </div>
                <div>
                    <mat-form-field appearance="fill" modal-md>
                        <mat-label>{MItems.countryCode}</mat-label>
                            <Select value={selCountry.A2CODE} onChange={handleChangeCC} name='COUNTRYCODE' className='cselCC'>
                                {props.countriesCodes.map((e)=>{ return(<option value={e.A2CODE} key={e.A2CODE} >{e.A2CODE}</option>); })}
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
    var postData='table=PREMISES&CREATEDBY='+props.user[0].ID+'&CUSTOMERID='+props.customerData.ID;
    var mod = false;
    let inputs = event.target.getElementsByTagName('input');
    let iFields  = {};
    let premises = [];
    props.premises.forEach((e)=>{ premises.push(e); });
    for(var i=0; i<inputs.length; i++) {
      var input=inputs[i];
      if (input.value.length > 0) {
        postData = postData+'&'+input.name+'='+input.value;
        iFields[input.name]=input.value;
        mod = true;
      }
    }
    // Validate fields
    if ((iFields.PREMISE === undefined || iFields.PREMISE.length < 1) && (iFields.CITY === undefined || iFields.CITY.length < 1)) { setOpen(false); return; }
  //  if (iFields.CUSTOMERID === undefined) { setAlertOpen(true); return; }
    //---
    if (mod) {
      axios.post('http://localhost:3001/insertRecord',postData,{ headers: { 'jwt': props.user[1] }})
        .then(res=>{
          if(res.data.affectedRows === undefined || res.data.affectedRows < 1) {
              errorHandling(Messages.noRecordDeleted);
          }
          iFields.id = res.data.insertId;
          premises.push(iFields);
          props.setPremises(premises);
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
    } else { setOpen(false); }
  }
}