import React, { useState, useEffect } from 'react';
import Button               from '@material-ui/core/Button';
import SendIcon             from '@material-ui/icons/Send';
import CancelIcon           from '@material-ui/icons/Cancel';
import Select               from '@material-ui/core/Select';
import Card                 from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import CardContent          from '@material-ui/core/CardContent';
import Divider              from '@material-ui/core/Divider';
import Grid                 from '@material-ui/core/Grid';
import Typography           from '@material-ui/core/Typography';

import resetStates          from '../Utilities/resetStates';
import {GetMenusItems}      from '../Utilities/getTitles';
import GetMessages          from '../Utilities/getMessages';
import ConfirmInsertDialog  from '../Utilities/confirmInsertDialog';
import AlertDialog          from '../Utilities/alertDialog';

export default function AddCustomer(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const [isLoading, setLoading]     = useState(true);
    const [open, setOpen]             = useState(false);
    const [alertOpen, setAlertOpen]   = useState(false);
    const [modified, setModified]     = useState(false);
    const [postData, setPostData]     = useState();
    // const Titles    = GetTitles();
    const MItems    = GetMenusItems();
    const [industry, setIndustry]         = useState();
    const [selIndustry, setSelIndustry]   = useState();
    const [market, setMarket]             = useState();
    const [selMarket, setSelMarket]       = useState();
    const [territory, setTerritory]       = useState();
    const [selTerritory, setSelTerritory] = useState();
    const [countriesCodes, setCountriesCodes] = useState();
    const [selCountry, setSelCountry] = useState();


    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    function handleChangeInd(event) { setSelIndustry(event.target.value); }
    function handleChangeMark(event) { setSelMarket(event.target.value); }
    function handleChangeTerr(event) { setSelTerritory(event.target.value); }
    function handleChangeC(event) { 
         var index = countriesCodes.map(function(e) { return e.NAME; }).indexOf(event.target.value);
         setSelCountry(countriesCodes[index]);
    }
    function handleChangeCC(event) { 
        var index = countriesCodes.map(function(e) { return e.A2CODE; }).indexOf(event.target.value);
        setSelCountry(countriesCodes[index]);
   }
   function cancel(){ resetStates(props.fstate,'Customers');}

    useEffect(() => {
        axios.post('http://localhost:3001/getCountriesCodes','',{ headers: { 'jwt': props.user[1] }})
            .then(function (response) {
                setCountriesCodes(response.data);
                setSelCountry({'A2CODE': 'IT', 'NAME':'Italy'});

                axios.post('http://localhost:3001/getParameters','table=INDUSTRIES',{ headers: { 'jwt': props.user[1] }})
                    .then(function (response) {
                        setIndustry(response.data);
                        setSelIndustry(response.data[0].ID);

                        axios.post('http://localhost:3001/getParameters','table=MARKETS',{ headers: { 'jwt': props.user[1] }})
                            .then(function (response) {
                                if (response.data != null && response.data.length > 0) {
                                    setMarket(response.data);
                                    setSelMarket(response.data[0].ID);
                                }
                                axios.post('http://localhost:3001/getParameters','table=TERRITORIES',{ headers: { 'jwt': props.user[1] }})
                                    .then(function (response) {
                                        if (response.data != null && response.data.length > 0) {
                                            setTerritory(response.data);
                                            setSelTerritory(response.data[0].ID);
                                        }
                                        setLoading(false);})
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
    } else return (
        <div>
        <Card >
            <CardContent>
                <form onSubmit={insertRecord}>
                    <Typography color="secondary" gutterBottom>
                        {MItems.customer}
                    </Typography>
                    <br></br>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.name}</mat-label>
                                    <input id='NAME' name='NAME' className='cname' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.website}</mat-label>
                                    <input id='WEB' name='WEB' className='cweb' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.employeesNumber}</mat-label>
                                    <input id='EMPLOYEESNUMBER' name='EMPLOYEESNUMBER' className='cempNum' size='5px'></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.turnover}</mat-label>
                                    <input id='TURNOVER' name='TURNOVER' className='cturn'></input>
                                </mat-form-field>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.vat}</mat-label>
                                    <input id='VAT' name='VAT' className='cweb' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.sdi}</mat-label>
                                    <input id='SDINUM' name='SDINUM' className='csdi' ></input>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.pec}</mat-label>
                                    <input id='PEC' name='PEC' className='cpec' ></input>
                                </mat-form-field>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <div>
                                {industry !== undefined ?
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.industry}</mat-label>
                                    <Select value={selIndustry} onChange={handleChangeInd} name='INDUSTRYID' className='cselOptInd'>
                                        {industry.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.INDUSTRY}</option>); })}
                                    </Select>
                                </mat-form-field> : <b></b>
                                }
                            </div>
                            <div>
                                {market !== undefined ?
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.market}</mat-label>
                                    <Select value={selMarket} onChange={handleChangeMark} name='MARKETID' className='cselOptMark'>
                                        {market.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.MARKET}</option>); })}
                                    </Select>
                                </mat-form-field> : <b></b>
                                }
                            </div>
                            <div>
                                {territory !== undefined ?
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label className='cselLabel'>{MItems.territory}</mat-label>
                                    <Select value={selTerritory} onChange={handleChangeTerr} name='TERRITORYID' className='cselOptTerr'>
                                        {territory.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.TERRITORY}</option>); })}
                                    </Select>
                                </mat-form-field> : <b></b>
                                }
                            </div>
                        </Grid>
                    </Grid>
                    <br></br>
                    <Divider light />
                    <br></br>
                    <Typography color="secondary" gutterBottom>
                        {MItems.headquarter}
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
                                        <Select value={selCountry.NAME} onChange={handleChangeC} name='COUNTRY' className='cselC'>
                                            {countriesCodes.map((e)=>{ return(<option value={e.NAME} key={e.A2CODE} >{e.NAME}</option>); })}
                                        </Select>
                                </mat-form-field>
                            </div>
                            <div>
                                <mat-form-field appearance="fill" modal-md>
                                    <mat-label>{MItems.countryCode}</mat-label>
                                        <Select value={selCountry.A2CODE} onChange={handleChangeCC} name='COUNTRYCODE' className='cselCC'>
                                            {countriesCodes.map((e)=>{ return(<option value={e.A2CODE} key={e.A2CODE} >{e.A2CODE}</option>); })}
                                        </Select>
                                </mat-form-field>
                            </div>
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <div className='csubmit'>
                                <Button variant="contained" color="secondary" type='submit' >
                                    <p>{MItems.save}</p>
                                    <SendIcon />
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4}></Grid>
                        <Grid item xs={12} sm={4}>
                            <div className='ccancel'>
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
            target='http://localhost:3001/insertNewCustomer'
            back='Customers'
        />

        <AlertDialog open={alertOpen} fclose={setAlertOpen}
            message={Messages.obligatoryFields}
            message2={Messages.customerMF}
        />
        </div>
    );

    function insertRecord(event){
        event.preventDefault();
        var postData='CREATEDBY='+props.user[0].ID;
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
        if (iFields.NAME === undefined || iFields.NAME.length < 1) { setAlertOpen(true); return; }
        if (iFields.VAT === undefined || iFields.VAT.length < 1)   { setAlertOpen(true); return; }
        //---
        setPostData(postData);
        if (mod) setOpen(true);
    }

}