import React from 'react'
import HeroSection from '../components/HeroSection'
import CategoriesSection from '../components/CategoriesSection'
import LatestItems from '../components/LatestItems'
import Footer from '../components/Footer'


function LandingPage() {
  return (
	<div className='flex flex-1 flex-col w-full h-screen'>
<HeroSection/>
<CategoriesSection/>
<LatestItems/>
<Footer/>
	</div>
  )
}

export default LandingPage