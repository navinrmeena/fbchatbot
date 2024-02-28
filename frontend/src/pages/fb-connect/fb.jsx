import React from 'react'

function Fb() {
  return (
    <section className= "bg-white rounded-xl ">
      {/* <div className="w-full bg-black rounded-lg shadow dark:border dark:border-gray-700 md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800"> */}
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Facebook Pages Integration
        </h1>
        <form className="space-y-4 md:space-y-6" action="#">
          
        <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blie-800 font-medium  text-sm px-5 py-2.5 text-center"
          >
            Connect page
          </button>
         
        </form>
      </div>
      {/* </div> */}
    </section>
   
  )
}

export default Fb
