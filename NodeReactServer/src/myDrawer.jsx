import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useStyles      from './StylesThemes/AppStyle';
import MenuItems      from './SWCGESTsetup/setupTables';

import CustomersMenu  from './Customers/customersMenu';
import OpportunitiesMenu  from './Opportunities/opportunitiesMenu';


export default function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle(){ setMobileOpen(!mobileOpen);};
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      {props.user[0].ROLE.toUpperCase() === 'ADMIN' ? <MenuItems fstate={props.fstate} ftable={props.ftable}/> : null}

      <CustomersMenu fstate={props.fstate} user={props.user}/>
      <OpportunitiesMenu fstate={props.fstate} user={props.user}/>
    </div>
  );
  const container = window !== undefined ? () =>  window().document.body : undefined;

  function tog(){
    props.fstate.map(o=>{ if (Object.keys(o)[0] === 'LogoutToggle') {Object.values(o)[0](!props.logoutToggle);}; return true;});
  }
  
  // var username = '';
  //let username = (props.user === undefined) ? username = 'Pippo' : props.user.NAME; //*------------------------------------------------------------------------

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar} >
        <div className='toolBarUser' >
          <Toolbar className='heading' >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              SWCGEST - Keep track of your business
            </Typography>
          </Toolbar>
          <div className='toolBarUserInfo' onClick={tog}>
                    <AccountCircleIcon size="large" color='inherit'/>
                    <span>{props.user[0].NAME}</span>

          </div>
        </div>
      </AppBar>
      <nav className={classes.drawer} aria-label="folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer 
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}