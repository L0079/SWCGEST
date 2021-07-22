//import React from 'react';

export default function resetStates(props, comp){
    props.map(o=>{
        const freset=Object.values(o)[0];
        freset(false);
        return true;
    });
    props.map(o=>{ if (Object.keys(o)[0] === comp) {Object.values(o)[0](true);}; return true;});
}