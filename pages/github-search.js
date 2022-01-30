import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Typography from "@mui/material/Typography";
// import { Octokit, App } from "octokit";
// import { createTokenAuth } from "@octokit/auth-token"
import theme from '../styles/theme';

const { Octokit } = require("@octokit/core");
// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
// TODO:: make this an environment variable
const octokit = new Octokit({ auth: `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` });

// Custom Components
import Copyright from '../components/Copyright';
import GithubDataTable from '../components/GithubDataTable';


const initialFormData = Object.freeze({
    username: ""
});

export default function GithubSearch() {
    const [loading, setLoading] = React.useState(false);
    const [formData, updateFormData] = React.useState(initialFormData);
    const [rows, updateDataTable] = React.useState([]);
    const [query, setQuery] = React.useState('idle');
    const timerRef = React.useRef();

    React.useEffect(
        () => () => {
            clearTimeout(timerRef.current);
        },
        [],
    );

    const handleChange = (event) => {
        updateFormData({
            ...formData,
            // Trimming any whitespace
            [event.target.name]: event.target.value.trim()
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (query !== 'idle') {
            setQuery('idle');
        }
        if (formData) {
            let rows = [];
            let username = formData.username;
            if (username) {
                setQuery('progress');
                const resp = await octokit.request('GET /search/users', {
                    q: username,
                    per_page: 100
                });
                // I feel like there is a faster way of doing this, like jq filtering TODO:: Improve performance here
                if (resp.data.items.length >= 1) {
                    for (let i = 0; i < resp.data.items.length; i++) {
                        const user = await octokit.request('GET /users/{username}', {
                            username: resp.data.items[i].login
                        });

                        let stars = 0;
                        const repos = await fetch(resp.data.items[i].repos_url);
                        if (Array.isArray(repos)){
                            stars = repos.reduce(function(sum, current) {
                                return sum + current.stargazers_count;
                            }, 0);
                        }

                        user.data.stars = stars;

                        rows.push(user.data)
                    }
                    updateDataTable(rows);
                    setQuery('success');
                }
                else {
                    setQuery('success');
                }
            }
            else {
                // TODO:: Make this an error on the text field with red color
                alert('Please Enter a Username to Search By')
            }

        } else {
            console.log('No Formdata found');
        }

        // eslint-disable-next-line no-console

    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 25,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ height: 40 }}>
                        {query === 'success' ? (
                            <Typography>Success!</Typography>
                        ) : (
                            <Fade
                                in={query === 'progress'}
                                style={{
                                    transitionDelay: query === 'progress' ? '800ms' : '0ms',
                                }}
                                unmountOnExit
                            >
                                <Box sx={{ width: '100%' }}>
                                    <CircularProgress color="secondary" />
                                </Box>
                            </Fade>
                        )}
                    </Box>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{width:'75%'}}>
                        <Grid container spacing={1} padding={1}>
                            <Grid item lg>
                                <TextField
                                    name="username"
                                    label="Search Github by Username"
                                    autoFocus
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="medium"
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <GithubDataTable rows={rows}/>
                <Copyright />
            </Container>
        </ThemeProvider>
    );
}