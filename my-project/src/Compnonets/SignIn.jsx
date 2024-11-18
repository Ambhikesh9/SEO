import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  
  const notifyLogin = (e) => toast.success(e);

  
  const getUser = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        throw new Error("No token found");
      }

      const response =  await fetch("http://localhost:3000/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`); 
      }
      
      const data = await response.json();
      console.log(data.user)
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        userName,
        password,
    };


    try {
        const response = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log(response)
        const result = await response.json();
        console.log(result)
        if (response.ok) {
          notifyLogin("Login Successfull!");
          setMessage("Login successfully!")
          localStorage.setItem('Token', result.token);
          setUserName("")
          setPassword("")
          getUser();
          setTimeout(() => {
            navigate("/user");
          }, 1000);
        } else {
            setMessage(result.error)
            setTimeout(()=>{
              setMessage("")
            },5000)
        }
    }
    catch(err){
      console.log(err)
      setMessage(err);
      setTimeout(()=>{
        setMessage("")
      },5000)
    }

  }


  const navigate = useNavigate();
  const signup = () => {
    navigate("/signup");
  };

  return (
    <div className="flex flex-col max-h-screen">
      <Navbar option="signin" />
      <div className="flex bg-darkNavy items-center justify-center h-screen ">
          <form
            className="w-[450px] text-white flex flex-col shadow-slate-800 shadow-[0px_0px_240px_rgba(1,1,1,100)] bg-navy2 p-4 rounded-2xl space-y-5 py-8 px-8"
            onSubmit={handleSubmit}
          >
            <h1 className="text-5xl text-white  font-bold text-center">
              Sign in
            </h1>
            <div className="flex flex-col space-y-2">
              <label htmlFor="name" className="text-1xl font-medium">
                Username:
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-1xl font-medium outline-none active:outline-gray-950"
              >
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="p-2 border border-gray-300 rounded-md outline-none text-black"
                required
              />
            </div>
            <p className="text-red-500 text-center m-0 text-sm">{message}</p>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors "
            >
              Log In
            </button>
            <div className="w-full text-center">
              New here ?{" "}
              <a onClick={signup} className="cursor-pointer">
                Sign up
              </a>
            </div>
          </form>
        </div>
      <ToastContainer  position="top-center" autoClose={1000} limit={3} />
    </div>
  );
}

export default SignIn;
