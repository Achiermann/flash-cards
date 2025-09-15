'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function LoginPage() {
    
const [display, setDisplay] = useState("signin");
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

async function handleSignup() {
  if (!email || !username || !password) {
    toast.error('Please fill in all fields');
    return;
  }
  if (password.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }
  email.includes('@', '.') ? null : toast.error('Please enter a valid email');
  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Signup failed');
    } else {
      toast.success('Account created!');
      setDisplay('signin');
    }
  } catch (err) {
    console.error('Signup error:', err);
    toast.error('Something went wrong');
  }
}

async function handleLogin() {
  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
toast.success(`Welcome ${data.username}!`);
setTimeout(() => window.location.reload(), 1500);
  } else {
    toast.error(data.error || 'Login failed');
  }
}

  return (<div className="login-page">
<div className="login-field">
{/*//.2      SIGN IN            */}
{(display==="signin") && <>
<h2>Sign In</h2>
<div className="login-field-input-wrapper">
    <form onSubmit={(e) => {e.preventDefault(); handleLogin();}}>
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
    <input  type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
    <button type="submit" style={{ display: 'none' }} />
    </form></div>
    <div className="remember-me-wrapper"><input type="checkbox" className="btn-stay-signed-in"/><p>Remember Me</p></div>
    <button className="btn-login" onClick={handleLogin}>Log In</button>
    <div className="login-options-wrapper">
         <p>{<button className="btn-forgot-pw" onClick={() => setDisplay("forgetpw")}><p><em>Forgot password?</em></p></button>}<br/>
   don`t have an account yet? {<button className="btn-sign-up-here" onClick={() => setDisplay("signup")}><p><u>Sign up</u></p></button>}</p>
    </div></>}

{/*//.2      SIGN UP            */}
{(display==="signup") && <>
<h2>Sign Up</h2>
<div className="login-field-input-wrapper">
     <input  type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
    <input  type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
</div>
    <button className="btn-signup" onClick={handleSignup}>Create Account</button>
    <div className="login-options-wrapper">
         <p> Already have an account? {<button className="btn-sign-up-here" onClick={() => setDisplay("signin")}><p><u>Sign in</u></p></button>}</p>
    </div>
    </>}
{/*//.2      RESET PW            */}
{(display==="forgetpw") && <>
<h2>Forgot Password</h2>
<div className="login-field-input-wrapper">
    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
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
