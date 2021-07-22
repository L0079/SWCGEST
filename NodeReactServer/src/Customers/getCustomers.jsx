import React          from 'react';
import { useState, useEffect } from 'react';
import { DataGrid }   from '@material-ui/data-grid';
import Card           from '@material-ui/core/Card';
import CardContent    from '@material-ui/core/CardContent';
import IconButton     from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon     from "@material-ui/icons/Search";
import TextField      from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewListIcon from '@material-ui/icons/ViewList';
import AddCircleIcon  from '@material-ui/icons/AddCircle';
import Tooltip        from '@material-ui/core/Tooltip';
//
import resetStates     from '../Utilities/resetStates';
import {GetMenusItems} from '../Utilities/getTitles';


export default function GetCustomers(props){
  const [isLoading, setLoading] = useState(true);
  const [allData, setAllData] = useState();
  const [custData, setCustData] = useState();
  const axios = require('axios');
  const MItems    = GetMenusItems();

  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }
  function searchCustomers(e){
    var tcust=[];
    allData.forEach((cust)=>{ 
      if(cust.NAME.toUpperCase().includes(e.target.value.toUpperCase())||e.target.value == null) tcust.push(cust); });
    setCustData(tcust);
  }
  function modCustomer(e){
    props.setCustomerId(e.id);
    resetStates(props.fstate,'CustomerDetails');
  }
  function addCustomer(){ resetStates(props.fstate,'AddCustomer'); }

  useEffect(() => {
    axios.post('http://localhost:3001/getCustomers','',{ headers: { 'jwt': props.user[1] }})
      .then(res=>{
        setAllData(res.data.data);
        setCustData(res.data.data);
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
    return (<strong><ViewListIcon onClick={() => { modCustomer(params);}}></ViewListIcon></strong>);
  }

  // CUSTOMERS TABLE
  const tableHead = [
    {field:'ID', headerName:'ID', hide: true}, 
    {field:'NAME', headerName: MItems.name, width: 200}, 
    {field:'VAT', headerName: MItems.vat, width: 150},
    {field:'SDINUM', headerName: MItems.sdi, width: 150}, 
    {field:'INDUSTRY', headerName: MItems.industry, width: 150}, 
    {field:'MARKET', headerName: MItems.market, width: 150},
    {field:'GENERICEMAIL', headerName: MItems.genericMail, width: 180}, 
    {field:'WEB', headerName: MItems.website, width: 180},
    {field:'DEL', headerName:'DELETE',  renderCell: renderDeleteButton, disableColumnMenu: true, sortable: false},
    {field:'DET', headerName:'DETAILS', renderCell: renderDetailsButton,disableColumnMenu: true, sortable: false}
  ];

  if (isLoading) {
    return <div > Loading... </div>;
  } else return (
      <Card >
        <CardContent>
          <Tooltip title={MItems.ttAddCustomer} aria-label="add">
            <AddCircleIcon size="large" color='secondary' onClick={addCustomer} className='cAddCustomer' tooltip={MItems.ttAddCustomer} />
          </Tooltip>
          <TextField  label={MItems.searchCustomers}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
            onChange={searchCustomers}
            className='csearch'
          />
        </CardContent>
      <CardContent className='ccard' >
            <DataGrid autoPageSize pagination rows={custData} columns={tableHead} onCellDoubleClick={modCustomer}/>
        </CardContent>
      </Card>
  );
}