import Header from './Header.jsx'
import Footer from './Footer.jsx';
import {Helmet} from 'react-helmet';
import React from 'react'

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Helmet>
        <meta charSet='utf-8' />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <Header />
      <main className="flex-1  
      bg-purple-50">
      {/* dark:bg-linear-to-b from-blue-950/90 to-gray-900 bg-gray-100 "> */}
        {/* <Toaster /> */}
        {children}
      </main>
      <Footer/>
    </div>
  )
}

Layout.defaultProps = {
  title: "Kavin Madhusankha",
  description: "MERN stack project",
  keywords: "mern, react, node, mongodb",
  author: "Kavin Madhusankha"
}

export default Layout