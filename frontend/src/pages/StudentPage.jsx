import React from 'react'
import StudentMarketplace from '../components/StudentMarketplace'
import ShopByCategory from '../components/ShopByCategory'
import FeaturedItems from '../components/FeaturedItems'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
function StudentPage() {
  return (
	<div>
    <Navbar/>
    <StudentMarketplace />
    <ShopByCategory />
    <FeaturedItems />
    <Footer />
  </div>
  )
}

export default StudentPage