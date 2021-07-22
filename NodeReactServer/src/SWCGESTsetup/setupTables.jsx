import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TableChartIcon from '@material-ui/icons/TableChart';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

//import tables from './tables';
import resetStates from '../Utilities/resetStates';
import {GetTitles} from '../Utilities/getTitles';

export default function MenuItems(props) {
    const Titles = GetTitles();
    function getTbl(tbl){
        resetStates(props.fstate,'GetTable'); props.ftable(tbl);
    }
    function getItemsTbl(tbl){
        resetStates(props.fstate,'GetItemsTable'); props.ftable(tbl);
    }

    return (
        <Accordion >
            <AccordionSummary aria-controls="panel1c-content">
                <div className='accordionTitle'>
                    <TableChartIcon size="large" />
                    <h3 > {Titles.setup} </h3>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <List dense={true}>
                    <ListItem button key='PREFIXES' onClick={()=>{getTbl('PREFIXES')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="   PREFIXES" />
                    </ListItem>
                    <ListItem button key='UNITS' onClick={()=>{getTbl('UNITS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="   UNITS" />
                    </ListItem>
                    <ListItem button key='ITEMS' onClick={()=>{getItemsTbl('ITEMS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="   ITEMS" />
                    </ListItem>
                    <ListItem button key='PROFESSIONALS' onClick={()=>{getTbl('PROFESSIONALS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="   PROFESSIONALS" />
                    </ListItem>
                    <ListItem button key='TAG' onClick={()=>{getTbl('TAGS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="   TAGS" />
                    </ListItem>
                    <ListItem button key='INDUSTRIES' onClick={()=>{getTbl('INDUSTRIES')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="INDUSTRIES" />
                    </ListItem>
                    <ListItem button key='MARKETS' onClick={()=>{getTbl('MARKETS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="MARKETS" />
                    </ListItem>
                    <ListItem button key='TERRITORIES' onClick={()=>{getTbl('TERRITORIES')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="TERRITORIES" />
                    </ListItem>
                    <ListItem button key='WINPROBABILITIES' onClick={()=>{getTbl('WINPROBABILITIES')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="WIN PROBABILITIES" />
                    </ListItem>
                    <ListItem button key='BUSINESSUNITS' onClick={()=>{getTbl('BUSINESSUNITS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="BUSINESS UNITS" />
                    </ListItem>

                    <ListItem button key='VATS' onClick={()=>{getTbl('VATS')}} >
                        <ListItemIcon>
                            <TableChartIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary="VAT VALUES" />
                    </ListItem>

                </List>
            </AccordionDetails>
        </Accordion>
    );
}