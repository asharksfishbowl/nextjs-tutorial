import Head from 'next/head'

// Import Material UI components
import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../components/ProTip';
import Link from '../components/Link';
import Copyright from '../components/Copyright';


// Mongo connection
import clientPromise from '../lib/mongodb'

export default function Home({ isConnected }) {

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Next.js example
                </Typography>
                {isConnected ? (
                    <h2 className="subtitle">You are connected to MongoDB</h2>
                ) : (
                    <h2 className="subtitle">
                        You are NOT connected to MongoDB. Check the <code>README.md</code>{' '}
                        for instructions.
                    </h2>
                )}
                <Link href="/about" color="secondary">
                    Go to the about page
                </Link>
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    );
}

export async function getServerSideProps(context) {
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    await clientPromise
    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
