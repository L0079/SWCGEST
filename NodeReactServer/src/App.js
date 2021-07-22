import React,{ useState }     from 'react';
import { ThemeProvider        as MuiThemeProvider } from '@material-ui/core/styles';
import useStyles              from './StylesThemes/AppStyle';
import muiTheme               from './StylesThemes/muiTheme';

import BaseHP                 from './baseHP';
import ResponsiveDrawer       from './myDrawer';
import GetTable               from './SWCGESTsetup/getTable';
import AddRecord              from './SWCGESTsetup/addRecord';
import GetItemsTable          from './SWCGESTsetup/getItemsTable';
import AddItem                from './SWCGESTsetup/addItem';
import AddCustomer            from './Customers/addCustomer';
import GetCustomers           from './Customers/getCustomers';
import AddContact             from './Customers/addContact';
import GetContacts            from './Customers/getContacts';
import GetCustomerDetails     from './Customers/getCustomerDetails';
import AddOpportunity         from './Opportunities/addOpportunity';
import GetOpportunities       from './Opportunities/getOpportunities';
import GetOpportunityDetails  from './Opportunities/getOpportunityDetails';
import AddEstimate            from './Estimates/addEstimate';

import ErrorDialog            from './Utilities/errorDialog';
import Messages               from './Utilities/messages';
import Login                  from './Utilities/login';
import Logout                 from './Utilities/logout';

export default function App() {
  const classes = useStyles();
  const stateArray=[];
  const [logoutToggle, setLogoutToggle]=useState(false);
  const [stateLogged, setstateLogged]=useState(false);  //--------------------------------------------------------
  const [stateGetTable, setStateGetTable]=useState(false);
  const [stateGetItemsTable, setStateGetItemsTable]=useState(false);
  const [stateAddRecord, setStateAddRecord]=useState(false);
  const [stateAddItem, setStateAddItem]=useState(false);
  const [stateError, setStateError]=useState(false);
  const [stateNewCustomer, setStateNewCustomer]=useState(false);
  const [stateCustomers, setStateCustomers]=useState(false);
  const [stateNewContact, setStateNewContact]=useState(false);
  const [stateContacts, setStateContacts]=useState(false);
  const [stateCustomerDetails, setStateCustomerDetails]=useState(false);
  const [stateNewOpportunity, setStateNewOpportunity]=useState(false);
  const [stateOpportunities, setStateOpportunities]=useState(false);
  const [stateOpportunityDetails, setStateOpportunityDetails]=useState(false);
  const [stateNewEstimate, setStateNewEstimate]=useState(false);
  stateArray.push({'LogoutToggle': setLogoutToggle});
  stateArray.push({'GetTable': setStateGetTable});
  stateArray.push({'AddRecord': setStateAddRecord});
  stateArray.push({'GetItemsTable': setStateGetItemsTable});
  stateArray.push({'AddItem': setStateAddItem});
  stateArray.push({'ErrorDialog': setStateError});
  stateArray.push({'AddCustomer': setStateNewCustomer});
  stateArray.push({'Customers': setStateCustomers});
  stateArray.push({'AddContact': setStateNewContact});
  stateArray.push({'Contacts': setStateContacts});
  stateArray.push({'CustomerDetails': setStateCustomerDetails});
  stateArray.push({'AddOpportunity': setStateNewOpportunity});
  stateArray.push({'Opportunities': setStateOpportunities});
  stateArray.push({'OpportunityDetails': setStateOpportunityDetails});
  stateArray.push({'AddEstimate': setStateNewEstimate});
  const [table, setTable]=useState('');
  const [errorMsg, setErrorMsg]=useState({'type':'ERROR', 'alert':Messages.error, 'message':Messages.errorHandling, 'message2':''});
  const [user, setUser]=useState();
  const [customerId, setCustomerId]=useState();
  const [back, setBack]=useState('');
  const [opportunityId, setOpportunityId]=useState();
  const [estimateData, setEstimateData]=useState();

  return(
    <div className={classes.root}>
      {stateLogged ?
        <MuiThemeProvider theme={muiTheme}>
          <ResponsiveDrawer fstate={stateArray} ftable={setTable} user={user} fuser={setUser} flogin={setstateLogged} logoutToggle={logoutToggle}/>
          <main className={classes.content} >
            {stateGetTable ? <GetTable table={table} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateAddRecord ? <AddRecord table={table} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateGetItemsTable ? <GetItemsTable table={table} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateAddItem ? <AddItem table={table} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateNewCustomer ? <AddCustomer fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateCustomers ? <GetCustomers setCustomerId={setCustomerId} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateNewContact ? <AddContact fstate={stateArray} ferror={setErrorMsg} user={user} previous={back}/> : null}
            {stateContacts ? <GetContacts fstate={stateArray} ferror={setErrorMsg} user={user} setcurrent={setBack}/> : null}
            {stateCustomerDetails ? <GetCustomerDetails customerId={customerId} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateNewOpportunity ? <AddOpportunity fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateOpportunities ? <GetOpportunities setOpportunityId={setOpportunityId} fstate={stateArray} ferror={setErrorMsg} user={user}/> : null}
            {stateOpportunityDetails ? <GetOpportunityDetails opportunityId={opportunityId} fstate={stateArray} ferror={setErrorMsg} user={user} setEstimateData={setEstimateData}/> : null}

            {stateNewEstimate ? <AddEstimate fstate={stateArray} ferror={setErrorMsg} user={user} previous={back} estimateData={estimateData} /> : null}

            {!(stateGetTable||stateAddRecord||stateGetItemsTable||stateAddItem||stateNewCustomer||stateCustomers||stateNewContact||stateContacts|| 
              stateCustomerDetails||stateNewOpportunity||stateOpportunities||stateOpportunityDetails||stateNewEstimate) ? <BaseHP /> : null}
          </main>
          <ErrorDialog open={stateError} fopen={setStateError} 
            message={errorMsg}
            fstate={stateArray}
          />
          {logoutToggle ? <Logout flogin={setstateLogged} fuser={setUser} user={user} ftoggle={setLogoutToggle}/> : null}
        </MuiThemeProvider>
      :
        <MuiThemeProvider theme={muiTheme}>
          <Login 
            flogin={setstateLogged}
            fuser={setUser}
            fstate={stateArray} 
            ferror={setErrorMsg}
          />
          <ErrorDialog open={stateError} fopen={setStateError} 
            message={errorMsg}
            fstate={stateArray}
          />

        </MuiThemeProvider>
    }
  </div>
  );
}