import React, { useState, useEffect }  from 'react';
import Button   from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import CancelIcon from '@material-ui/icons/Cancel';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider        from '@material-ui/core/Divider';
import { DataGrid }   from '@material-ui/data-grid';
// import { GridApi, GridCellValue }   from '@material-ui/data-grid';
import AddCircleIcon  from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import { makeStyles } from '@material-ui/core';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import resetStates from '../Utilities/resetStates';
import {GetMenusItems} from '../Utilities/getTitles';
import GetMessages   from '../Utilities/getMessages';
import ConfirmInsertDialog from '../Utilities/confirmInsertDialog';


export default function AddEstimate(props) {
    const axios     = require('axios');
    const Messages  = GetMessages();
    const [isLoading, setLoading]     = useState(true);
    const [open, setOpen]             = useState(false);
    const [modified, setModified]     = useState(false);
    const [postData, setPostData]     = useState();
    // const Titles    = GetTitles();
    const MItems    = GetMenusItems();
    const [contacts, setContacts] = useState([]);
    const [selContact, setSelContact] = useState();
    const [bus, setBUs] = useState([]);
    const [selBU, setSelBU] = useState();
    const [accounts, setAccounts] = useState([]);
    const [selAccount, setSelAccount] = useState();
    const [pms, setPMs] = useState([]);
    const [selPM, setSelPM] = useState();
    const [note, setNote] = useState('');
    const [itemQta, setItemQta] = useState();
    const [itemUPrice, setItemUPrice] = useState();
    const [items, setItems] = useState([]);
    const [selItem, setSelItem] = useState();
    const [price, setPrice] = useState();
    const [itemsData, setItemsData] = useState([]);
    const [itemCounter, setItemCounter] = useState(0);
    const [itemDescription, setItemDescription] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [vats, setVATs] = useState([]);
    const [selVAT, setSelVAT] = useState();
    const [itemAmount, setItemAmount] = useState();
    const [itemsTotalPrice, setItemsTotalPrice] = useState(0);
    const [itemsTotalVAT, setItemsTotalVAT] = useState(0);
    const [itemsTotalAmount, setItemsTotalAmount] = useState(0);

    const [psCounter, setPScounter] = useState(0);
    const [psData, setPSdata] = useState([]);
    const [professionals, setProfessionals] = useState();
    const [selProfessional, setSelProfessional] = useState();
    const [professionalDPrice, setProfessionalDPrice] = useState();
    const [psDays, setPSdays] = useState();
    const [selPSvat, setSelPSvat] = useState();
    const [psPrice, setPSprice] = useState();
    const [psAmount, setPSamount] = useState();
    const [psTotalPrice, setPStotalPrice] = useState(0);
    const [psTotalVAT, setPStotalVAT] = useState(0);
    const [psTotalAmount, setPStotalAmount] = useState(0);

    // const useStyles = makeStyles(theme => ({ removeItemClass: { outline: 'none' } })); //Non funziona
    // const classes = useStyles();

    function errorHandling(e){
        props.ferror(e);
        props.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
    }
    function cancel()                       { resetStates(props.fstate,'Opportunities');}
    function handleChangeContact(event)     { setSelContact(event.target.value); }
    function handleChangeBU(event)          { setSelBU(event.target.value); };
    function handleChangeSaleAccount(event) { setSelAccount(event.target.value); };
    function handleChangePM(event)          { setSelPM(event.target.value); };
    function handleChangeNote(event)        { setNote(event.target.value); };

// ITEMS
    function handleChangeItemQta(event)     { 
        setItemQta(event.target.value);
        let price=itemUPrice * event.target.value;
        let tVAT=vats.filter((e)=>{return e.ID === selVAT})[0];
        let amnt = price + (price * tVAT.VALUE / 100);
        setPrice(price);
        setItemAmount(amnt);
    }
    function handleChangeItemUPrice(event)  { 
        setItemUPrice(event.target.value);
        let prc=event.target.value * itemQta;
        let tVAT=vats.filter((e)=>{return e.ID === selVAT})[0];
        let amt=prc+(prc * tVAT.VALUE / 100);
        setPrice(prc);
        setItemAmount(amt);
    }
    function handleChangeItem(event)        { 
        setSelItem(event.target.value);
        let targetItem=items.filter((e)=>{return e.ID === event.target.value})[0];
        setItemUPrice(targetItem.PRICE);
        setItemQta(1);
        setPrice(targetItem.PRICE);
        setItemCode(targetItem.NAME);
        setItemDescription(targetItem.DESCRIPTION);
    }
    function handleChangeVAT(event) {
        console.log(event.target);
        let targetVAT=vats.filter((e)=>{return e.ID === event.target.value})[0];
        setSelVAT(event.target.value);
        let amnt = price + (price * targetVAT.VALUE / 100);
        setItemAmount(amnt);
    }
    function handleChangeItemDescription(event) { setItemDescription(event.target.value); }
    function addItemToList(){
        let tItem=items.filter((e)=>{return e.ID === selItem});
        let itm={};
        let idata=[];
        itemsData.forEach((e)=>{idata.push(e);});
        itm.id=itemCounter;
        itm.ITEMID=selItem;
        itm.NAME=itemCode;
        itm.DESCRIPTION=itemDescription;
        if (tItem.UNITID === undefined || tItem.UNITID === null) itm.UNITID=0;
        else itm.UNITID=tItem.UNITID;
        itm.UNITS=itemQta;
        itm.UNITPRICE=itemUPrice;
        itm.UNITCOST=0;
        itm.COST=0;
        itm.VAT=(itemAmount - price);
        itm.PRICE=price;
        itm.AMOUNT=itemAmount;
        idata.push(itm);
        setItemsData(idata);
        let cnt=itemCounter; cnt++;
        setItemCounter(cnt);
        let totPrice=0;
        let totAmount=0;
        let totVat=0;
        idata.forEach((e) => {totPrice += e.PRICE; totAmount += e.AMOUNT});
        totVat=totAmount - totPrice;
        setItemsTotalPrice(totPrice);
        setItemsTotalVAT(totVat);
        setItemsTotalAmount(totAmount);
    }
    function itemDatagridFooterComponent() {
        return (
          <div className='etotals'>
              <div className='etotals1'>
                <p>{MItems.totalPrice}: {itemsTotalPrice}</p>
                <p>{MItems.totalVAT}: {itemsTotalVAT}</p>
              </div>
              <div className='etotals2'>
                <p>{MItems.totalAmount}: {itemsTotalAmount}</p>
              </div>
          </div>
        );
    }
    function showAddItem() {
        var ai  = document.getElementById('AddItems');
        var ic1 = document.getElementById('AddItemsIcon');
        var ic2 = document.getElementById('AddItemsIcon2');
        if (ai.style.display === "block") { ai.style.display = "none"; ic2.style.display = "none"; ic1.style.display = "inline-flex"; }
        else { ai.style.display = "block"; ic2.style.display = "inline-flex"; ic1.style.display = "none";}
    }
    function showAddPS() {
        var ai  = document.getElementById('AddPSs');
        var ic1 = document.getElementById('AddPSIcon');
        var ic2 = document.getElementById('AddPSIcon2');
        if (ai.style.display === "block") { ai.style.display = "none"; ic2.style.display = "none"; ic1.style.display = "inline-flex"; }
        else { ai.style.display = "block"; ic2.style.display = "inline-flex"; ic1.style.display = "none";}
    }

// PROFESSIONAL SERVICES
    function handleChangePS(event)        { 
        setSelProfessional(event.target.value);
        let targetPS=professionals.filter((e)=>{return e.ID === event.target.value})[0];
        setProfessionalDPrice(targetPS.DAILYPRICE);
        setPSdays(1);
        let pr = targetPS.DAILYPRICE;
        let tVAT=vats.filter((e)=>{return e.ID === selPSvat})[0];
        let amt = pr + (pr * tVAT.VALUE / 100);
        setPSprice(pr);
        setPSamount(amt);
    }
    function handleChangePSdays(event) {
        setPSdays(event.target.value);     
        let prc=professionalDPrice*event.target.value;
        let tVAT=vats.filter((e)=>{return e.ID === selPSvat})[0];
        let amt=prc+(prc * tVAT.VALUE / 100);
        setPSprice(prc);
        setPSamount(amt);
    }
    function handleChangePSDprice(event)  { 
        setItemUPrice(event.target.value);
        let prc=event.target.value * itemQta;
        let tVAT=vats.filter((e)=>{return e.ID === selPSvat})[0];
        let amt=prc+(prc * tVAT.VALUE / 100);
        setPrice(prc);
        setItemAmount(amt);
    }
    function handleChangePSVAT(event) {
        setSelPSvat(event.target.value);
        let targetVAT=vats.filter((e)=>{return e.ID === event.target.value})[0];
        let amnt = psPrice + (psPrice * targetVAT.VALUE / 100);
        setPSamount(amnt);
    }
    function addPStoList(){
        let tps=professionals.filter((e)=>{return e.ID === selProfessional})[0];
        let ps={};
        let idata=[];
        psData.forEach((e)=>{idata.push(e);});
        ps.id=psCounter;
        ps.PROFESSIONALID=selProfessional;
        ps.CODE=tps.CODE;
        ps.NAME=tps.NAME;
        ps.DAYS=psDays;
        ps.DAILYRATE=professionalDPrice;
        ps.DAILYCOST=0;
        ps.COST=0;
        ps.VAT=(psAmount - psPrice);
        ps.PRICE=psPrice;
        ps.AMOUNT=psAmount;
        idata.push(ps);
        setPSdata(idata);
        let cnt=psCounter; cnt++;
        setPScounter(cnt);
        let totPrice=0;
        let totAmount=0;
        let totVat=0;
        idata.forEach((e) => {totPrice += e.PRICE; totAmount += e.AMOUNT});
        totVat=totAmount - totPrice;
        setPStotalPrice(totPrice);
        setPStotalVAT(totVat);
        setPStotalAmount(totAmount);
    }
    function psDatagridFooterComponent() {
        return (
          <div className='etotals'>
              <div className='etotals1'>
                <p>{MItems.totalPrice}: {psTotalPrice}</p>
                <p>{MItems.totalVAT}: {psTotalVAT}</p>
              </div>
              <div className='etotals2'>
                <p>{MItems.totalAmount}: {psTotalAmount}</p>
              </div>
          </div>
        );
    }


//console.log('PROPS',props);
    useEffect(() => {
        axios.post('http://localhost:3001/getContactsNames','customerId='+props.estimateData.CUSTOMERID,{ headers: { 'jwt': props.user[1] }})
            .then(function (response) {
                setContacts(response.data);
                setSelContact(props.estimateData.CONTACTID);

                axios.post('http://localhost:3001/getTable','table=BUSINESSUNITS',{ headers: { 'jwt': props.user[1] }})
                    .then(res=>{
                        let tbus=res.data.data.sort((a, b) => (a.DISPLAYORDER > b.DISPLAYORDER) ? 1 : -1)
                        setBUs(tbus);
                        setSelBU(props.estimateData.BUSINESSUNITID);

                        axios.post('http://localhost:3001/getAccountsPMs','',{ headers: { 'jwt': props.user[1] }})
                            .then(res=>{
                                setAccounts(res.data.account);
                                setSelAccount(props.estimateData.ACCOUNTID);
                                setPMs(res.data.pm);
                                setSelPM(props.estimateData.PMID);

                                axios.post('http://localhost:3001/getItemsTable','',{ headers: { 'jwt': props.user[1] }})
                                    .then(res=>{                                
                                        setItems(res.data.data);
                                        setSelItem(res.data.data[0].ID);
                                        setItemDescription(res.data.data[0].DESCRIPTION);
                                        setItemUPrice(res.data.data[0].PRICE);
                                        setItemQta(1);
                                        setPrice(res.data.data[0].PRICE);
                                        let tprice=res.data.data[0].PRICE;
                                        setItemCode(res.data.data[0].NAME);

                                        axios.post('http://localhost:3001/getTable','table=VATS',{ headers: { 'jwt': props.user[1] }})
                                            .then(res=>{
                                                setVATs(res.data.data);
                                                let tvats=res.data.data;
                                                setSelVAT(res.data.data[0].ID);
                                                setSelPSvat(res.data.data[0].ID);
                                                let amt = tprice + (tprice * res.data.data[0].VALUE / 100);
                                                setItemAmount(amt);

                                                axios.post('http://localhost:3001/getTable','table=PROFESSIONALS',{ headers: { 'jwt': props.user[1] }})
                                                .then(res=>{
                                                    setProfessionals(res.data.data);
                                                    setSelProfessional(res.data.data[0].ID);
                                                    setPSdays(1);
                                                    setProfessionalDPrice(res.data.data[0].DAILYPRICE);
                                                    setPSprice(res.data.data[0].DAILYPRICE);
                                                    setSelPSvat(tvats[0].ID);
                                                    let amt = res.data.data[0].DAILYPRICE + (res.data.data[0].DAILYPRICE * tvats[0].VALUE / 100);
                                                    setPSamount(amt);
                                                    setLoading(false);
                                                })
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
    },[axios, props.user]);


    const itemsTableHead = [
        {field:'ITEMID', headerName: 'ITEMID', hide: true}, 
        {field:'NAME', headerName: MItems.name, width: 120},
        {field:'DESCRIPTION', headerName: MItems.description, width: 180}, 
        {field:'UNITID', headerName: MItems.unit, hide: true}, 
        {field:'UNITS', headerName: MItems.numUnits, width: 110},
        {field:'UNITPRICE', headerName: MItems.unitPrice, width: 130}, 
        {field:'UNITCOST', headerName: MItems.unitCost, width: 120},
        {field:'PRICE', headerName: MItems.price, width: 120},
        {field:'COST', headerName: MItems.cost, width: 120},
        {field:'VAT', headerName: MItems.vat, width: 90},
        {field:'AMOUNT', headerName: MItems.amount, width: 120},
        {field: "", headerName: MItems.removeItem, sortable: false, width: 100,
            disableClickEventBubbling: true, align: 'center',
//            cellClassName: classes.removeItemClass,
            renderCell: (params) => {
                const onClick = () => {
//                    const api: GridApi = params.api;
//                    const fields = api.getAllColumns().map((c) => c.field).filter((c) => c !== "__check__" && !!c);
                    let thisRow=params.row;
                    let newdata=itemsData.filter((e)=>{ return e.id !== thisRow.id; });
                    let totPrice=0;
                    let totAmount=0;
                    let totVat=0;
                    newdata.forEach((e) => {totPrice += e.PRICE; totAmount += e.AMOUNT});
                    totVat=totAmount - totPrice;
                    setItemsData(newdata);
                    setItemsTotalPrice(totPrice);
                    setItemsTotalVAT(totVat);
                    setItemsTotalAmount(totAmount);
                };
              return <RemoveCircleIcon size="large" color='secondary' onClick={onClick} className={'eremoveItem'}/>
            }
        }
      ];

      const psTableHead = [
        {field:'ID', headerName: 'ID', hide: true}, 
        {field:'NAME', headerName: MItems.name, width: 240},
        {field:'DAYS', headerName: MItems.days, with: 120}, 
        {field:'DAILYRATE', headerName: MItems.dailyRate, width: 130}, 
        {field:'PRICE', headerName: MItems.price, width: 120},
        {field:'VAT', headerName: MItems.vat, width: 90},
        {field:'AMOUNT', headerName: MItems.amount, width: 120},
        {field: "", headerName: MItems.removeItem, sortable: false, width: 100,
            disableClickEventBubbling: true, align: 'center',
            renderCell: (params) => {
                const onClick = () => {
                    let thisRow=params.row;
                    let newdata=psData.filter((e)=>{ return e.id !== thisRow.id; });
                    let totPrice=0;
                    let totAmount=0;
                    let totVat=0;
                    newdata.forEach((e) => {totPrice += e.PRICE; totAmount += e.AMOUNT});
                    totVat=totAmount - totPrice;
                    setPSdata(newdata);
                    setPStotalPrice(totPrice);
                    setPStotalVAT(totVat);
                    setPStotalAmount(totAmount);
                };
              return <RemoveCircleIcon size="large" color='secondary' onClick={onClick} className={'eremoveItem'}/>
            }
        }
      ];


    if (isLoading) {
        return <div > Loading... </div>;
    } else    
    return (
        <div>
        <Card >
            <CardContent className='econtainer'>
                <Typography color="secondary" gutterBottom>
                    {MItems.newEstimate}
                </Typography>
                <br></br>

                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <div className='ecustomer'>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label className='cselLabel'>{MItems.customer}</mat-label>
                                <span className='elm1'> {props.estimateData.CUSTOMERNAME}</span>
                            </mat-form-field>
                        </div>
                        <div className='efcustomer'>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label className='cselLabel'>{MItems.finalCustomer}</mat-label>
                                <span className='elm2'> {props.estimateData.FINALCUSTOMERNAME}</span>
                            </mat-form-field>
                        </div>
                        <div className='efcontact'>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label className='cselLabel'>{MItems.contact}</mat-label>
                                <Select value={selContact} onChange={handleChangeContact} name='CONTACTID' className='oselOptCont' defaultValue={props.estimateData.CONTACTID}>
                                    {contacts.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME}</option>); })}
                                </Select>
                            </mat-form-field>
                        </div>
                    </Grid>

                    <Grid item xs={4}>
                        <div className='espacer1'></div>
                        <div>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label>{MItems.assignedto}</mat-label>
                                <Select value={selAccount} onChange={handleChangeSaleAccount} name='ASSIGNEDTOID' className='eselAssTo' defaultValue={props.estimateData.ACCOUNTID}>
                                    {accounts.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME} {e.SURNAME}</option>); })}
                                </Select>
                            </mat-form-field>
                        </div>
                        <div>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label>{MItems.pm}</mat-label>
                                <Select value={selPM} onChange={handleChangePM} name='PMID' className='eselPM' defaultValue={props.estimateData.PMID}>
                                    {pms.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME} {e.SURNAME}</option>); })}
                                </Select>
                            </mat-form-field>
                        </div>
                        <div>
                            <mat-form-field appearance="fill" modal-md>
                                <mat-label>{MItems.bu}</mat-label>
                                <Select value={selBU} onChange={handleChangeBU} name='BUSINESSUNITID' className='eselOptBU' defaultValue={props.estimateData.BUSINESSUNITID}>
                                    {bus.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.BUSINESSUNIT}</option>); })}
                                </Select>
                            </mat-form-field>
                        </div>
                    </Grid>

                    <Grid item xs={4}>
                        <div>
                            <div className='eamount'>
                                <p>{MItems.amount}</p>
                                <p className='etamount'> {props.estimateData.AMOUNT}</p>
                            </div>
                        </div>
                        <div className='edivfcst'>
                            <p>{MItems.fcst1}</p>
                            <p className='etfcst'> {props.estimateData.FCST1Y}</p>
                        </div>
                        <div>
                            <div className='edivfcst'>
                                <p>{MItems.fcst2}</p>
                                <p className='etfcst'> {props.estimateData.FCST2Y}</p>
                            </div>
                        </div>
                        <div className='edivfcst'>
                            <p>{MItems.fcst3}</p>
                            <p className='etfcst'> {props.estimateData.FCST3Y}</p>
                        </div>
                    </Grid>
                    <Divider light className='edivider'/>
                </Grid>
                <Grid container spacing={3}>
                        <Grid item xs={12} >
                            <div className='espacer2'>
                                <mat-form-field appearance="fill" modal-md >
                                    <TextField
                                        id='NOTE'
                                        name='NOTE'
                                        label={MItems.notes}
                                        multiline
                                        rows={5}
                                        variant="outlined"
                                        className='efullwidth'
                                        value={note}
                                        onChange={handleChangeNote}
                                    />
                                </mat-form-field>
                            </div>
                        </Grid>
                    </Grid>

                <div className={'showAddItem'}>
                    <Typography color="secondary" gutterBottom >
                        <div id='AddItemsIcon' className={'eadditems1'}>
                            <Tooltip title={MItems.ttAddItems} aria-label="add">
                                <KeyboardArrowRightIcon size="large" color='secondary' onClick={showAddItem} className={'eiconalign'}/>
                            </Tooltip>
                        </div>
                        <div id='AddItemsIcon2' className={'eadditems2'}>
                            <Tooltip title={MItems.ttHideItems} aria-label="add">
                                <KeyboardArrowDownIcon size="large" color='secondary' onClick={showAddItem} className={'eiconalign'}/>
                            </Tooltip>
                        </div>
                        {MItems.items}
                    </Typography>
                </div>
                <div id='AddItems' className={'eadditems'}>
                    <CardContent className='eitemsTable'>
                        <br></br>
                        <div style={{ height: 250, width: '100%' }}>
                            <DataGrid rows={itemsData} columns={itemsTableHead} 
                                density='compact' disableColumnMenu={true}
                                disableSelectionOnClick={true} rowsPerPageOptions={[]}
                                components={{ Footer: itemDatagridFooterComponent, }}
                            />
                        </div>
                        <br></br>
                        <Divider light />
                    </CardContent>
                    <div className='eaddItem'>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="Add Item">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="left">{MItems.itemCode}</TableCell>
                                    <TableCell align="left">{MItems.description}</TableCell>                                
                                    <TableCell align="left">{MItems.qta}</TableCell>
                                    <TableCell align="left">{MItems.uprice}</TableCell>
                                    <TableCell align="left">{MItems.price}</TableCell>
                                    <TableCell align="left">{MItems.vat}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left">
                                            <Select value={selItem} onChange={handleChangeItem} name='ITEMID' className='eselOptItem' defaultValue={selItem}>
                                                {items.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME}</option>); })}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left">
                                            <input id='DESCRIPTION' name='DESCRIPTION' className='eidescription' value={itemDescription} onChange={handleChangeItemDescription}></input>
                                        </TableCell>
                                        <TableCell align="left">
                                            <input id='QTA' name='QTA' className='eiqta' value={itemQta} onChange={handleChangeItemQta}></input>
                                        </TableCell>
                                        <TableCell align="left">
                                            <input id='UPRICE' name='UPRICE' className='eiuprice' value={itemUPrice} onChange={handleChangeItemUPrice}></input>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p className='eiprice'> {price}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Select value={selVAT} onChange={handleChangeVAT} name='VATID' className='eselOptVAT' defaultValue={selVAT}>
                                                {vats.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.CODE}</option>); })}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={MItems.ttAddItems} aria-label="add">
                                                <AddCircleIcon size="large" color='primary' onClick={addItemToList} className='eAddItemToList' />
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>

                <div className={'showAddPS'}>
                    <Typography color="secondary" gutterBottom >
                        <div id='AddPSIcon' className={'eaddps1'}>
                            <Tooltip title={MItems.ttAddPSs} aria-label="add">
                                <KeyboardArrowRightIcon size="large" color='secondary' onClick={showAddPS}/>
                            </Tooltip>
                        </div>
                        <div id='AddPSIcon2' className={'eaddps2'}>
                            <Tooltip title={MItems.ttHidePSs} aria-label="add">
                                <KeyboardArrowDownIcon size="large" color='secondary' onClick={showAddPS}/>
                            </Tooltip>
                        </div>
                        {MItems.ps}
                    </Typography>
                </div>
                <div id='AddPSs' className={'eaddPSs'}>
                    <CardContent className='epssTable'>
                        <br></br>
                        <div style={{ height: 250, width: '100%' }}>
                            <DataGrid rows={psData} columns={psTableHead} 
                                density='compact' disableColumnMenu={true}
                                disableSelectionOnClick={true} rowsPerPageOptions={[]}
                                components={{ Footer: psDatagridFooterComponent, }}
                            />
                        </div>
                        <br></br>
                        <Divider light />
                    </CardContent>
                    <div className='eaddps'>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="Add PS">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="left">{MItems.professional}</TableCell>
                                    <TableCell align="left">{MItems.days}</TableCell>
                                    <TableCell align="left">{MItems.dailyRate}</TableCell>      
                                    <TableCell align="left">{MItems.price}</TableCell>
                                    <TableCell align="left">{MItems.vat}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="left">
                                            <Select value={selProfessional} onChange={handleChangePS} name='PROFESSIONAL' className='eselOptProf' defaultValue={selProfessional}>
                                                {professionals.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.NAME}</option>); })}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="left">
                                            <input id='PDAYS' name='PDAYS' className='eiqta' value={psDays} onChange={handleChangePSdays}></input>
                                        </TableCell>
                                        <TableCell align="left">
                                            <input id='DPRICE' name='DPRICE' className='eiuprice' value={professionalDPrice} onChange={handleChangePSDprice}></input>
                                        </TableCell>
                                        <TableCell align="left">
                                            <p className='eiprice'> {psPrice}</p>
                                        </TableCell>
                                        <TableCell align="left">
                                            <Select value={selPSvat} onChange={handleChangePSVAT} name='VATID' className='eselOptVAT' defaultValue={selPSvat}>
                                                {vats.map((e)=>{ return(<option value={e.ID} key={e.ID} >{e.CODE}</option>); })}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title={MItems.ttAddItems} aria-label="add">
                                                <AddCircleIcon size="large" color='primary' onClick={addPStoList} className='eAddItemToList' />
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>

                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <div className='esubmit'>
                        <br></br>
                            <Button variant="contained" color="secondary" onClick={insertRecord}>
                                <p>{MItems.save}</p>
                                <SendIcon />
                            </Button>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div className='ecancel'>
                        <br></br>
                            <Button variant="contained" color="secondary" onClick={cancel} >
                                <p>{MItems.cancel}</p>
                                <CancelIcon />
                            </Button>
                        </div>
                    </Grid>
                </Grid>

            </CardContent>
        </Card>

        <ConfirmInsertDialog open={open} fopen={setOpen}
            message={Messages.insertRecord}
            modified={modified}
            postData={postData}
            fstate={props.fstate}
            ferror={props.ferror}
            user={props.user}
            target='http://localhost:3001/insertNewEstimate'
            back='OpportunityDetails'
        />
        </div>
    );

    function insertRecord(event){
        event.preventDefault();
        var postData='CREATEDBY='+props.user[0].ID+'&OPPORTUNITYID='+props.estimateData.OPPORTUNITYID;
        postData += ('&CUSTOMERID='+props.estimateData.CUSTOMERID);
        if (props.estimateData.FINALCUSTOMERID !== null && props.estimateData.FINALCUSTOMERID !== undefined) postData += ('&FINALCUSTOMERID='+props.estimateData.FINALCUSTOMERID);
        if (selContact !== null && selContact !== undefined) postData += '&CONTACTID='+selContact;
        if (selAccount !== null && selAccount !== undefined) postData += '&ASSIGNEDTOID='+selAccount;
        if (selPM !== null && selPM !== undefined)           postData += '&PMID='+selPM;
        if (selBU !== null && selBU !== undefined)           postData += '&BUSINESSUNITID='+selBU;
        if (note.length > 0)   { postData += '&NOTE='+note; }

        if(itemsData.length > 0) postData = postData +'&ITEMS='+JSON.stringify(itemsData);
        if(psData.length > 0)    postData += '&PROFESSIONALSERVICES='+JSON.stringify(psData);
console.log('ITEMS',itemsData);
console.log('PS',psData);
        setPostData(postData);
        setModified(true);
        setOpen(true);
    }

}