import React from "react";
import { Link } from "react-router-dom";

function Login() {
  function handleSubmit(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.target); // Get form data

    // Convert form data to JSON object
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Send data to backend using fetch
    fetch("http://localhost:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful response from backend
        console.log("Success:", data);
        alert("user logedin");
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  }

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      {/* {<Fb/>} */}
      <section className="bg-white rounded-md">
        {/* <div className="w-full bg-black rounded-lg shadow dark:border dark:border-gray-700 md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800"> */}
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 ">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
            login in to your account
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-white focus:ring-white ring-white"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-white-500">
                    Remember me
                  </label>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-primary-800"
            >
              Log in
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
        {/* </div> */}
      </section>
    </div>
  );
}

export default Login;
