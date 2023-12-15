import React, { useEffect, useRef, useState } from 'react';
import Home from "./Home";
import "./SignInSignUp.css";

const SignInSignUp = () => {
    const phoneNumber = useRef();
    const email = useRef();
    const password = useRef();
    const newPassword = useRef();
    const [showHome, setShowHome] = useState(false);
    const [show, setShow] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const localSignUp = localStorage.getItem("signUp");
    const localEmail = localStorage.getItem("email");
    const localPassword = localStorage.getItem("password");

    useEffect(() => {
        if (localSignUp) {
            setShowHome(true);
        }
        if (localEmail) {
            setShow(true);
        }
    }, [localSignUp, localEmail]);

    const handleClick = () => {
        if (phoneNumber?.current?.value && email?.current?.value && password?.current?.value) {
            localStorage.setItem("phoneNumber", phoneNumber.current.value);
            localStorage.setItem("email", email.current.value);
            localStorage.setItem("password", password.current.value);
            localStorage.setItem("signUp", email.current.value);
            alert("Account created successfully");
            window.location.reload();
        }
    };

    const handleForgotPassword = () => {
        const token = generateResetToken();
        setResetToken(token);
        setForgotPassword(true);
    };

    const handleResetPassword = () => {
        if (resetToken && newPassword?.current?.value) {
            localStorage.setItem("password", newPassword.current.value);
            alert("Password reset successful");
            setForgotPassword(false);
            window.location.reload();
        } else {
            alert("Password reset failed. Please try again.");
        }
    };

    const generateResetToken = () => {
        return `${Date.now()}`;
    };

    const handleSignin = () => {
        if (email?.current?.value === localEmail && password?.current?.value === localPassword) {
            localStorage.setItem("signUp", email.current.value);
            window.location.reload();
        } else {
            alert("Please Enter Valid Credential")
        }
    }

    return (
        <div>
            {showHome ? (
                <Home />
            ) : show ? (
                <div className='container'>
                    <h1>{forgotPassword ? 'Reset Password' : 'Sign In Page'}</h1>
                    {!forgotPassword ? (
                        <>
                            {/* <div className='input_space'>
                                <input placeholder='Phone Number' type='text' ref={phoneNumber} />
                            </div> */}
                            <div className='input_space'>
                                <input placeholder='Email' type='text' ref={email} />
                            </div>
                            <div className='input_space'>
                                <input placeholder='Password' type='password' ref={password} />
                            </div>
                            <div>
                                <button onClick={handleSignin}>Sign in</button>
                                <p onClick={handleForgotPassword}>Forgot Password?</p>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                            <input placeholder='New Password' type='password' ref={newPassword} />
                            <button onClick={handleResetPassword}>Reset Password</button>
                        </div>
                    )}
                </div>
            ) : (
                <div className='container'>
                    <h1>Sign Up Page</h1>
                    <div className='input_space'>
                        <input placeholder='Phone Number' type='number' ref={phoneNumber} />
                    </div>
                    <div className='input_space'>
                        <input placeholder='Email' type='text' ref={email} />
                    </div>
                    <div className='input_space'>
                        <input placeholder='Password' type='password' ref={password} />
                    </div>
                    <button onClick={handleClick}>Sign Up</button>
                    {/* <p onClick={handleForgotPassword}>Forgot Password?</p> */}
                </div>
            )}
        </div>
    );
};

export default SignInSignUp;
