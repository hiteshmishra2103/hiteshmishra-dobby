import { useRouter } from "next/router";
import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "@/styles/store/user";
import formStyles from '../styles/signup.module.css'

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [existserror, setExistsError] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    // const setUser = useSetRecoilState(userState);

    const router = useRouter();
    return (

        <div className="flex flex-col items-center justify-center h-screen px-6 py-12 lg:px-8">
            <h1
                className="text-3xl font-bold text-black pb-2"
            >
                Login
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

                    {existserror && <div className={formStyles.requiredFields}>
                        <p>Invalid username or password!</p>
                    </div>}

                    <div>
                        <button type="button" onClick={async () => {
                            try {
                                if (!username || !password) {
                                    setExistsError(true);
                                    setTimeout(() => {
                                        setExistsError(false);
                                    }, 700);

                                };


                                const res = await axios.post(`https://jubilant-space-fortnight-6wvjrr977xrf449g-3001.app.github.dev/login`, {
                                    username: username,
                                    password: password
                                }, {
                                    headers: {
                                        "Content-type": "application/json"
                                    }
                                });
                                const data = await res.data;
                                localStorage.setItem("token", data.token);
                                if (res.status == 200) {
                                    await router.push("/images");
                                    router.reload();
                                    // setUser({
                                    //     user: username,
                                    //     isLoading: false
                                    // })

                                }

                            }
                            catch (error) {
                                if (error.response && error.response.status == 403) {
                                    console.log(error.response.data);
                                    setExistsError(true);
                                    const fill = document.querySelector(`.${formStyles.requiredFields}`);
                                    fill?.classList.remove(`${formStyles.hide}`);

                                } else if (error.response && error.response.status == 400) {
                                    // The request was made but no response was received
                                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                    // http.ClientRequest in node.js
                                    console.error(error.response.data);
                                }

                            }
                        }

                        }
                            className="flex w-full justify-center rounded-md  bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </div>
                <p className="mt-10 text-center text-sm text-gray-500">
                    New User?
                    <span className="cursor-pointer text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 pl-2" onClick={() => {
                        router.push("/signup");
                    }}>Signup</span>
                </p>
            </div>
        </div>
    );
}
