import React from 'react';
//import ReactDOM from 'react-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useState, useEffect } from 'react';

import DeleteDialog from './deleteDialog';
import resetStates from '../Utilities/resetStates';
import ModifyDialog from './modifyDialog';

export default function GetTable(props){
  const [delOpen, setDelOpen] = React.useState(false);
  const [modOpen, setModOpen] = React.useState(false);
  const [isLoading, setLoading] = useState(true);
  const [tableData, setTableData] = useState();
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState('');
  const axios = require('axios');
  const tableName=props.table;
  const postData='table='+tableName;

  function clickDelete(item, index){
    setItems(item);
    setIndex(index);
    setDelOpen(true);
  }
  function clickModify(index){
    setIndex(index);
    setModOpen(true);
  }
  function addRecord(){
    resetStates(props.fstate,'AddRecord');
  }
  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }

  useEffect(() => {
    axios.post('http://localhost:3001/getTable',postData,{ headers: { 'jwt': props.user[1] }})
      .then(res=>{
        setTableData(res.data);
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
      <TableContainer component={Paper}>
        <div className="dbtableTitle">
          <p>{tableName}</p>
          <AddCircleIcon size="large" color='secondary' onClick={addRecord}/>
        </div>
        <Table size="small" aria-label="a dense table" aria-labelledby={tableName}>
          <TableHead>
              <TableRow>
              {tableData.fields.map((f, idx)=>{return (<TableCell key={idx} className={f.COLUMN_NAME}>{f.COLUMN_NAME}</TableCell>);})}
              <TableCell></TableCell>
              <TableCell></TableCell>
              </TableRow>
          </TableHead>
          <TableBody>
            {tableData.data.map((r, ridx)=>{
              if(r != null) {
                let re = Object.values(r);
                return (
                    <TableRow key={ridx} >
                      { re.map((d, didx)=>{return(<TableCell key={didx}>{d}</TableCell>)}) }
                      <TableCell>
                        <CreateIcon size="large" onClick={()=>{clickModify(ridx)}}/>
                      </TableCell>
                      <TableCell>
                        <DeleteIcon size="large" onClick={()=>{clickDelete(r, ridx)}} />
                      </TableCell>
                    </TableRow>    
                );
              } else return (<div></div>);
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteDialog open={delOpen} fopen={setDelOpen} 
        table={props.table}
        items={items}
        index={index}
        tableData={tableData}
        ftable={setTableData}
        ferror={props.ferror}
        fstate={props.fstate}
        user={props.user}
      />
      <ModifyDialog open={modOpen} fopen={setModOpen} 
        table={props.table}
        tableData={tableData}
        index={index}
        ftable={setTableData}
        ferror={props.ferror}
        fstate={props.fstate}
        user={props.user}
      />

    </div>
  );
}