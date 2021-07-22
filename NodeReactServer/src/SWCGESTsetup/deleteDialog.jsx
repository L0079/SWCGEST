import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import GetMessages from '../Utilities/getMessages';

export default function DeleteDialog(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const setOpen   = props.fopen;
    const tableName = props.table;
    const idName    = Object.keys(props.items)[0];
    const idValue   = Object.values(props.items)[0];
    const index     = props.index;
    const ftable    = props.ftable;
    const tData     = props.tableData;

    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
      }
    
    function deleteRecord(){
        let postData='table='+tableName+'&idName='+idName+'&idValue='+idValue;
        // eslint-disable-next-line no-restricted-globals
        axios.post('http://localhost:3001/deleteRecord',postData,{ headers: { 'jwt': props.user[1] }})
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
        tData.data.splice(index,1);
        ftable(tData);
        setOpen(false);
    }

    return (
        <Dialog open={props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle  id="alert-dialog-title">{Messages.alert}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {Messages.deleteRecord}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <div className='formButtons'>
                    <Button onClick={()=>{setOpen(false)}} variant="contained" color="secondary" autoFocus>
                        {Messages.cancel}
                    </Button>
                    <Button onClick={deleteRecord} variant="contained" color="secondary" autoFocus>
                        {Messages.confirm}
                    </Button>
                </div>
            </DialogActions>
      </Dialog>
    );
}