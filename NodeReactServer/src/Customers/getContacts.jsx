import React          from 'react';
import { useState, useEffect } from 'react';
import { DataGrid }   from '@material-ui/data-grid';
import Card           from '@material-ui/core/Card';
import CardContent    from '@material-ui/core/CardContent';
import IconButton     from "@material-ui/core/IconButton";
import DeleteIcon     from '@material-ui/icons/Delete';
import ViewListIcon   from '@material-ui/icons/ViewList';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon     from "@material-ui/icons/Search";
import TextField      from '@material-ui/core/TextField';
import AddCircleIcon  from '@material-ui/icons/AddCircle';
import Tooltip        from '@material-ui/core/Tooltip';
//
import resetStates     from '../Utilities/resetStates';
import {GetMenusItems} from '../Utilities/getTitles';


export default function GetContacts(props){
  const [isLoading, setLoading] = useState(true);
  const [allData, setAllData] = useState();
  const [contatctsData, setContatctsData] = useState();
  const axios = require('axios');
  const MItems    = GetMenusItems();

  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }
  function searchContacts(e){
    var tconts=[];
    allData.forEach((cont)=>{ if(cont.NAME.toUpperCase().includes(e.target.value.toUpperCase())||cont.SURNAME.toUpperCase().includes(e.target.value.toUpperCase())||e.target.value == null) tconts.push(cont); });
    setContatctsData(tconts);
  }
  function addContact(){ resetStates(props.fstate,'AddContact'); }
  function modContact(e){
    console.log(e);
  }
  props.setcurrent('Contacts');
  

  useEffect(() => {
    axios.post('http://localhost:3001/getContacts','',{ headers: { 'jwt': props.user[1] }})
      .then(res=>{
        setAllData(res.data.data);
        setContatctsData(res.data.data);
        setLoading(false);})
      .catch(err=>{
        //if response.data is undefined a major error occurred
        if (err.response === undefined || err.response.data === null) { 
            if(err.message === undefined || err.message === null) { errorHandling(err);}
            else { errorHandling(err.message)}; }
        else { errorHandling((err.response.data.length > 0)?err.response.statusText+' - '+err.response.data : err.response.statusText); }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[axios]);

  const renderDeleteButton = (params) => {
    return (
        <strong>
            <DeleteIcon
                size="small"
                onClick={() => {
                  console.log(params);
                  console.log(params.id);
              }}
            >
            </DeleteIcon>
        </strong>
    )
  }

  const renderDetailsButton = (params) => {
    return (
        <strong>
            <ViewListIcon
                onClick={() => {
                    console.log(params);
                    modContact(params);
                }}
            >
            </ViewListIcon>
        </strong>
    )
  }
  
  // CUSTOMERS TABLE
  const tableHead = [
    {field:'ID', headerName:'ID', hide: true},
    {field:'CUSTOMER', headerName: MItems.customer, width: 150},
    {field:'NAME', headerName: MItems.name, width: 180}, 
    {field:'SURNAME', headerName: MItems.surname, width: 180},
    {field:'ROLE', headerName: MItems.role, width: 150}, 
    {field:'EMAIL', headerName: MItems.mail, width: 150},
    {field:'MOBILE', headerName: MItems.mobile, width: 150}, 
    {field:'TELEPHONE', headerName: MItems.telephone, width: 150},
    {field:'PREMISE', headerName: MItems.premise, width: 150},
    {field:'DEL', headerName:'DELETE',  renderCell: renderDeleteButton, disableColumnMenu: true, sortable: false},
    {field:'DET', headerName:'DETAILS', renderCell: renderDetailsButton,disableColumnMenu: true, sortable: false}
  ];

  if (isLoading) {
    return <div > Loading... </div>;
  } else return (
    <Card >
      <CardContent>
        <Tooltip title={MItems.ttAddContact} aria-label="add">
          <AddCircleIcon size="large" color='secondary' onClick={addContact} className='coAddContact' tooltip={MItems.ttAddContact} />
        </Tooltip>

        <TextField  label={MItems.searchContacts}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton><SearchIcon /></IconButton>
              </InputAdornment>
            )
          }}
          onChange={searchContacts}
          className='csearch'
        />
      </CardContent>
      <CardContent className='ccard' >
        <DataGrid rows={contatctsData} columns={tableHead} autoPageSize />
      </CardContent>
    </Card>
  );
}