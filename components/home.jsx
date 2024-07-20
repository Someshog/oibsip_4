import { React, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

function Home(){
  const [entries, setEntries] = useState([]); // State to manage registered users
  const navigate = useNavigate(); // Hook for navigation
  const ref = useRef();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Function to toggle password visibility
  const showpassword = () => {
    if (ref.current.src.includes("/eyeopen.svg")) {
      ref.current.src = "/eyeclose.svg";
      document.getElementById("password").type = "password";
    } else {
      ref.current.src = "/eyeopen.svg";
      document.getElementById("password").type = "text";
    }
  };

  // Handle form submission
  const onSubmit = (data) => {
    let flag = 0;

    if (entries.length === 0) {
      // If no entries in localStorage
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(data.password, salt, function (err, hash) { //
          toast.success("Account registered successfully");
          setEntries([...entries, { username: data.username, password: hash }]); //storing the data in an array "entries"
          localStorage.setItem( //storing "entries" in local storage so that the passowords are saved to local machine.
            "passwords",
            JSON.stringify([
              ...entries,
              { username: data.username, password: hash },
            ])
          );
        });
      });
    } else {
      for (const key in entries) {
        if (entries[key].username === data.username) {
          alert("This username already exists, try another one!");
          flag = 1;
          break;
        }
      }
      if (flag === 0) {
        bcrypt.genSalt(10, function (err, salt) { 
          bcrypt.hash(data.password, salt, function (err, hash) {
            toast.success("Account registered successfully");
            setEntries([
              ...entries,
              { username: data.username, password: hash },
            ]);
            localStorage.setItem(
              "passwords",
              JSON.stringify([
                ...entries,
                { username: data.username, password: hash },
              ])
            );
          });
        });
      }
    }
  };

  useEffect(() => {
   
    localStorage.setItem("useractive", false); // To set 'useractive' to false in localStorage on component mount
    let passwords = localStorage.getItem("passwords"); // To load passwords from localStorage on component mount
    if (passwords) {
      setEntries(JSON.parse(passwords));
    }
  }, []);

  // Function to handle login
  const login = (e) => {
    let flag = 0;
    for (const key in entries) {
      if (watch().username === entries[key].username) {
        flag = 1;
        bcrypt.compare(
          watch().password,
          entries[key].password,
          function (err, res) {
            if (res) {
              localStorage.setItem("useractive", true); // Set user as active 
              navigate(`${watch().username}`); // Navigate to user-specific page
              window.location.reload();
            } else {
              toast.error("incorrect password"); // Toast for incorrect password
            }
          }
        );
      }
    }
    if (flag == 0) {
      toast.warn("Account doesn't exist.");
    }
  };

  const validatePassword = (value) => {
    // Regex to ensure at least one uppercase letter and one special character
    return (
      /^(?=.*[A-Z])(?=.*[!@#$%^&*]).+$/.test(value) ||
      "Password must contain at least one uppercase letter and one special character (!@#$%^&*)"
    );
  };


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="flex relative items-center justify-center h-[80%] :h-full w-full ">
        <div className="flex flex-wrap absolute items-center h-full w-full justify-center">
          <div className="font-light sm:justify-center md:pb-0 md:justify-start sm:p-5 md:w-1/2 text-5xl border-spacing-3 text-center flex items-center text-white left-0 tracking-widest md:font-extralight sm:w-full md:text-7xl 2xl:text-8xl">
            Login-Verse
          </div>
          <div className="m-1 w-full border-2 border-violet-700  bg-violet-500 bg-opacity-50 rounded-lg md:mt-0 sm:max-w-md">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-semibold text-gray-900 md:text-3xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`space-y-4 ${
                  Boolean(errors.password) ? null : "md:space-y-6"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="email"
                    className="text-md font-medium text-gray-900 dark:text-white"
                  >
                    Username or Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="border shadow-black shadow-2xl bg-black bg-opacity-80 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    {...register("username", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                      minLength: { value: 5, message: "Min length is 5" },
                    })}
                  />
                  {errors.username && (
                    <div className="text-red-500 text-center tracking-wide text-sm font-semibold">
                      {errors.username.message}
                    </div>
                  )}
                </div>

                <div className="relative flex flex-col justify-center gap-1">
                  <label
                    htmlFor="password"
                    className="text-md font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>

                  <input
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="border shadow-black shadow-2xl bg-black bg-opacity-80 rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "This field is required",
                      },
                      minLength: { value: 5, message: "Min length is 5" },
                      validate: validatePassword,
                    })}
                    type="password"
                  />
                  <img
                    src="/eyeclose.svg"
                    ref={ref}
                    onClick={showpassword}
                    width="30px"
                    className="absolute right-3 top-9 cursor-pointer "
                  />
                  {errors.password && (
                    <div className="text-red-500 text-center tracking-wide text-sm font-semibold">
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div
                  onClick={() => {
                    login();
                  }}
                  name="sss"
                  className="w-full text-white bg-black hover:bg-green-600 transition-all duration-500 cursor-pointer hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </div>

                <p className="text-md text-white flex flex-col gap-2">
                  Don’t have an account yet?
                  <button
                    type="submit"
                    className="w-full text-white bg-violet-900 hover:bg-violet-700 transition-all duration-500 font-medium rounded-lg text-md px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
