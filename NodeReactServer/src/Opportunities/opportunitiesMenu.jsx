import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import FilterCenterFocusIcon from '@material-ui/icons/FilterCenterFocus';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';

import resetStates from '../Utilities/resetStates';
import {GetTitles} from '../Utilities/getTitles';
//import {GetMenusItems} from '../Utilities/getTitles';

export default function OpportunitiesMenu(props) {
    const Titles = GetTitles();
//    const MItems = GetMenusItems();

    return (
        <Accordion >
            <AccordionSummary aria-controls="panel1c-content">
                <div className='accordionTitle'>
                    <MonetizationOnIcon size="large" />
                    <h3 > {Titles.opportunities} </h3>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <List dense={true}>
                    <ListItem button key='ADDOPPORTUNITY' onClick={()=>{ resetStates(props.fstate,'AddOpportunity'); }} >
                        <ListItemIcon>
                            <FilterCenterFocusIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary={Titles.addOpportunity} />
                    </ListItem>
                    <ListItem button key='OPPORTUNITIES' onClick={()=>{ resetStates(props.fstate,'Opportunities'); }} >
                        <ListItemIcon>
                            <MonetizationOnIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary={Titles.opportunities} />
                    </ListItem>

                </List>
            </AccordionDetails>
        </Accordion>
    );
}