import {createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    palette: {
        primary: {
            main: '#7986CB',
            light: '#AAB6FE', 
            dark: '#49599A', 
            constrastText: '#ffffff' 
        }, 
        secondary: {
            main: '#4db6ac', 
            light: '#82e9de', 
            dark: '#00867d', 
            contrastText: "#fff", 
        }, 
    }, 
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#e1e2e1', 
                },
            },
        },
    }, 
}); 

theme = responsiveFontSizes(theme); 
export default theme; 