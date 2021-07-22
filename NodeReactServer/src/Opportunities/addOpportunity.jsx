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
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';

import resetStates from '../Utilities/resetStates';
import {GetMenusItems} from '../Utilities/getTitles';
import GetMessages   from '../Utilities/getMessages';
import ConfirmInsertDialog from '../Utilities/confirmInsertDialog';
import AlertDialog from '../Utilities/alertDialog';

export default function AddOpportunity(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const MItems    = GetMenusItems();
    // const Titles    = GetTitles();

    const [isLoading, setLoading]           = useState(true);
    const [open, setOpen]                   = useState(false);
    const [alertOpen, setAlertOpen]         = useState(false);
//    const [alertMessage, setAlertMessage]   = useState('');
    const [modified, setModified]           = useState(false);
    const [postData, setPostData]           = useState();
    const [customers, setCustomers]         = useState();
    const [selCustomer, setSelCustomer]     = useState('');
    const [fcustomers, setFCustomers]       = useState();
    const [selFCustomer, setSelFCustomer]   = useState('');
    const [allContacts, setAllContacts]     = useState([]);
    const [contacts, setContacts]           = useState([]);
    const [selContact, setSelContact]       = useState('');
    const [techBD, setTechBD]               = useState(false);
    const [winprobs, setWinprobs]           = useState([]);
    const [selWinprob, setSelWinprob]       = useState();
    const [bus, setBUs]                     = useState([]);
    const [selBU, setSelBU]                 = useState('');
    const [closeDate, setCloseDate]         = useState();
    const [accounts, setAccounts]           = useState([]);
    const [selAccount, setSelAccount]       = useState('');
    const [pms, setPMs]                     = useState([]);
    const [selPM, setSelPM]                 = useState('');
    const [description, setDescription]     = useState('');

    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    function handleChangeCustomer(event)  { 
        setSelCustomer(event.target.value);
        let tcontacts=[];
        allContacts.forEach((e)=>{if(e.ID === event.target.value) tcontacts.push(e);})
        setContacts(tcontacts);
    }
    function handleChangeFCustomer(event)   { setSelFCustomer(event.target.value); }
    function handleChangeContact(event)     { setSelContact(event.target.value); }
    function handleChangeWinProb(event)     { setSelWinprob(event.target.value); }
    function cancel()                       { resetStates(props.fstate,'Opportunities');}
    function handleTechBD(event)            { setTechBD(event.target.checked); };
    function handleChangeBU(event)          { setSelBU(event.target.value); };
    function handleChangeCloseDate(date)    { setCloseDate(date); };
    function handleChangeSaleAccount(event) { setSelAccount(event.target.value); };
    function handleChangePM(event)          { setSelPM(event.target.value); };
    function handleChangeDescription(event) { setDescription(event.target.value); };
// console.log(Messages);

    useEffect(() => {
        axios.post('http://localhost:3001/getCustomers','',{ headers: { 'jwt': props.user[1] }})
        .then(res => {
            setCustomers(res.data.data);
            setFCustomers(res.data.data);

            axios.post('http://localhost:3001/getContactsNames','',{ headers: { 'jwt': props.user[1] }})
                .then(resco => {
                    setAllContacts(resco.data);

                    axios.post('http://localhost:3001/getTable','table=WINPROBABILITIES',{ headers: { 'jwt': props.user[1] }})
                        .then(resw => {
                            let twp=resw.data.data.sort((a, b) => (a.DISPLAYORDER > b.DISPLAYORDER) ? 1 : -1)
                            setWinprobs(twp);
                            setSelWinprob(twp[0].ID);

                            axios.post('http://localhost:3001/getTable','table=BUSINESSUNITS',{ headers: { 'jwt': props.user[1] }})
                                .then(resbu => {
                                    let tbus=resbu.data.data.sort((a, b) => (a.DISPLAYORDER > b.DISPLAYORDER) ? 1 : -1)
                                    setBUs(tbus);

                                    axios.post('http://localhost:3001/getAccountsPMs','',{ headers: { 'jwt': props.user[1] }})
                                    .then(resap => {
                                        setAccounts(resap.data.account);
                                        setPMs(resap.data.pm);
                                        setLoading(false);
                                    })
                                })
                        })
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
    } else 
    
    return (
        <div>
        <Card >
            <CardContent className='ocontainer'>
                <Typography color="secondary" gutterBottom>
                    {MItems.newOpportunity}
                </Typography>
                <br></br>
                <form onSubmit={insertRecord}>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.name}</mat-label>
                                    <input id='NAME' name='NAME' className='oname' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.customer}</mat-label>
                                    <Select value={selCustomer} onChange={handleChangeCustomer} name='CUSTOMERID' className='oselOptCust'>
                                        {customers.map((e)=>{ return(<option value={e.id} key={e.id} >{e.NAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div className='ospacer2'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.finalCustomer}</mat-label>
                                    <Select value={selFCustomer} onChange={handleChangeFCustomer} name='FINALCUSTOMERID' className='oselOptFCust'>
                                        {fcustomers.map((e)=>{ return(<option value={e.id} key={e.id} >{e.NAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.contact}</mat-label>
                                    <Select value={selContact} onChange={handleChangeContact} name='CONTACTID' className='oselOptCont'>
                                        {contacts.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                        </Grid>


                        <Grid item xs={4}>
                            <div className='ospacer1'></div>
                            <div className='ocdate'>
                                <mat-form-field appearance="fill" modal-md >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils} >
                                        <KeyboardDatePicker disableToolbar variant="inline" format={MItems.dateFormat} margin="normal"
                                            id='CLOSEDATE' name='CLOSEDATE' value={closeDate} onChange={handleChangeCloseDate} 
                                            label={MItems.cdate}
                                        />
                                    </MuiPickersUtilsProvider>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.assignedto}</mat-label>
                                    <Select value={selAccount} onChange={handleChangeSaleAccount} name='ASSIGNEDTOID' className='oselAssTo' >
                                        {accounts.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME} {e.SURNAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.pm}</mat-label>
                                    <Select value={selPM} onChange={handleChangePM} name='PMID' className='oselPM' >
                                        {pms.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME} {e.SURNAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                        </Grid>

                        <Grid item xs={4}>
                            <div className='ospacer3'></div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.winpro}</mat-label>
                                    <Select value={selWinprob} onChange={handleChangeWinProb} name='WINPROBABILITYID' className='oselOptWin'>
                                        {winprobs.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.CODE}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div className='ospacer2'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.bu}</mat-label>
                                    <Select value={selBU} onChange={handleChangeBU} name='BUSINESSUNITID' className='oselOptBU'>
                                        {bus.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.BUSINESSUNIT}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.tecbd}</mat-label>
                                    <Checkbox checked={techBD}
                                        onChange={handleTechBD}
                                        inputProps={{ 'aria-label': 'Tech. support' }}
                                    />
                                </mat-form-field>
                            </div>
                        </Grid>
                        
                        <Grid item xs={12} >
                            <div >
                                <br></br><br></br>
                                <mat-form-field appearance="fill" modal-md >
                                    <TextField
                                        id='DESCRIPTION'
                                        name='DESCRIPTION'
                                        label={MItems.description}
                                        multiline
                                        rows={5}
                                        variant="outlined"
                                        className='ofullwidth'
                                        value={description}
                                        onChange={handleChangeDescription}
                                    />
                                </mat-form-field>
                            </div>
                        </Grid>

                        <Grid item xs={4} >
                            <div className='oamount'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.amount}</mat-label>
                                    <input id='AMOUNT' name='AMOUNT' className='otamount' ></input>
                                </mat-form-field>
                            </div>
                        </Grid>
                        <Grid item xs={8} >
                            <div className='oamount'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.fcst1}</mat-label>
                                    <input id='FCST1Y' name='FCST1Y' className='ofcst1' ></input>
                                </mat-form-field>
                            </div>
                            <div className='odivfcst'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.fcst2}</mat-label>
                                    <input id='FCST2Y' name='FCST2Y' className='ofcst2' ></input>
                                </mat-form-field>
                            </div>
                            <div className='odivfcst'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.fcst3}</mat-label>
                                    <input id='FCST3Y' name='FCST3Y' className='ofcst3' ></input>
                                </mat-form-field>
                            </div>
                        </Grid>

                        <Grid item xs={6}>
                            <div className='cosubmit'>
                            <br></br>
                                <Button variant="contained" color="secondary" type='submit' >
                                    <p>{MItems.save}</p>
                                    <SendIcon />
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className='cocancel'>
                            <br></br>
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
            target='http://localhost:3001/insertOpportunity'
            back='Opportunities'
        />

        <AlertDialog open={alertOpen} fclose={setAlertOpen}
            message={Messages.obligatoryFields}
            message2={Messages.opportunityMF}
        />
        </div>
    );

    function insertRecord(event){
        event.preventDefault();

        var postData='CREATEDBY='+props.user[0].ID;
        var mod = false;
        let inputs = event.target.getElementsByTagName('input');

        if (description.length > 0) {
            postData= postData+'&DESCRIPTION='+description;
            setModified(true);
            mod=true;
        }
        let iFields={};
        for(var i=0; i<inputs.length; i++) {
            var input=inputs[i];
            if (input.name === 'CLOSEDATE' && input.value.length > 0){
                let year=MItems.dateFormat.indexOf('yyyy');
                let month=MItems.dateFormat.indexOf('MM');
                let day=MItems.dateFormat.indexOf('dd');
                let newformat=input.value.substring(year,(year+4))+'/'+input.value.substring(month,(month+2))+'/'+input.value.substring(day,(day+2));
//                console.log(newformat);
                input.value = newformat;
            }

            if (input.value.length > 0) {
            postData = postData+'&'+input.name+'='+input.value;
            iFields[input.name]=input.value;
            setModified(true);
            mod=true;
            }
        }
        // Validate fields
        if (iFields.NAME === undefined || iFields.NAME.length < 1) { setAlertOpen(true); return; }
        if (iFields.CUSTOMERID === undefined) { setAlertOpen(true); return; }
        //---

        setPostData(postData);
        if (mod) setOpen(true);
    }

}