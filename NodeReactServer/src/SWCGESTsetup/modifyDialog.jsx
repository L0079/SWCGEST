import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import GetMessages from '../Utilities/getMessages';

export default function ModifyDialog(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const setOpen   = props.fopen;
    const tableName = props.table;
    // eslint-disable-next-line no-unused-vars
    const index     = props.index;
    // eslint-disable-next-line no-unused-vars
    const ftable    = props.ftable;
    // eslint-disable-next-line no-unused-vars
    const tData     = props.tableData;

    var item = props.tableData.data[props.index];
    var itemArray = [];
    for (var k in item) { itemArray.push({[k]:item[k]}); }
 
    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    function modifyRecord(event){
        event.preventDefault();
        var modified = false;
        var postData='table='+tableName;

        let inputs = event.target.getElementsByTagName('input');
        let idName=inputs[0].getAttribute('name');
        let id=inputs[0].getAttribute('placeholder');
        postData = postData+'&'+idName+'='+id;

        for(var i=0; i<inputs.length; i++) {
            var input=inputs[i];
            if (input.value.length > 0) {
                input.value = input.value.replace('&','%26');
                postData = postData+'&'+input.name+'='+input.value;
                props.tableData.data[props.index][input.name] = input.value;
                modified = true;
            }
        }
        if(modified){
        // eslint-disable-next-line no-restricted-globals
            axios.post('http://localhost:3001/modifyRecord',postData,{ headers: { 'jwt': props.user[1] }})
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
            props.ftable(props.tableData);
        }
        setOpen(false);
    }

    return (
        <Dialog open={props.open} >
            <DialogTitle>{'Modifica Record'}</DialogTitle>
            <DialogContent modal-md>
                <form className='formModify' onSubmit={modifyRecord}> 
                    {  itemArray.map((i, ind)=>{ return ( ind === 0 ?
                        <mat-form-field key={0} appearance="fill" >
                            <div>
                            <mat-label>{Object.keys(i)[0]}</mat-label>
                            <input key={Object.keys(i)[0]} id={Object.keys(i)[0]} name={Object.keys(i)[0]} 
                            placeholder={Object.values(i)[0]} disabled ></input>
                            </div>
                            <Divider light />
                        </mat-form-field> :
                        <mat-form-field key={Object.keys(i)[0]} appearance="fill" >
                            <div>
                            <mat-label>{Object.keys(i)[0]}</mat-label>
                            <input key={Object.keys(i)[0]} id={Object.keys(i)[0]} name={Object.keys(i)[0]}
                            placeholder={Object.values(i)[0]} className={Object.keys(i)[0]}></input>
                            </div>
                            <Divider light />
                        </mat-form-field>
                        )})
                    }
                    <br></br>
                    <div className='formButtons'>
                        <Button onClick={()=>{setOpen(false)}} variant="contained" color="secondary" className='aaa' autoFocus>
                            {Messages.leave}
                        </Button>
                        <Button variant="contained" color="secondary" type='submit' autoFocus>
                            {Messages.modify}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// <Dialog open={props.open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
//      <DialogTitle  id="alert-dialog-title">{'Modifica Record'}</DialogTitle>
//            <DialogTitle  id="alert-dialog-title">{'Modifica Record'}</DialogTitle>
//                        <mat-form-field key={0} appearance="fill" modal-md>