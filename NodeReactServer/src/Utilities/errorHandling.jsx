import GetMessages from './getMessages';

const errorHandling = (prps, e1, e2)=>{
    const Messages = GetMessages();
    let errMsg = {'type':'ERROR', 'alert':Messages.error, 'message':Messages.errorHandling, 'message2':e1};
    if (e2 !== undefined && e2.length > 0) { errMsg.message = e1; errMsg.message2 = e2; }
    prps.ferror(errMsg);
    prps.fstate.map(o=>{ if (Object.keys(o)[0] === 'ErrorDialog') {Object.values(o)[0](true);}; return true;});
};

export default errorHandling;