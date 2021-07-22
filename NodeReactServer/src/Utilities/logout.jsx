import React from 'react';
import List from '@material-ui/core/List';
import { Card, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

export default function Logout(props){
    function logOUT(){
        props.fuser([{'NAME':'','ROLE':''},'']);
        props.ftoggle(false);
        props.flogin(false);
    }
    return (
        <div className='logOut'>
        <Card>
        <List >
            <ListItem button onClick={logOUT} >
                <ListItemIcon>
                    <AccountCircleIcon size="large" />
                </ListItemIcon>
                <ListItemText primary='LOGOUT' className='logout'/>
            </ListItem>
        </List>
        </Card>
        </div>
    );
}