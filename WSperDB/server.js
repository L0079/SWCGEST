//import { Messages } from './messages.mjs';
//-----------------------------------------------------------------------------------------------------------------------------
const Messages={'provideFile':'Nessun file fornito o file nullo',
                'noFieldsMatch':'I campi forniti non corrispondono a quelli della tabella selezionata',
                'errorInserting':'Errore durante la fase di inserimento. La tabella potrebbe essere stata parzialmente caricata',
                'errDeleting':'Errore durante la cancellazione del record',
                'errInserting':'Errore nell\'inserimento del record',
                'recordLoaded':'Caricati ',
                'loginFailed':'Login fallita',
                'noData':'Dati assenti o insufficienti',
                'errAuth':'Errore, contattare l\'amministratore di sistema'
               };
//-----------------------------------------------------------------------------------------------------------------------------

const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const multer  = require('multer');
const mariadb = require('mariadb');
const upload  = multer();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
var cors  = require('cors');
const fs  = require('fs');
const jwt = require('jsonwebtoken');
const pk  = fs.readFileSync('/usr/local/cbrmt/key/cbrmt-selfsigned.key');
const crt = fs.readFileSync('/etc/ssl/certs/cbrmt-selfsigned.crt');
const verifyJWT = (rq,rs) => {
  try { let reqjwt = rq.headers['jwt']; jwt.verify(reqjwt, crt, { algorithm: 'RS256'}); }
  catch(err){rs.status(400).send(Messages.errAuth); throw(err);}
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));
app.use(cors(corsOptions));

const pool = mariadb.createPool({
     host: 'localhost',
     database: 'SWCGEST',
     user:'swcgest', 
     password: 'NetFlag01!',
     connectionLimit: 5
});


//--------------------------------------------- GET TABLE ------------------------------------------------------------------//
app.post('/getTable', (req, res) => {
  verifyJWT(req, res);
  const tableName = req.body.table;
  getTableElements();

  async function getTableElements() {
    let conn;
    var fields = [];
    var rows = [];

    try {
      conn = await pool.getConnection();
      let tfields = await conn.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '"+tableName+"';");
      let trows = await conn.query("select * from "+tableName+";");

      tfields.forEach((e)=>{
        if(
        e.COLUMN_NAME != 'CREATEDBY' && e.COLUMN_NAME != 'CREATEDAT' &&
           e.COLUMN_NAME != 'MODIFIEDBY' && e.COLUMN_NAME != 'MODIFIEDAT'
        ) fields.push(e);
      });
      trows.forEach((e)=>{
        delete e['CREATEDBY'];
        delete e['CREATEDAT'];
        delete e['MODIFIEDBY'];
        delete e['MODIFIEDAT'];
        rows.push(e);
      });
      const tableData={'fields': fields, 'data': rows};
      res.send(tableData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- GET FIELDS ------------------------------------------------------------------//
app.post('/getFields', (req, res) => {
  verifyJWT(req, res);
  const tableName = req.body.table;
  getFields();

  async function getFields() {
    let conn;
    try {
      conn = await pool.getConnection();
      let fields = await conn.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '"+tableName+"';");
      res.send(fields);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- MODIFY RECORD ---------------------------------------------------------------//
app.post('/modifyRecord', (req, res) => {
  verifyJWT(req, res);
  const tableName = req.body.table;
  const itemsNames  = Object.keys(req.body);
  const itemsValues = Object.values(req.body);

  const idName = itemsNames[1];
  const id     = itemsValues[1];
  var   data   = [];

  let sql = 'update '+tableName+' set '+itemsNames[2]+'=?';
  data.push(itemsValues[2]);
  for (i=3; i < itemsValues.length; i++){
    sql = sql+', '+itemsNames[i]+'=?';
    data.push(itemsValues[i]);
  }
  sql = sql+', MODIFIEDAT=NOW()';
  sql = sql+' where '+idName+'='+id;

  modifyRecord();

  async function modifyRecord() {
     let conn;
     try {
      conn = await pool.getConnection();
      let results = await conn.query(sql,data,(error) => {
        if (error){ return console.error(error.message);}
      });
      res.send(results);
     } 
     catch (err) { res.status(400).send(Messages.errModifing); throw err;  }
     if (conn) { conn.end(); }
  }
});

//--------------------------------------------- INSERT RECORD ---------------------------------------------------------------//
app.post('/insertRecord', (req, res) => {
  verifyJWT(req, res);
  const tableName = req.body.table;
  const fieldsNames = Object.keys(req.body);
  const fieldsValues = Object.values(req.body);
  fieldsNames.shift();
  fieldsValues.shift();

  insertRecord();

  async function insertRecord() {
    let conn;
    var sql='insert into '+tableName+' ('+fieldsNames[0];
    for(i=1; i<fieldsNames.length; i++){ sql = sql+', '+fieldsNames[i]; }
    sql=sql+', CREATEDAT) value(?';
    for(i=1; i<fieldsNames.length; i++){ sql = sql+', ?'; }
    sql += ', NOW())';

    var postData=[];
    for(i=0; i<fieldsValues.length; i++){ postData.push(fieldsValues[i]); }

    try {
      conn = await pool.getConnection();
      let result = await conn.query(sql, postData,(error) => { res.status(400).send(Messages.errInserting); });
      res.send(result);
    } catch (err) { res.status(400).send(Messages.errInserting); throw err; }

    if (conn) return conn.end();
  }
});

//--------------------------------------------- DELETE RECORD ---------------------------------------------------------------//
app.post('/deleteRecord', (req, res) => {
  verifyJWT(req, res);
  let sql = 'delete from '+req.body.table+' where '+req.body.idName+'=?';

  deleteRecord();

  async function deleteRecord() {
    let conn;
    try {
      conn = await pool.getConnection();
      let results = await conn.query(sql,req.body.idValue,(error) => {
        res.status(400).send(Messages.errDeleting);
      });
      res.send(results);
      if (conn) { conn.end(); }
    } 
    catch (err) { throw err;  }
  }

});

//--------------------------------------------- GET ITEMS TABLE ------------------------------------------------------------//
app.post('/getItemsTable', (req, res) => {
  verifyJWT(req, res);
  const tableName = req.body.table;
  getTableElements();

  async function getTableElements() {
    let conn;
    var fields = [];
    var rows = [];

    try {
      conn = await pool.getConnection();
      let rows = await conn.query("select ITEMS.ID, ITEMS.NAME, ITEMS.DESCRIPTION, ITEMS.PRICE, ITEMS.COST, UNITS.CODE from ITEMS, UNITS WHERE ITEMS.UNITID=UNITS.ID;");

      fields=[
        { 'COLUMN_NAME': 'ID'},
        { 'COLUMN_NAME': 'NAME'},
        { 'COLUMN_NAME': 'DESCRIPTION'},
        { 'COLUMN_NAME': 'PRICE'},
        { 'COLUMN_NAME': 'COST'},
        { 'COLUMN_NAME': 'UNITCODE'},
      ];
      const tableData={'fields': fields, 'data': rows};
      res.send(tableData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- CHECK CREDENTIAL ------------------------------------------------------------//
app.post('/checkCred', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  checkCredential();

  async function checkCredential() {
    let conn;
    try {
      conn = await pool.getConnection();
      let userData = await conn.query("SELECT USERS.ID, NAME, SURNAME, ROLE FROM USERS, ROLES WHERE USERNAME = '"+username
          +"' AND PASSWORD=AES_ENCRYPT('"+password+"',SHA2('StatRosaePristinaNomina',512)) AND USERS.ROLEID = ROLES.ID;");

      if (userData[0] === undefined || userData[0].ID === undefined) res.status(400).send(Messages.loginFailed);
      else {
        var token = jwt.sign({ 'usr': userData[0].USERNAME }, pk, { algorithm: 'RS256', expiresIn: 7200 });
        userData[1]=token;
        res.send(userData);
      }
    } 
    catch (err) { res.status(400).send(Messages.loginFailed); throw err; }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- GET COUNTRIES CODES ----------------------------------------------------------//
app.post('/getCountriesCodes', (req, res) => {
  verifyJWT(req, res);
  
  getCC();

  async function getCC() {
    let conn;
    var cc=[];
    try {
      conn = await pool.getConnection();
      let cc = await conn.query('select NAME, A2CODE from COUNTRIES ORDER BY NAME');
      res.send(cc);
    }
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- GET PARAMETERS ----.----------------------------------------------------------//
app.post('/getParameters', (req, res) => {
  verifyJWT(req, res);
  let sqlQuery = 'select * from '+req.body.table;

  getParmeters();

  async function getParmeters() {
    let conn;
    var parameters=[];
    try {
      conn = await pool.getConnection();
      let tparameters = await conn.query(sqlQuery);
      tparameters.forEach((e)=>{
        delete e['CREATEDBY'];
        delete e['CREATEDAT'];
        delete e['MODIFIEDBY'];
        delete e['MODIFIEDAT'];
        parameters.push(e);
      });
      res.send(parameters);
    }
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- INSERT NEW CUSTOMER ----------------------------------------------------------//
app.post('/insertNewCustomer', (req, res) => {
  verifyJWT(req, res);

  const fieldsNames = Object.keys(req.body);
  const fieldsValues = Object.values(req.body);
  var custArray=[];
  var custArrayVal=[];
  var premArray=[];
  var premArrayVal=[];

  insertRecord();

  async function insertRecord() {

    fieldsNames.forEach((e, idx)=>{
      if (e == 'CREATEDBY') { 
        custArray.push(e); custArrayVal.push(fieldsValues[idx]);
        premArray.push(e); premArrayVal.push(fieldsValues[idx]);
      } else {
          if (e !== 'PREMISE' && e !== 'STREET' && e !== 'CITY' && e !== 'ZIP' && e !== 'PROVINCE' && e !== 'TELEPHONE' && e !== 'COUNTRY' && e !== 'COUNTRYCODE') 
            { custArray.push(e); custArrayVal.push(fieldsValues[idx]);}
          else { premArray.push(e); premArrayVal.push(fieldsValues[idx]);}
      }
    });
    
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
      
      // Insert Customer
      var sql='INSERT INTO CUSTOMERS (';
      custArray.forEach((e)=>{sql=sql+e+', '; });
      sql=sql+' CREATEDAT) value(';
      custArray.forEach((e)=>{sql=sql+'?, '; });
      sql += ' NOW())';
      var custData=[];
      custArrayVal.forEach((v)=>{ custData.push(v); });

      let results = await conn.query(sql, custData);
      
      // Get Customer ID
      let custId = await conn.query('SELECT LAST_INSERT_ID() AS LASTID;');

      // Insert Premise
      sql='INSERT INTO PREMISES (';
      premArray.forEach((e)=>{sql=sql+e+', '; });
      sql=sql+' CUSTOMERID, CREATEDAT) value(';
      premArray.forEach((e)=>{sql=sql+'?, '; });
      sql += '?, NOW())';

      var premData=[];
      premArrayVal.forEach((v)=>{ premData.push(v); });
      premData.push(custId[0].LASTID);
      results = await conn.query(sql, premData);

      //Commit transaction
      await conn.commit();
      res.send(results);

    } catch (err) {
      await conn.rollback();
      res.status(400).send(Messages.errInserting); throw err; 
    }
    if (conn) return conn.end();
  }
});

//--------------------------------------------- GET CUSTOMERS ------------------------------------------------------------------//
app.post('/getCustomers', (req, res) => {
  verifyJWT(req, res);

  getCustomers();

  async function getCustomers() {
    let conn;
    var fields = [];
    var rows = [];

    try {
      conn = await pool.getConnection();
      
      let rows = await conn.query('SELECT \
        CUSTOMERS.ID AS id, NAME, WEB, GENERICEMAIL, VAT, SDINUM, PEC, INDUSTRY, MARKET \
        FROM CUSTOMERS, INDUSTRIES, MARKETS WHERE CUSTOMERS.INDUSTRYID=INDUSTRIES.ID \
        AND CUSTOMERS.MARKETID=MARKETS.ID;');
      // EMPLOYEESNUMBER
      // TURNOVER
      // TERRITORIES   ---   AND CUSTOMERS.TERRITORYID=TERRITORIES.ID
      // CREDITRATINGID
      // CATEGORYID
      //STATUSID
      //NOTES
      
      const tableData={'fields': fields, 'data': rows};
      res.send(tableData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});


//--------------------------------------------- GET CONTACTS ------------------------------------------------------------------//
app.post('/getContacts', (req, res) => {
  verifyJWT(req, res);

  getContacts();

  async function getContacts() {
    let conn;
    var fields = [];
    let sqlQuery='SELECT \
    CONTACTS.ID AS id, CUSTOMERS.NAME AS CUSTOMER, CONTACTS.NAME AS NAME, SURNAME, ROLE, EMAIL, MOBILE, CONTACTS.TELEPHONE, PREMISE \
    FROM CONTACTS, CUSTOMERS, PREMISES WHERE CONTACTS.CUSTOMERID=CUSTOMERS.ID \
    AND CONTACTS.PREMISEID = PREMISES.ID';
    let sqlQueryNoPrem='SELECT \
    CONTACTS.ID AS id, CUSTOMERS.NAME AS CUSTOMER, CONTACTS.NAME AS NAME, SURNAME, ROLE, EMAIL, MOBILE, CONTACTS.TELEPHONE \
    FROM CONTACTS, CUSTOMERS WHERE CONTACTS.CUSTOMERID=CUSTOMERS.ID';

    if (req.body.customerId != null && req.body.customerId != undefined) { 
      sqlQuery=sqlQuery+' AND CUSTOMERID='+req.body.customerId+';';
      sqlQueryNoPrem=sqlQueryNoPrem+' AND CUSTOMERID='+req.body.customerId+';';
    }
    else sqlQuery=sqlQuery+';';

    try {
      conn = await pool.getConnection();
      let rows = await conn.query(sqlQuery);
      const tableData={'fields': fields, 'data': rows};
      if (tableData.data.length > 0) {
        console.log(tableData);
        res.send(tableData);
      }
      else {
        let rowsNP = await conn.query(sqlQueryNoPrem);
        const tableDataNP={'fields': fields, 'data': rowsNP};
        res.send(tableDataNP);
      }
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- GET CUSTOMER DETAILS --------------------------------------------------------//
app.post('/getCustomerDetails', (req, res) => {
  verifyJWT(req, res);
  const custId = req.body.custId;

  getCustomers();

  async function getCustomers() {
    let conn;
    var fields = [];
    var rows = [];
    var custData = {};

    try {
      conn = await pool.getConnection();
      
      //Get Customer
      // CREDITRATINGID
      // CATEGORYID
      //STATUSID
      //NOTES
      let rows = await conn.query('SELECT \
        ID, NAME, WEB, GENERICEMAIL, VAT, SDINUM, PEC, INDUSTRYID, MARKETID, EMPLOYEESNUMBER, TURNOVER, TERRITORYID \
        FROM CUSTOMERS WHERE CUSTOMERS.ID='+custId+';');
      custData.customer=rows[0];

      //Get Premises
      let prems = await conn.query('SELECT \
        ID AS id, PREMISE, STREET, CITY, ZIP, PROVINCE, TELEPHONE, COUNTRY, COUNTRYCODE \
        FROM PREMISES WHERE CUSTOMERID='+custId+';');
      custData.premises=prems;

      //Get Contacts
      let conts = await conn.query('SELECT \
        CONTACTS.ID AS id, NAME, SURNAME, EMAIL, ROLE, CONTACTS.TELEPHONE, MOBILE, PREMISEID, PREMISE \
        FROM CONTACTS, PREMISES WHERE CONTACTS.CUSTOMERID='+custId+' AND CONTACTS.PREMISEID=PREMISES.ID;');
      if (conts.length > 0) { custData.contacts=conts; }
      else {
        let contsNP = await conn.query('SELECT CONTACTS.ID AS id, NAME, SURNAME, EMAIL, ROLE, CONTACTS.TELEPHONE, MOBILE \
                                        FROM CONTACTS WHERE CONTACTS.CUSTOMERID='+custId);
        custData.contacts=contsNP;
      }

      res.send(custData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- GET CONTACTS MIN INFOS ------------------------------------------------------//
app.post('/getContactsNames', (req, res) => {
  verifyJWT(req, res);

  getContactsNames();

  async function getContactsNames() {
    let conn;
    var fields = [];
    var rows = [];
    var custData = {};

    try {
      conn = await pool.getConnection();
      let sqlQuery='SELECT ID, NAME, SURNAME, CUSTOMERID FROM CONTACTS';
      if (req.body.customerId != null && req.body.customerId != undefined) sqlQuery=sqlQuery+' WHERE CUSTOMERID='+req.body.customerId+';';
      else sqlQuery=sqlQuery+';';

      let rows = await conn.query(sqlQuery);
//      custData.contacts=rows[0];

      res.send(rows);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});


//--------------------------------------------- GET ACCOUNTS AND PMS --------------------------------------------------------//
app.post('/getAccountsPMs', (req, res) => {
  verifyJWT(req, res);

  getContactsNames();

  async function getContactsNames() {
    let conn;
    var fields = [];
    var rows = [];
    var custData = {};

    try {
      conn = await pool.getConnection();
      
      let rows = await conn.query('SELECT USERS.ID, NAME, SURNAME FROM USERS, ROLES WHERE ROLEID=ROLES.ID AND (ROLE=\'SA\' OR ROLE=\'TAM\' OR ROLE=\'GM\');');
      custData.account=rows;
      rows = await conn.query('SELECT USERS.ID, NAME, SURNAME FROM USERS, ROLES WHERE ROLEID=ROLES.ID AND (ROLE=\'TAM\' OR ROLE=\'PM\' OR ROLE=\'SC\');');
      custData.pm=rows;
      
      res.send(custData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});

//--------------------------------------------- INSERT OPPORTUNITY ---------------------------------------------------------------//
app.post('/insertOpportunity', (req, res) => {
  verifyJWT(req, res);
  const fieldsNames = Object.keys(req.body);
  const fieldsValues = Object.values(req.body);

  insertOpportunity();

  async function insertOpportunity() {

    if (fieldsNames.indexOf('AMOUNT') != -1){
      if(fieldsNames.indexOf('FCST1Y') == -1 && fieldsNames.indexOf('FCST2Y') == -1 && fieldsNames.indexOf('FCST3Y') == -1 ) {
        fieldsNames.push('FCST1Y');
        fieldsValues.push(fieldsValues[fieldsNames.indexOf('AMOUNT')]);
      }
      if(fieldsNames.indexOf('FCST1Y') != -1 && fieldsNames.indexOf('FCST2Y') == -1 && fieldsNames.indexOf('FCST3Y') == -1 ) {
        let diff = fieldsValues[fieldsNames.indexOf('AMOUNT')] - fieldsValues[fieldsNames.indexOf('FCST1Y')];
        if (diff > 0) {
          fieldsNames.push('FCST2Y');
          fieldsValues.push(diff);
        }
      }
      if(fieldsNames.indexOf('FCST1Y') != -1 && fieldsNames.indexOf('FCST2Y') != -1) {
        let diff = fieldsValues[fieldsNames.indexOf('AMOUNT')] - fieldsValues[fieldsNames.indexOf('FCST1Y')] - fieldsValues[fieldsNames.indexOf('FCST2Y')];
        if (diff > 0) {
          fieldsNames.push('FCST3Y');
          fieldsValues.push(diff);
        }
      }
    }

    let conn;
    var sql='insert into OPPORTUNITIES ('+fieldsNames[0];
    for(i=1; i<fieldsNames.length; i++){ sql = sql+', '+fieldsNames[i]; }
    sql=sql+', CREATEDAT) value(?';
    for(i=1; i<fieldsNames.length; i++){ sql = sql+', ?'; }
    sql += ', NOW())';

    var postData=[];
    for(i=0; i<fieldsValues.length; i++){ postData.push(fieldsValues[i]); }

    try {
      conn = await pool.getConnection();
      let results = await conn.query(sql, postData,(error) => {
        res.status(400).send(Messages.errInserting);
      });
      res.send(results);
    } catch (err) { res.status(400).send(Messages.errInserting); throw err; }
    if (conn) return conn.end();
  }
});

//--------------------------------------------- GET OPPORTUNITIES -----------------------------------------------------------//
app.post('/getOpportunities', (req, res) => {
  verifyJWT(req, res);
  const dateFormat = req.body.DATEFORMAT;

  getOpportunities();

  async function getOpportunities() {
    let conn;
    var fields = [];
    var rows = [];

    try {
      conn = await pool.getConnection();
      
      let rows = await conn.query('SELECT \
        OPPORTUNITIES.ID AS id,OPPORTUNITIES.NAME, CUSTOMERS.NAME AS CUSTOMER, AMOUNT, WINPROBABILITIES.CODE AS WINPROB, \
        DATE_FORMAT(CLOSEDATE,"'+dateFormat+'") AS CLOSEDATE \
        FROM OPPORTUNITIES, CUSTOMERS, WINPROBABILITIES WHERE CUSTOMERID=CUSTOMERS.ID \
        AND WINPROBABILITYID=WINPROBABILITIES.ID;');
      
      const tableData={'fields': fields, 'data': rows};
      res.send(tableData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});


//--------------------------------------------- GET OPPORTUNITY DETAILS -----------------------------------------------------//
app.post('/getOpportunityDetails', (req, res) => {
  verifyJWT(req, res);
  const oppId = req.body.oppId;

  getOpportunity();

  async function getOpportunity() {
    let conn;

    try {
      conn = await pool.getConnection();
      
      let rows = await conn.query('SELECT \
        * \
        FROM OPPORTUNITIES WHERE OPPORTUNITIES.ID='+oppId+';');
      let oppData=rows[0];

      res.send(oppData);
    } 
    catch (err) { throw err;  }
    if (conn) { conn.end(); }
  }
});


//--------------------------------------------- UPDATE OPPORTUNITY ----------------------------------------------------------//
app.post('/updateOpportunity', (req, res) => {
  verifyJWT(req, res);

  let oppId=req.body.ID;
  const {ID, ...postData} = req.body;
  const fieldsNames = Object.keys(postData);
  const fieldsValues = Object.values(postData);

  updateOpportunity();

  async function updateOpportunity() {

    if (fieldsNames.indexOf('AMOUNT') != -1){
      if(fieldsNames.indexOf('FCST1Y') == -1 && fieldsNames.indexOf('FCST2Y') == -1 && fieldsNames.indexOf('FCST3Y') == -1 ) {
        fieldsNames.push('FCST1Y');
        fieldsValues.push(fieldsValues[fieldsNames.indexOf('AMOUNT')]);
      }
      if(fieldsNames.indexOf('FCST1Y') != -1 && fieldsNames.indexOf('FCST2Y') == -1 && fieldsNames.indexOf('FCST3Y') == -1 ) {
        let diff = fieldsValues[fieldsNames.indexOf('AMOUNT')] - fieldsValues[fieldsNames.indexOf('FCST1Y')];
        if (diff > 0) {
          fieldsNames.push('FCST2Y');
          fieldsValues.push(diff);
        }
      }
      if(fieldsNames.indexOf('FCST1Y') != -1 && fieldsNames.indexOf('FCST2Y') != -1) {
        let diff = fieldsValues[fieldsNames.indexOf('AMOUNT')] - fieldsValues[fieldsNames.indexOf('FCST1Y')] - fieldsValues[fieldsNames.indexOf('FCST2Y')];
        if (diff > 0) {
          fieldsNames.push('FCST3Y');
          fieldsValues.push(diff);
        }
      }
    }

    let conn;
    var sqlData = [];
    let sql = 'update OPPORTUNITIES set '+fieldsNames[0]+'=?';
    sqlData.push(fieldsValues[0]);
    for (i=1; i < fieldsValues.length; i++){
      sql = sql+', '+fieldsNames[i]+'=?';
      sqlData.push(fieldsValues[i]);
    }
    sql = sql+', MODIFIEDAT=NOW()';
    sql = sql+' where ID='+oppId;

    try {
      conn = await pool.getConnection();
      let results = await conn.query(sql, sqlData,(error) => {
        res.status(400).send(Messages.errInserting);
      });
      res.send(results);
    } catch (err) { res.status(400).send(Messages.errInserting); throw err; }
    if (conn) return conn.end();
  }
});


//--------------------------------------------- INSERT NEW ESTIMATE ----------------------------------------------------------//
app.post('/insertNewEstimate', (req, res) => {
  verifyJWT(req, res);

  console.log(req.body);

  const fieldsNames = Object.keys(req.body);
  const fieldsValues = Object.values(req.body);

  insertRecord();

  async function insertRecord() {
    let conn;
    var sqlData = [];
    var itemsData=[];
    var psData=[];
    let userId=fieldsValues[fieldsNames.indexOf('CREATEDBY')];
    let oppId=fieldsValues[fieldsNames.indexOf('OPPORTUNITYID')];

    let sql = 'INSERT INTO ESTIMATES (CREATEDBY, CREATEDAT, OPPORTUNITYID, CUSTOMERID ';
    let sqlv = ' VALUES (?, NOW(), ?, ? ';
    sqlData.push(userId);
    sqlData.push(oppId);
    sqlData.push(fieldsValues[fieldsNames.indexOf('CUSTOMERID')]);

    if (fieldsNames.indexOf('FINALCUSTOMERID') != -1){
      sql += ', FINALCUSTOMERID';
      sqlv += ', ?';
      sqlData.push(fieldsValues[fieldsNames.indexOf('FINALCUSTOMERID')]);
    }
    if (fieldsNames.indexOf('CONTACTID') != -1){
      sql += ', CONTACTID';
      sqlv += ', ?';
      sqlData.push(fieldsValues[fieldsNames.indexOf('CONTACTID')]);
    }
    if (fieldsNames.indexOf('ASSIGNEDTOID') != -1){
      sql += ', ASSIGNEDTOID';
      sqlv += ', ?';
      sqlData.push(fieldsValues[fieldsNames.indexOf('ASSIGNEDTOID')]);
    }
    if (fieldsNames.indexOf('PMID') != -1){
      sql += ', PMID';
      sqlv += ', ?';
      sqlData.push(fieldsValues[fieldsNames.indexOf('PMID')]);
    }
    if (fieldsNames.indexOf('BUSINESSUNITID') != -1){
      sql += ', BUSINESSUNITID';
      sqlv += ', ?';
      sqlData.push(fieldsValues[fieldsNames.indexOf('BUSINESSUNITID')]);
    }
    if (fieldsNames.indexOf('NOTE') != -1){
      sql += ', NOTE';
      sqlv += ', ?';
      sqlData.push(fieldsValues[fieldsNames.indexOf('NOTE')]);
    }
    sql = sql+')'+sqlv+');';

    if (fieldsNames.indexOf('ITEMS') != -1)                { itemsData=JSON.parse(fieldsValues[fieldsNames.indexOf('ITEMS')]); }
    if (fieldsNames.indexOf('PROFESSIONALSERVICES') != -1) { psData=JSON.parse(fieldsValues[fieldsNames.indexOf('PROFESSIONALSERVICES')]); }

    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();

      let results = await conn.query(sql, sqlData);
      // Get Estimate ID
      let lastId = await conn.query('SELECT LAST_INSERT_ID() AS LASTID;');
      let estimateId = lastId[0].LASTID;

// INSERT ITEMS
      for(let i=0; i < itemsData.length; i++) {
        sql='INSERT INTO ESTIMATEITEMS (ESTIMATEID, ITEMID, NAME, DESCRIPTION, UNITS, UNITID, UNITPRICE, UNITCOST, VAT, PRICE, COST, AMOUNT, CREATEDBY, CREATEDAT) \
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() );';
        sqlData=[];
        sqlData.push(estimateId);
        sqlData.push(itemsData[i].ITEMID);
        sqlData.push(itemsData[i].NAME);
        sqlData.push(itemsData[i].DESCRIPTION);
        sqlData.push(itemsData[i].UNITS);
        sqlData.push(itemsData[i].UNITID);
        sqlData.push(itemsData[i].UNITPRICE);
        sqlData.push(itemsData[i].UNITCOST);
        sqlData.push(itemsData[i].VAT);
        sqlData.push(itemsData[i].PRICE);
        sqlData.push(itemsData[i].COST);
        sqlData.push(itemsData[i].AMOUNT);
        sqlData.push(userId);
        results = await conn.query(sql, sqlData);
      }

      for(let j=0; j < psData.length; j++) {
        sql='INSERT INTO ESTIMATEPS (ESTIMATEID, PROFESSIONALID, CODE, NAME, DAYS, DAILYRATE, DAILYCOST, VAT, PRICE, COST, AMOUNT, CREATEDBY, CREATEDAT) \
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW() );';
        sqlData=[];
        sqlData.push(estimateId);
        sqlData.push(psData[j].PROFESSIONALID);
        sqlData.push(psData[j].CODE);
        sqlData.push(psData[j].NAME);
        sqlData.push(psData[j].DAYS);
        sqlData.push(psData[j].DAILYRATE);
        sqlData.push(psData[j].DAILYCOST);
        sqlData.push(psData[j].VAT);
        sqlData.push(psData[j].PRICE);
        sqlData.push(psData[j].COST);
        sqlData.push(psData[j].AMOUNT);
        sqlData.push(userId);
        results = await conn.query(sql, sqlData);
      }
//Aggiornare estimate con relativi id __NO__
      //UPDATE OPPORTUNITY WITH ESTIMATEID
      sql='UPDATE OPPORTUNITIES SET ESTIMATEID=? WHERE ID='+oppId+';';
      sqlData=[];
      sqlData.push(estimateId);
      results = await conn.query(sql, sqlData);

      //Commit transaction
      await conn.commit();
      res.send(results);
    } catch (err) {
      await conn.rollback();
      res.status(400).send(Messages.errInserting); throw err; 
    }
    if (conn) return conn.end();



  }


});


//---------------------------------------------------------------------------------------------------------------------------//

// to run 2 separate servers (one for React FE and one for DB Services)
app.listen(3001, function(){console.log("server listening on port 3001!")});

// to run all the services on the same node express server
/*----------------------------------------------------*
var https   = require('https')
var http    = require('http')

const path  = require('path');
const options = {
  key: pk,
  cert: crt
};

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) { res.sendFile(path.join(__dirname, 'build', 'index.html')); });

http.createServer(app).listen(3001)
https.createServer(options, app).listen(3000)
/*----------------------------------------------------*/