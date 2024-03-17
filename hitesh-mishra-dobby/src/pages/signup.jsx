import { useRouter } from "next/router";
import formStyles from '../styles/signup.module.css'
import { useState } from "react";
import axios from "axios";

export default function Signup() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [accountCreated, setAccountCreated] = useState(false);
    const [existserror, setExistsError] = useState(false);

    const [notFilled, setNotFilled] = useState(false);

    return (

        <div className="flex flex-col items-center justify-center h-screen px-6 py-12 lg:px-8">
            <h1
                className="text-3xl font-bold text-black pb-2"
            >
                Signup
            </h1>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2">
                            <input id="username" onChange={(e) => { setUsername(e.target.value) }} name="username" type="text" autoComplete="username" required className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input id="password" onChange={(e) => { setPassword(e.target.value) }} name="password" type="password" autoComplete="current-password" required className="block w-full rounded-md border-0 px-1 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>
                    {notFilled && <div className={formStyles.requiredFields}>
                        <p>Fill all fields and password should be at least of 8 length!</p>
                    </div>}
                    {existserror && <div className={formStyles.error}>
                        <p>User already exists</p>
                    </div>}
                    {accountCreated && <div className={formStyles.accountCreated}>
                        <p>Account Created successfully!</p>
                    </div>}

                    <div>
                        <button type="button" className="flex w-full justify-center rounded-md  bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={async (e) => {
                            e.preventDefault();
                            try {
                                if (!username || !password || password.length < 8) {
                                    setNotFilled(true);
                                    const fill = document.querySelector(`.${formStyles.requiredFields}`);
                                    fill.classList.remove(`${formStyles.hide}`)
                                    return;
                                }

                                const res = await axios.post(`https://jubilant-space-fortnight-6wvjrr977xrf449g-3001.app.github.dev/signup`, {
                                    username: username,
                                    password: password
                                }, {
                                    headers: {
                                        "Content-type": "application/json"
                                    }
                                });
                                const data = res.data;
                                localStorage.setItem("token", data.token);
                                if (res.status == 200) {
                                    setAccountCreated(true);
                                    const error = document.querySelector(`.${formStyles.error}`);
                                    error?.classList.add(`${formStyles.hide}`);
                                    const fill = document.querySelector(`.${formStyles.requiredFields}`);
                                    fill?.classList.add(`${formStyles.hide}`);

                                    setTimeout(() => {
                                        const accountCreated = document.querySelector(`.${formStyles.accountCreated}`);
                                        accountCreated.classList.add(`${formStyles.hide}`);
                                        setUsername("");
                                        setPassword("");

                                        router.push("/login");
                                    }, 500);
                                }
                                // router.push(`${username}/orders`);
                            } catch (error) {
                                console.error('Error:', error);
                                if (error.response) {
                                    if (error.response && error.response.status == '403') {
                                        setExistsError(true);
                                    }

                                }
                            }
                        }}

                        >Sign in</button>
                    </div>
                </div>
                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a User?
                    <span className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2" onClick={() => {
                        router.push("/login");
                    }}>Login</span>
                </p>
            </div>
        </div>
    );
}
