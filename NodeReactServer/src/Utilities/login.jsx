import React from 'react';
import { Container, Paper, TextField } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import GetMessages from './getMessages';
import errorHandling from './errorHandling';

export default function login(props){
    const axios    = require('axios');
    const Messages = GetMessages();

    function checkCredential(event){
        event.preventDefault();
        let inputs = event.target.getElementsByTagName('input');    
        let postData=inputs[0].name+'='+inputs[0].value+'&'+inputs[1].name+'='+inputs[1].value;
        axios.post('http://localhost:3001/checkCred',postData)
            .then(res=>{
                props.fuser(res.data);
                props.flogin(true);
            })
            .catch(err=>{
                console.log("ERRROR");
                errorHandling(props, Messages.loginFailed);
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper className='LogIN'>
                <Avatar >
                    <LockOutlinedIcon />
                </Avatar>
                <h1 className='LogIN'>
                    SIGN IN
                </h1>
                <form  noValidate onSubmit={checkCredential}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="uname"
                    label="Username"
                    name="username"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="upwd"
                    autoComplete="current-password"
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className='LogIN'
                >
                    Sign In
                </Button>
                </form>
            </Paper>
        </Container>
    );
}