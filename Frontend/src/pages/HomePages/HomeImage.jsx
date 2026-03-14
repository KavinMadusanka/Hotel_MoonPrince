import React from 'react'
import image from '../../../public/hotel.jpg'

const HomeImage = () => {
  return (
    <div className='relative min-h-screen'>
      <img src={image} 
      alt="Home"
      className="w-full h-screen object-cover" />
      {/* Purple Overlay */}
      <div className="absolute w-full inset-0 bg-purple-950/60"></div>
      <div className='absolute inset-0 px-10 py-50 flex flex-col items-center justify-center text-center wrap-break-word gap-3'>
        <p className="text-4xl md:text-6xl lg:text-8xl font-bold text-white tracking-widest font-['Playfair_Display']">
          Welcome to<br/> Hotel MoonPrince
        </p>
        <p className="text-white tracking-widest text-lg md:text-xl max-w-md md:max-w-xl">
          WHERE ROYAL COMFORT MEETS SERENE LUXURY. EXPERIENCE THE MOONLIGHT DIFFERENCE.
        </p>
      </div>
    </div>
  )
}

export default HomeImage