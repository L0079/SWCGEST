import React, { useState, useEffect } from 'react';
import Divider  from '@material-ui/core/Divider';
import Button   from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Select from '@material-ui/core/Select';

import GetMessages   from '../Utilities/getMessages';
import ConfirmDialog from './confirmInsertDialog';

export default function AddItem(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const tableName = props.table;
    const [unitId, setUnitId]         = useState();
    const [selUnitId, setSelUnitId]   = useState();
    const [isLoading, setLoading]     = useState(true);
    const [open, setOpen]             = useState(false);
    const [modified, setModified]     = useState(false);
    const [postData, setPostData]     = useState();

    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    function handleChange(event) { setSelUnitId(event.target.value); console.log(event.target.value); }

    useEffect(() => {
        axios.post('http://localhost:3001/getParameters','table=UNITS',{ headers: { 'jwt': props.user[1] }})
            .then(function (response) {
//              console.log(response.data);
                setUnitId(response.data);
                setSelUnitId(response.data[0].ID);
                setLoading(false);})
            .catch(err=>{
                //if response.data is undefined a major error occurred
                if (err.response === undefined || err.response.data === null) { 
                    if(err.message === undefined || err.message === null) { errorHandling(err);}
                    else { errorHandling(err.message)}; }
                else { errorHandling((err.response.data.length > 0)?err.response.statusText+' - '+err.response.data : err.response.statusText); }
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.table, axios, postData]);
    if (isLoading) {
        return <div > Loading... </div>;
    } else return (
        <div className="testa" >
            <div className="dbtableTitleM"><p>{tableName}</p></div>
            <form className='formModify' onSubmit={insertRecord}>
                <mat-form-field appearance="fill" modal-md>
                    <div>
                        <mat-label>NAME</mat-label>
                        <input id='NAME' name='NAME' ></input>
                    </div>
                    <Divider light />
                </mat-form-field>
                <mat-form-field appearance="fill" modal-md>
                    <div>
                        <mat-label>DESCRIPTION</mat-label>
                        <input id='DESCRIPTION' name='DESCRIPTION' ></input>
                    </div>
                    <Divider light />
                </mat-form-field>
                <mat-form-field appearance="fill" modal-md>
                    <div>
                        <mat-label>PRICE</mat-label>
                        <input id='PRICE' name='PRICE' ></input>
                    </div>
                    <Divider light />
                </mat-form-field>
                <mat-form-field appearance="fill" modal-md>
                    <div>
                        <mat-label>COST</mat-label>
                        <input id='COST' name='COST' ></input>
                    </div>
                    <Divider light />
                </mat-form-field>
                <mat-form-field appearance="fill" modal-md>
                    <div>
                        <mat-label>UNIT</mat-label>
                        <Select defaultValue={selUnitId} onChange={handleChange} name='UNITID'>
                            {unitId.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.CODE} - {e.NAME}</option>); })}
                        </Select>
                    </div>
                    <Divider light />
                </mat-form-field>
                <br></br>
            <Button variant="contained" color="secondary" type='submit'>
                <p>Insert</p>
                <SendIcon />
            </Button>
            </form>
            <ConfirmDialog open={open} fopen={setOpen}
                message={Messages.insertRecord}
                modified={modified}
                postData={postData}
                fstate={props.fstate}
                ferror={props.ferror}
                user={props.user}
            />
        </div>
    );

    function insertRecord(event){
        event.preventDefault();
        var postData='table='+tableName;
        var mod = false;
        let inputs = event.target.getElementsByTagName('input');
        for(var i=0; i<inputs.length; i++) {
            var input=inputs[i];
           if (input.value.length > 0) {
            postData = postData+'&'+input.name+'='+input.value;
            setModified(true);
            mod=true;
            }
        }

        console.log(postData);
        console.log('-------------------------------------------------');


        if(mod) {
            postData = postData+'&CREATEDBY='+props.user[0].ID;
        }
        setPostData(postData);
        if (mod) setOpen(true);
    }
}