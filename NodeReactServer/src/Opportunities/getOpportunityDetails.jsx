import React, { useState, useEffect } from 'react';
import Button   from '@material-ui/core/Button';
import TransformIcon from '@material-ui/icons/Transform';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
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


export default function GetOpportunityDetails(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    // const Titles    = GetTitles();
    const MItems    = GetMenusItems();
    const [isLoading, setLoading]           = useState(true);
    const [open, setOpen]                   = useState(false);
    const [modified, setModified]           = useState(false);
    const [postData, setPostData]           = useState();

    const [customers, setCustomers]         = useState();
    const [selCustomer, setSelCustomer]     = useState();
    const [fcustomers, setFCustomers]       = useState();
    const [selFCustomer, setSelFCustomer]   = useState();
    const [allContacts, setAllContacts]     = useState([]);
    const [contacts, setContacts]           = useState([]);
    const [selContact, setSelContact]       = useState();
    const [techBD, setTechBD]               = useState(false);
    const [winprobs, setWinprobs]           = useState([]);
    const [selWinprob, setSelWinprob]       = useState();
    const [bus, setBUs]                     = useState([]);
    const [selBU, setSelBU]                 = useState();
    const [closeDate, setCloseDate]         = useState();
    const [accounts, setAccounts]           = useState([]);
    const [selAccount, setSelAccount]       = useState();
    const [pms, setPMs]                     = useState([]);
    const [selPM, setSelPM]                 = useState();
    const [description, setDescription]     = useState('');
    const [amount, setAmount]               = useState('');
    const [fcst1y, setFCST1Y]               = useState('');
    const [fcst2y, setFCST2Y]               = useState('');
    const [fcst3y, setFCST3Y]               = useState('');
    const [oppName, setOppName]             = useState('');

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
    function handleChangeOppName(event)     { setOppName(event.target.value); };
//console.log(props);

    useEffect(() => {
        let getOppId='oppId='+props.opportunityId;
        axios.post('http://localhost:3001/getOpportunityDetails',getOppId,{ headers: { 'jwt': props.user[1] }})
        .then(res=>{
            let opportunity=res.data;
            if (opportunity.DESCRIPTION != null) setDescription(opportunity.DESCRIPTION);
            if (opportunity.TECHSUPPORTREQUIRED != null) setTechBD(opportunity.TECHSUPPORTREQUIRED);
            setCloseDate(opportunity.CLOSEDATE);
            setAmount(opportunity.AMOUNT);
            setFCST1Y(opportunity.FCST1Y);
            setFCST2Y(opportunity.FCST2Y);
            setFCST3Y(opportunity.FCST3Y);
            setOppName(opportunity.NAME);

            axios.post('http://localhost:3001/getCustomers','',{ headers: { 'jwt': props.user[1] }})
            .then(res=>{
                setCustomers(res.data.data);
                setFCustomers(res.data.data);
                setSelCustomer(opportunity.CUSTOMERID);
                setSelFCustomer(opportunity.FINALCUSTOMERID);

                axios.post('http://localhost:3001/getContactsNames','',{ headers: { 'jwt': props.user[1] }})
                    .then(function (response) {
                        setAllContacts(response.data);
                        let tcts=[];
                        response.data.forEach((e)=>{if(e.CUSTOMERID === opportunity.CUSTOMERID) tcts.push(e);})
                        setContacts(tcts);

                        setSelContact(opportunity.CONTACTID);

                        axios.post('http://localhost:3001/getTable','table=WINPROBABILITIES',{ headers: { 'jwt': props.user[1] }})
                            .then(res=>{
                                let twp=res.data.data.sort((a, b) => (a.DISPLAYORDER > b.DISPLAYORDER) ? 1 : -1)
                                setWinprobs(twp);
                                setSelWinprob(opportunity.WINPROBABILITYID);

                                axios.post('http://localhost:3001/getTable','table=BUSINESSUNITS',{ headers: { 'jwt': props.user[1] }})
                                    .then(res=>{
                                        let tbus=res.data.data.sort((a, b) => (a.DISPLAYORDER > b.DISPLAYORDER) ? 1 : -1)
                                        setBUs(tbus);
                                        setSelBU(opportunity.BUSINESSUNITID);

                                        axios.post('http://localhost:3001/getAccountsPMs','',{ headers: { 'jwt': props.user[1] }})
                                        .then(res=>{
                                            setAccounts(res.data.account);
                                            setPMs(res.data.pm);
                                            setSelAccount(opportunity.ASSIGNEDTOID);
                                            setSelPM(opportunity.PMID);
                                            setLoading(false);
                                        })
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
                    {MItems.opportunity}
                </Typography>
                <form onSubmit={updateRecord}>
                    <br></br>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.name}</mat-label>
                                    <input id='NAME' name='NAME' className='oname' value={oppName} onChange={handleChangeOppName}></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.customer}</mat-label>
                                    <Select value={selCustomer} onChange={handleChangeCustomer} name='CUSTOMERID' className='oselOptCust' defaultValue={selCustomer} >
                                        {customers.map((e)=>{ return(<option value={e.id} key={e.id} >{e.NAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div className='ospacer2'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.finalCustomer}</mat-label>
                                    <Select value={selFCustomer} onChange={handleChangeFCustomer} name='FINALCUSTOMERID' className='oselOptFCust' defaultValue={selFCustomer}>
                                        {fcustomers.map((e)=>{ return(<option value={e.id} key={e.id} >{e.NAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.contact}</mat-label>
                                    <Select value={selContact} onChange={handleChangeContact} name='CONTACTID' className='oselOptCont' defaultValue={selContact}>
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
                                    <Select value={selAccount} onChange={handleChangeSaleAccount} name='ASSIGNEDTOID' className='oselAssTo' defaultValue={selAccount}>
                                        {accounts.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME} {e.SURNAME}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.pm}</mat-label>
                                    <Select value={selPM} onChange={handleChangePM} name='PMID' className='oselPM' defaultValue={selPM}>
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
                                    <Select value={selWinprob} onChange={handleChangeWinProb} name='WINPROBABILITYID' className='oselOptWin' defaultValue={selWinprob}>
                                        {winprobs.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.CODE}</option>); })}
                                    </Select>
                                </mat-form-field>
                            </div>
                            <div className='ospacer2'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.bu}</mat-label>
                                    <Select value={selBU} onChange={handleChangeBU} name='BUSINESSUNITID' className='oselOptBU' defaultValue={selBU}>
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
                                        defaultValue={techBD}
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
                                    <input id='AMOUNT' name='AMOUNT' className='otamount' defaultValue={amount}></input>
                                </mat-form-field>
                            </div>
                        </Grid>
                        <Grid item xs={8} >
                            <div className='oamount'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.fcst1}</mat-label>
                                    <input id='FCST1Y' name='FCST1Y' className='ofcst1' defaultValue={fcst1y}></input>
                                </mat-form-field>
                            </div>
                            <div className='odivfcst'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.fcst2}</mat-label>
                                    <input id='FCST2Y' name='FCST2Y' className='ofcst2' defaultValue={fcst2y}></input>
                                </mat-form-field>
                            </div>
                            <div className='odivfcst'>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.fcst3}</mat-label>
                                    <input id='FCST3Y' name='FCST3Y' className='ofcst3' defaultValue={fcst3y}></input>
                                </mat-form-field>
                            </div>
                        </Grid>

                        <Grid item xs={4}>
                            <div className='osubmit'>
                            <br></br>
                                <Button variant="contained" color="secondary" type='submit' >
                                    <p>{MItems.update}</p>
                                    <SystemUpdateAltIcon />
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='otoEstimate'>
                            <br></br>
                                <Button variant="contained" color="secondary" type='submit' onClick={createEstimate}>
                                    <p>{MItems.toEstimate}</p>
                                    <TransformIcon />
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className='ocancel'>
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
            message={Messages.updateRecord}
            modified={modified}
            postData={postData}
            fstate={props.fstate}
            ferror={props.ferror}
            user={props.user}
            target='http://localhost:3001/updateOpportunity'
            back='Opportunities'
        />
        </div>
    );

    function updateRecord(event){
        event.preventDefault();
        var postData='ID='+props.opportunityId+'&MODIFIEDBY='+props.user[0].ID;
        var mod = false;
        let inputs = event.target.getElementsByTagName('input');

        if (description.length > 0) {
            postData= postData+'&DESCRIPTION='+description;
            setModified(true);
            mod=true;
        }

        for(var i=0; i<inputs.length; i++) {
            var input=inputs[i];

            if (input.name === 'CLOSEDATE' && input.value.length > 0){
                let year=MItems.dateFormat.indexOf('yyyy');
                let month=MItems.dateFormat.indexOf('MM');
                let day=MItems.dateFormat.indexOf('dd');
                let newformat=input.value.substring(year,(year+4))+'/'+input.value.substring(month,(month+2))+'/'+input.value.substring(day,(day+2));
                input.value = newformat;
            }

            if (input.value.length > 0) {
            postData = postData+'&'+input.name+'='+input.value;
            setModified(true);
            mod=true;
            }
        }

        setPostData(postData);
        if (mod) setOpen(true);
    }

    function createEstimate(event){
        event.preventDefault();
        console.log('CREATE ESTIMATE - DESCRIPTION',description, description.length);
        var estFirstdatas={};
        estFirstdatas.OPPORTUNITYID=props.opportunityId;
        estFirstdatas.CREATEDBY=props.user[0].ID;
        estFirstdatas.CUSTOMERID=selCustomer;
        estFirstdatas.CUSTOMERNAME='';
        let fc = customers.find(e=> e.id === selCustomer);
        estFirstdatas.CUSTOMERNAME=fc.NAME;

        if (selFCustomer != null) {
            estFirstdatas.FINALCUSTOMERID=selFCustomer;
            let ffc = customers.find(e=> e.id === selFCustomer);
            estFirstdatas.FINALCUSTOMERNAME=ffc.NAME;
        } else estFirstdatas.FINALCUSTOMERNAME='';
        if (selContact != null) estFirstdatas.CONTACTID=selContact;
        if (selBU != null) estFirstdatas.BUSINESSUNITID=selBU;
        // if (closeDate != null) estFirstdatas.CLOSEDATE=closeDate;
        if (selAccount != null) estFirstdatas.ACCOUNTID=selAccount;
        if (selPM != null) estFirstdatas.PMID=selPM;

        estFirstdatas.AMOUNT=amount;
        estFirstdatas.FCST1Y=fcst1y;
        estFirstdatas.FCST2Y=fcst2y;
        estFirstdatas.FCST3Y=fcst3y;
        // const [oppName, setOppName] = useState('');

        props.setEstimateData(estFirstdatas);
        resetStates(props.fstate,'AddEstimate');
    }

}