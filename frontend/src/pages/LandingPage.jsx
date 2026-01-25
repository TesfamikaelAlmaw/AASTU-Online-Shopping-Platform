import React from 'react'
import HeroSection from '../components/HeroSection'
import LatestItems from '../components/LatestItems'
import Footer from '../components/Footer'
import InfoCard from '../components/InfoCard'
import FeaturedItems from '../components/FeaturedItems'

function LandingPage() {
  return (
	<div className='flex flex-1 flex-col w-full min-h-screen'>
<HeroSection/>
<InfoCard/>
<FeaturedItems/>
<Footer/>
	</div>
  )
}

export default LandingPage