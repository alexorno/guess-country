import Head from 'next/head';
import React from 'react';

const Layout = ({children}) => {
  return (
    <>
      <Head>
        <title>Country Quiz</title>
      </Head>
      <header>
        
      </header>
      <main>
          {children}
      </main>
    </>
  )
}

export default Layout