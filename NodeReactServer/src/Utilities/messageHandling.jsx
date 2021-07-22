import GetMessages from './getMessages';

const messageHandling = (prps, e1, e2)=>{
    const Messages = GetMessages();
    let errMsg = {'type':'ALERT', 'alert':Messages.alert, 'message':e1, 'message2':''};
    if (e2 !== undefined && e2.length > 0) errMsg.message2 = e2;
    prps.ferror(errMsg);
    prps.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
};

export default messageHandling;