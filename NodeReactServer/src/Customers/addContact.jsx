import React, { useState, useEffect } from 'react';
import Button   from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import resetStates from '../Utilities/resetStates';
import {GetMenusItems} from '../Utilities/getTitles';
import GetMessages   from '../Utilities/getMessages';
import ConfirmInsertDialog  from '../Utilities/confirmInsertDialog';
import AlertDialog from '../Utilities/alertDialog';

export default function AddContact(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const MItems    = GetMenusItems();
    // const Titles    = GetTitles();
    const [isLoading, setLoading]       = useState(true);
    const [open, setOpen]               = useState(false);
    const [alertOpen, setAlertOpen]     = useState(false);
    const [modified, setModified]       = useState(false);
    const [postData, setPostData]       = useState();
    const [customers, setCustomers]     = useState();
    const [selCustomer, setSelCustomer] = useState('');
    const [allPremises, setAllPremises] = useState([]);
    const [premises, setPremises]       = useState([]);
    const [selPremise, setSelPremise]   = useState('');
    var tpremises = [];

    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    function handleChangeCustomer(event) { 
        setSelCustomer(event.target.value);
        tpremises = [];
        allPremises.forEach((e)=>{ if(e.CUSTOMERID === event.target.value) tpremises.push(e); });
        setPremises(tpremises);
        setSelPremise(tpremises[0].ID);
    }
    function handleChangePremise(event) { setSelPremise(event.target.value); }
    function cancel(){ resetStates(props.fstate,props.previous);}

//console.log(props);
    useEffect(() => {
        axios.post('http://localhost:3001/getCustomers','',{ headers: { 'jwt': props.user[1] }})
        .then(res=>{
            setCustomers(res.data.data);

            axios.post('http://localhost:3001/getTable','table=PREMISES',{ headers: { 'jwt': props.user[1] }})
                .then(function (response) {
                    setAllPremises(response.data.data);
                    setLoading(false);
            })
        })
        .catch(err=>{
            //if response.data is undefined a major error occurred
            if (err.response === undefined || err.response.data === null) { 
                if(err.message === undefined || err.message === null) { errorHandling(err);}
                else { errorHandling(err.message)}; }
            else { errorHandling((err.response.data.length > 0)?err.response.statusText+' - '+err.response.data : err.response.statusText); }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[axios, props.user]);


    if (isLoading) {
        return <div > Loading... </div>;
    } else return (
        <div>
        <Card >
            <CardContent>
                <form onSubmit={insertRecord}>
                    <Typography color="secondary" gutterBottom>
                        {MItems.newContact}
                    </Typography>
                    <br></br>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <div>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label className='cselLabel'>{MItems.customer}</mat-label>
                                <Select value={selCustomer} onChange={handleChangeCustomer} name='CUSTOMERID' className='cselOptCust'>
                                    {customers.map((e)=>{ return(<option value={e.id} key={e.id} >{e.NAME}</option>); })}
                                </Select>
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
                        <Grid item xs={12} sm={4}>
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
                        <Grid item xs={12} sm={4}>
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
                        </Grid>
                    </Grid>
                    <br></br>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <div className='cosubmit'>
                                <Button variant="contained" color="secondary" type='submit' >
                                    <p>{MItems.save}</p>
                                    <SendIcon />
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4}></Grid>
                        <Grid item xs={12} sm={4}>
                            <div className='cocancel'>
                                <Button variant="contained" color="secondary" onClick={cancel} >
                                    <p>{MItems.cancel}</p>
                                    <CancelIcon />
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>

        <ConfirmInsertDialog open={open} fopen={setOpen}
            message={Messages.insertRecord}
            modified={modified}
            postData={postData}
            fstate={props.fstate}
            ferror={props.ferror}
            user={props.user}
            target='http://localhost:3001/insertRecord'
            back='Contacts'
        />
        <AlertDialog open={alertOpen} fclose={setAlertOpen}
            message={Messages.obligatoryFields}
            message2={Messages.contactMF}
        />
    </div>
    );

    function insertRecord(event){
        event.preventDefault();
        var postData='table=CONTACTS&CREATEDBY='+props.user[0].ID;
        var mod = false;
        let inputs = event.target.getElementsByTagName('input');
        let iFields={};
        for(var i=0; i<inputs.length; i++) {
            var input=inputs[i];
            if (input.value.length > 0) {
            postData = postData+'&'+input.name+'='+input.value;
            iFields[input.name]=input.value;
            setModified(true);
            mod=true;
            }
        }
        // Validate fields
        if ((iFields.NAME === undefined || iFields.NAME.length < 1) && (iFields.SURNAME === undefined || iFields.SURNAME.length < 1)) { setAlertOpen(true); return; }
        if (iFields.CUSTOMERID === undefined) { setAlertOpen(true); return; }
        //---
        setPostData(postData);
        if (mod) setOpen(true);
    }

}