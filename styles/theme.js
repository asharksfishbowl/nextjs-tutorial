import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Create a theme instance.
let theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#3E323C',
        },
        secondary: {
            main: '#B8A6A5',
        },
    },
});

theme = responsiveFontSizes(theme);

// theme = createTheme(theme, {
//     palette: {
//         info: {
//             main: theme.palette.secondary.main,
//         },
//     },
// });

export default theme;