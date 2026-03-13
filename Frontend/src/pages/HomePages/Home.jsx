import React from 'react'
import Layout from '../../layouts/Layout.jsx';
import HomeImage from './HomeImage.jsx';
import Amenities from './Amenities.jsx';
import Ratings from './Ratings.jsx'

const Home = () => {
  return (
    <Layout>
        <HomeImage />
        <Amenities />
        <Ratings />
    </Layout>
  )
}

export default Home