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


export default function GetOpportunities(props){
  const [isLoading, setLoading] = useState(true);
  const [allData, setAllData] = useState();
  const [oppsData, setOppsData] = useState();
  const axios = require('axios');
  const MItems    = GetMenusItems();

  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }
  function searchOpportunities(e){
    var topps=[];
    allData.forEach((opp)=>{ 
      if(opp.NAME.toUpperCase().includes(e.target.value.toUpperCase())||e.target.value == null) topps.push(opp); });
    setOppsData(topps);
  }
  function modOpportunity(e){
    props.setOpportunityId(e.id);
    resetStates(props.fstate,'OpportunityDetails');
  }
  function addOpportunity(){ resetStates(props.fstate,'AddOpportunity'); }

  useEffect(() => {
    axios.post('http://localhost:3001/getOpportunities','DATEFORMAT='+MItems.dateFormatSelect,{ headers: { 'jwt': props.user[1] }})
      .then(res=>{
        setAllData(res.data.data);
        setOppsData(res.data.data);
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
    return (<strong><ViewListIcon onClick={() => { modOpportunity(params);}}></ViewListIcon></strong>);
  }

  // CUSTOMERS TABLE
  const tableHead = [
    {field:'ID', headerName:'ID', hide: true}, 
    {field:'NAME', headerName: MItems.name, width: 200}, 
    {field:'CUSTOMER', headerName: MItems.customer, width: 200},
    {field:'AMOUNT', headerName: MItems.amount, width: 150}, 
    {field:'WINPROB', headerName: MItems.winpro, width: 150}, 
    {field:'CLOSEDATE', headerName: MItems.cdate, width: 200},
    {field:'DEL', headerName:'DELETE',  renderCell: renderDeleteButton, disableColumnMenu: true, sortable: false},
    {field:'DET', headerName:'DETAILS', renderCell: renderDetailsButton,disableColumnMenu: true, sortable: false}
  ];

  if (isLoading) {
    return <div > Loading... </div>;
  } else return (
      <Card >
        <CardContent>
          <Tooltip title={MItems.ttAddOpportunity} aria-label="add">
            <AddCircleIcon size="large" color='secondary' onClick={addOpportunity} className='oAddOpportunity' tooltip={MItems.ttAddOpportunity} />
          </Tooltip>
          <TextField  label={MItems.searchOpportunities}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton><SearchIcon /></IconButton>
                </InputAdornment>
              )
            }}
            onChange={searchOpportunities}
            className='osearch'
          />
        </CardContent>
      <CardContent className='ocard' >
            <DataGrid autoPageSize pagination rows={oppsData} columns={tableHead} onCellDoubleClick={modOpportunity}/>
        </CardContent>
      </Card>
  );
}