
import React, { useState, useRef } from 'react';
//import '../App.css';

import { auth } from '../App.js'



function SignUp() {
  
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    
    const signUp = e => {
      e.preventDefault();
      auth.createUserWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
      ).then(user => {
          console.log(user)
      }).catch(err => {
          console.log(err)
      })
    }
  
    return (
      <>
      <div className={signUp}>
          <form action="">
              <h1>Sign Up</h1>
              <input ref={emailRef} type="email" />
              <input ref={passwordRef} type="password" />
              <button>Sign in </button>
          </form>
      </div>
  
      </>
  )
  
  
  
  }

  export default SignUp;