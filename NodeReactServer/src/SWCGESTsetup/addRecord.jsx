import React, { useState, useEffect } from 'react';
import Divider  from '@material-ui/core/Divider';
import Button   from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

import GetMessages   from '../Utilities/getMessages';
import ConfirmDialog from './confirmInsertDialog';

export default function AddRecord(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const tableName = props.table;
    const [fieldsName, setFieldsName] = useState();
    const [isLoading, setLoading]     = useState(true);
    const [open, setOpen]             = useState(false);
    const [modified, setModified]     = useState(false);
    const [postData, setPostData]     = useState();
    
    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    useEffect(() => {
        axios.post('http://localhost:3001/getFields','table='+tableName,{ headers: { 'jwt': props.user[1] }})
            .then(function (response) {
            let fn = response.data.map(o=>{ return Object.values(o)[0];});
            setFieldsName(fn);
            setLoading(false);
        })
        .catch(err=>{
            //if response.data is undefined a major error occurred
            if (err.response === undefined || err.response.data === null) {
                if(err.message === undefined || err.message === null) { errorHandling(err);}
                else { errorHandling(err.message)}; }
            else { errorHandling((err.response.data.length > 0)?err.response.statusText+' - '+err.response.data : err.response.statusText); }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.table, axios, tableName]);
    if (isLoading) {
        return <div > Loading... </div>;
    } else return (
        <div className="testa" >
            <div className="dbtableTitleM"><p>{tableName}</p></div>
            <form className='formModify' onSubmit={insertRecord}>
                {fieldsName.map((i, ind)=>{ 
                    if ( i !== 'ID' && i !== 'CREATEDBY' && i !== 'CREATEDAT' &&
                         i !== 'MODIFIEDBY' && i !== 'MODIFIEDAT'
                    ) return ( 
                        <mat-form-field key={ind} appearance="fill" modal-md>
                            <div>
                                <mat-label>{i}</mat-label>
                                <input id={i} name={i} ></input>
                            </div>
                            <Divider light />
                        </mat-form-field>
                    );
                    else return (<div key={ind}></div>);
                })}
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
            input.value = input.value.replace('&','%26');
            postData = postData+'&'+input.name+'='+input.value;
            setModified(true);
            mod=true;
            }
        }
        if(mod) {
            postData = postData+'&CREATEDBY='+props.user[0].ID;
        }
        setPostData(postData);
        if (mod) setOpen(true);
    }
}