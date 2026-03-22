import React from 'react'

const Rooms = () => {
  return (
    <div id="Rooms" className='bg-white min-h-screen justify-center items-center flex flex-col gap-5 py-20 px-5'>
        <span className='text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 tracking-widest text-center
        relative inline-block pb-2
        after:block after:h-1 after:w-1/3 after:mx-auto after:bg-[#D4AF37] after:mt-2 after:rounded-full'>
            Our Featured Rooms
        </span>
        <p className='text-slate-400 max-w-2xl text-center'>Experience unparalleled luxury in our meticulously designed suites, each offering a unique blend of moonlit charm and modern sophistication.</p>
        {/* <p>Experience unparalleled luxury in our carefully curated rooms, designed to provide the ultimate comfort and sophistication for your stay.</p> */}
    </div>
  )
}

export default Rooms