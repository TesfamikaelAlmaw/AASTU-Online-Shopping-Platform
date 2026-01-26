import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/auth.service'
import HeroSection from '../components/HeroSection'
import LatestItems from '../components/LatestItems'
import Footer from '../components/Footer'
import InfoCard from '../components/InfoCard'
import FeaturedItems from '../components/FeaturedItems'

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [navigate]);

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