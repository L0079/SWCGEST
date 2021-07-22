import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
    fontFamily: 'Noto Serif, serif'
  },
  palette: {
    primary: {
      light: '#666666',
      main: '#3c3c3c',
      dark: '#666666',
      contrastText: '#fff',
    }
  },
  shape: {
    borderRadius: 8,
  },
  overrides: {
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: 'none',
      },
    },
    MuiDialog: {
        paper: {
            backgroundColor: '#3c3c3c',
            color: '#ffffff',
            minWidth: '680px',
            maxWidth: '2000px'
        }
    },
    MuiListItem: {
        root: {
            padding: '4px 16px',
        },
    },
    MuiListItemIcon: {
      root: {
        minWidth: '45px'
      }
    },
    MuiButton: {
      root: {
        minWidth: '130px',
        float: 'auto',
        margin: '8px 8px 8px 0'
      },
      label: {
        padding: '0',
        fontWeight: 'bold',
        margin: '0'
      },
    },
   MuiPaper: {
      rounded: {
        borderRadius: '6px 6px 0 0',
        marginRight: '12px',
        paddingTop: '8px'
     }
   },
   MuiCard: {
      root: {
        marginLeft: '10px',
        borderRadius: '0 0 8px 8px',
        marginBottom: '12px',
     }
   },
   MuiAccordion: {
      rounded: {
        marginLeft: '10px',
        borderRadius: '0 0 8px 8px',
        marginBottom: '12px'
     }
   },
   MuiGrid: {
      root: {
        width: 500,
        height: 150,
      }
   },
  },
  MuiTooltip: {
    tooltip: {
      fontSize: "0.8em",
      color: '#C51162',
      backgroundColor: "white",
      borderColor: '#C51162',
      border: "1px solid #C51162"
    }
  }
});

export default theme;