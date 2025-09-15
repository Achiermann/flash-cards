'use client';

import { useState, useEffect } from 'react';

export default function LoginPage() {

const [display, setDisplay] = useState("signin");

  return (<div className="login-page">
<div className="login-field">
{/*//.2      SIGN IN            */}
{(display==="signin") && <>
<h2>Sign In</h2>
<div className="login-field-input-wrapper">
    <input type="text" placeholder="Username" />
    <input  type="password" placeholder="Password" /></div>
    <div className="remember-me-wrapper"><input type="checkbox" className="btn-stay-signed-in"/><p>Remember Me</p></div>
    <button className="btn-login">Log In</button>
    <div className="login-options-wrapper">
         <p>{<button className="btn-forgot-pw" onClick={() => setDisplay("forgetpw")}><p><em>Forgot password?</em></p></button>}<br/>
   don`t have an account yet? {<button className="btn-sign-up-here" onClick={() => setDisplay("signup")}><p><u>Sign up</u></p></button>}</p>
    </div></>}

{/*//.2      SIGN UP            */}
{(display==="signup") && <>
<h2>Sign Up</h2>
<div className="login-field-input-wrapper">
     <input  type="text" placeholder="Email" />
    <input type="text" placeholder="Username" />
    <input  type="password" placeholder="Password" />
</div>
    <button className="btn-login">Create Account</button>
    <div className="login-options-wrapper">
         <p> Already have an account? {<button className="btn-sign-up-here" onClick={() => setDisplay("signin")}><p><u>Sign in</u></p></button>}</p>
    </div>
    </>}
{/*//.2      RESET PW            */}
{(display==="forgetpw") && <>
<h2>Forgot Password</h2>
<div className="login-field-input-wrapper">
    <input type="text" placeholder="Email" />
    <div className="btn-login-wrapper">
    <button className="btn-resetpw">Reset Password</button>
    <button onClick={() => setDisplay("signin")}>Go Back</button>
    </div>
    </div>
</>}
</div>
  </div>
  );
}
