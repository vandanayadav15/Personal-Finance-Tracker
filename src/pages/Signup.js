import React from 'react'
import Header from '../components/Header/Index'
import SignupSignin from '../components/SignupSignin/Index'

function Signup() {
  return (
      <div>
          <Header />
          <div className='wrapper'>
              <SignupSignin/>
          </div>
    </div>
  )
}

export default Signup