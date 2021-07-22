import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function BaseHP(){
    return (
    <div id="insideContent">
              <h1 className='appName'>SWCGEST</h1>
              <LinearProgress color="secondary"/>
    </div>
    );
}