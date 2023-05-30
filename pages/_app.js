import React from 'react';
import Layout from '../components/Layout';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';


function App({ Component, pageProps }) {
  return (
    <>
      <Toaster />
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </>
  )
}

export default App