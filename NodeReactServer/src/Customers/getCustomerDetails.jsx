import React          from 'react';
import { useState, useEffect } from 'react';
import Card           from '@material-ui/core/Card';
import CardContent    from '@material-ui/core/CardContent';
import Select         from '@material-ui/core/Select';
import Divider        from '@material-ui/core/Divider';
import Grid           from '@material-ui/core/Grid';
import Typography     from '@material-ui/core/Typography';
import Button         from '@material-ui/core/Button';
import SendIcon       from '@material-ui/icons/Send';
import { DataGrid }   from '@material-ui/data-grid';
import AddCircleIcon  from '@material-ui/icons/AddCircle';
import Tooltip from '@material-ui/core/Tooltip';
//
import {GetMenusItems} from '../Utilities/getTitles';
import AddContactDialog from './addContactDialog';
import AddPremiseDialog from './addPremiseDialog';

export default function GetCustomerDetails(props){
  const axios  = require('axios');
  const MItems = GetMenusItems();
  const [isLoading, setLoading]         = useState(true);
  const [contactOpen, setContactOpen]   = useState(false);
  const [premiseOpen, setPremiseOpen]   = useState(false);
  const [custData, setCustData]         = useState();
  const [premsData, setPremsData]       = useState('');
  const [contsData, setContsData]       = useState();
  const [industry, setIndustry]         = useState();
  const [selIndustry, setSelIndustry]   = useState('');
  const [market, setMarket]             = useState();
  const [selMarket, setSelMarket]       = useState('');
  const [territory, setTerritory]       = useState();
  const [selTerritory, setSelTerritory] = useState('');
  const [countriesCodes, setCountriesCodes] = useState();
  // const [selCountry, setSelCountry] = useState();

  function errorHandling(e){
    props.ferror(e);
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
  }
  function handleChangeInd(event) { setSelIndustry(event.target.value); }
  function handleChangeMark(event) { setSelMarket(event.target.value); }
  function handleChangeTerr(event) { setSelTerritory(event.target.value); }
//   function handleChangeC(event) { 
//        var index = countriesCodes.map(function(e) { return e.NAME; }).indexOf(event.target.value);
//        setSelCountry(countriesCodes[index]);
//   }
//   function handleChangeCC(event) { 
//       var index = countriesCodes.map(function(e) { return e.A2CODE; }).indexOf(event.target.value);
//       setSelCountry(countriesCodes[index]);
//  }
 function addContact(e) {
   console.log(e);
   setContactOpen(true);
 }
 function addPremise(e) {
  console.log(e);
  setPremiseOpen(true);
}

  function updateCustomer(e) {
console.log('Update Customer', e);
  }

  useEffect(() => {
    let postData='custId='+props.customerId;
    axios.post('http://localhost:3001/getCustomerDetails',postData,{ headers: { 'jwt': props.user[1] }})
      .then(res=>{
        setCustData(res.data.customer);
        setPremsData(res.data.premises);
        setContsData(res.data.contacts);

//Verificare per Country
        setSelIndustry(res.data.customer.INDUSTRYID);
        setSelMarket(res.data.customer.MARKETID);
        setSelTerritory(res.data.customer.TERRITORYID);
        axios.post('http://localhost:3001/getParameters','table=INDUSTRIES',{ headers: { 'jwt': props.user[1] }})
            .then(function (resIn) {
                setIndustry(resIn.data);

                axios.post('http://localhost:3001/getParameters','table=MARKETS',{ headers: { 'jwt': props.user[1] }})
                    .then(function (resMK) {
                      setMarket(resMK.data);
                        
                      axios.post('http://localhost:3001/getParameters','table=TERRITORIES',{ headers: { 'jwt': props.user[1] }})
                          .then(function (resTR) {
                            setTerritory(resTR.data);
                          
                            axios.post('http://localhost:3001/getCountriesCodes','',{ headers: { 'jwt': props.user[1] }})
                              .then(function (response) {
                                  setCountriesCodes(response.data);
                                  setLoading(false);
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
  },[axios]);
  
  // PREMISES TABLE
  const premTableHead = [
    {field:'ID', headerName:'ID', width: 40}, 
    {field:'PREMISE', headerName: MItems.premise, width: 200}, 
    {field:'STREET', headerName: MItems.street, width: 150},
    {field:'CITY', headerName: MItems.city, width: 150}, 
    {field:'ZIP', headerName: MItems.zip, width: 150}, 
    {field:'PROVINCE', headerName: MItems.province, width: 150},
    {field:'TELEPHONE', headerName: MItems.telephone, width: 180}, 
    {field:'COUNTRY', headerName: MItems.country, width: 180},
    {field:'COUNTRYCODE', headerName: MItems.countrycode, width: 180}
  ];
  // CONTACTS TABLE
  const contTableHead = [
    {field:'ID', headerName:'ID', width: 40}, 
    {field:'NAME', headerName: MItems.name, width: 200}, 
    {field:'SURNAME', headerName: MItems.surname, width: 150},
    {field:'ROLE', headerName: MItems.role, width: 150},
    {field:'EMAIL', headerName: MItems.EMAIL, width: 150},
    {field:'TELEPHONE', headerName: MItems.telephone, width: 180}, 
    {field:'MOBILE', headerName: MItems.mobile, width: 180},
    {field:'PREMISE', headerName: MItems.premise, width: 180}
  ];

  if (isLoading) {
    return <div > Loading... </div>;
  } else return (
    <div>
    <Card >
      <CardContent>
        <form onSubmit={updateCustomer}>
          <Typography color="secondary" gutterBottom>
              {MItems.customer}
          </Typography>
          <br></br>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.name}</mat-label>
                    <input id='NAME' name='NAME' className='cname' placeholder={custData.NAME} ></input>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.website}</mat-label>
                    <input id='WEB' name='WEB' className='cweb' placeholder={custData.WEB}></input>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.employeesNumber}</mat-label>
                    <input id='EMPLOYEESNUMBER' name='EMPLOYEESNUMBER' className='cempNum' size='5px' placeholder={custData.EMPLOYEESNUMBER}></input>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.turnover}</mat-label>
                    <input id='TURNOVER' name='TURNOVER' className='cturn' placeholder={custData.TURNOVER}></input>
                </mat-form-field>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.vat}</mat-label>
                    <input id='VAT' name='VAT' className='cvat'  placeholder={custData.VAT}></input>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.sdi}</mat-label>
                    <input id='SDINUM' name='SDINUM' className='csdi'  placeholder={custData.SDINUM}></input>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                    <mat-label>{MItems.pec}</mat-label>
                    <input id='PEC' name='PEC' className='cpec' placeholder={custData.PEC}></input>
                </mat-form-field>
              </div>
            </Grid>
            <Grid item xs={12} sm={4}>
              <div>
                <mat-form-field appearance="fill" modal-md>
                  <mat-label className='cselLabel'>{MItems.industry}</mat-label>
                  <Select value={selIndustry} onChange={handleChangeInd} name='INDUSTRYID' className='cselOptInd'>
                      {industry.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.INDUSTRY}</option>); })}
                  </Select>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                  <mat-label className='cselLabel'>{MItems.market}</mat-label>
                  <Select value={selMarket} onChange={handleChangeMark} name='MARKETID' className='cselOptMark'>
                    {market.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.MARKET}</option>); })}
                  </Select>
                </mat-form-field>
              </div>
              <div>
                <mat-form-field appearance="fill" modal-md>
                  <mat-label className='cselLabel'>{MItems.territory}</mat-label>
                  <Select value={selTerritory} onChange={handleChangeTerr} name='TERRITORYID' className='cselOptTerr'>
                      {territory.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.TERRITORY}</option>); })}
                  </Select>
                </mat-form-field>
              </div>
            </Grid>
          </Grid>
          <br></br>
          <Button variant="contained" color="secondary" type='submit'>
            <p>{MItems.update}</p>
            <SendIcon />
          </Button>
        </form>
            <br></br>
        <Divider light />
      </CardContent>

      <CardContent>
        <Typography color="secondary" gutterBottom>
          {MItems.premises}
          <Tooltip title={MItems.ttAddPremise} aria-label="add">
            <AddCircleIcon size="large" color='secondary' onClick={addPremise} pageSize={3} className='cAddPremise' />
          </Tooltip>
        </Typography>
        <br></br>
        <div style={{ height: 250, width: '100%' }}>
          <DataGrid rows={premsData} columns={premTableHead} />
        </div>
        <br></br>
        <Divider light />
      </CardContent>

      <CardContent>
        <Typography color="secondary" gutterBottom>
          {MItems.contacts}
          <Tooltip title={MItems.ttAddContact} aria-label="add">
            <AddCircleIcon size="large" color='secondary' onClick={addContact} pageSize={3} className='cAddContact' tooltip='Add new contact' />
          </Tooltip>
        </Typography>

        <br></br>
        <div style={{ height: 250, width: '100%' }}>
          <DataGrid rows={contsData} columns={contTableHead} />
        </div>
      </CardContent>

    </Card>

    <AddContactDialog open={contactOpen} fopen={setContactOpen}
      customerData={custData}
      premises={premsData}
      fstate={props.fstate}
      ferror={props.ferror}
      user={props.user}
      back='CustomerDetails'
    />

    <AddPremiseDialog open={premiseOpen} fopen={setPremiseOpen}
      customerData={custData}
      countriesCodes={countriesCodes}
      premises={premsData}
      setPremises={setPremsData}
      fstate={props.fstate}
      ferror={props.ferror}
      user={props.user}
    />
    </div>
  );
}