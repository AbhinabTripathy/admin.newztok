import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: { fontFamily: 'Poppins' },
    h2: { fontFamily: 'Poppins' },
    h3: { fontFamily: 'Poppins' },
    h4: { fontFamily: 'Poppins' },
    h5: { fontFamily: 'Poppins' },
    h6: { fontFamily: 'Poppins' },
    subtitle1: { fontFamily: 'Poppins' },
    subtitle2: { fontFamily: 'Poppins' },
    body1: { fontFamily: 'Poppins' },
    body2: { fontFamily: 'Poppins' },
    button: { fontFamily: 'Poppins' },
    caption: { fontFamily: 'Poppins' },
    overline: { fontFamily: 'Poppins' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Poppins';
          font-style: normal;
          font-display: swap;
          font-weight: 300;
          src: url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        }
      `,
    },
  },
});

export default theme; 