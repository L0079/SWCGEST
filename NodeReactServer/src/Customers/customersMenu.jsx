import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import BusinessIcon from '@material-ui/icons/Business';
import PeopleIcon from '@material-ui/icons/People';

import resetStates from '../Utilities/resetStates';
import {GetTitles, GetMenusItems} from '../Utilities/getTitles';

export default function CustomersMenu(props) {
    const Titles = GetTitles();
    const MItems = GetMenusItems();

    return (
        <Accordion >
            <AccordionSummary aria-controls="panel1c-content">
                <div className='accordionTitle'>
                    <BusinessIcon size="large" />
                    <h3 > {Titles.customers} </h3>
                </div>
            </AccordionSummary>
            <AccordionDetails>
                <List dense={true}>
                    <ListItem button key='CUSTOMERS' onClick={()=>{ resetStates(props.fstate,'Customers'); }} >
                        <ListItemIcon>
                            <BusinessIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary={MItems.customers} />
                    </ListItem>
                    <ListItem button key='CONTACTS' onClick={()=>{ resetStates(props.fstate,'Contacts'); }} >
                        <ListItemIcon>
                            <PeopleIcon size="large" />
                        </ListItemIcon>
                        <ListItemText primary={MItems.contacts} />
                    </ListItem>
                </List>
            </AccordionDetails>
        </Accordion>
    );
}