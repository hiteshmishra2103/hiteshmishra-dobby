import React from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { useSetRecoilState } from 'recoil';
import { userState } from '@/styles/store/user';
import { useRecoilValue } from 'recoil';
import { mounted } from '@/store/atoms/mounted';

const LoginLogout = () => {
    // Your component logic goes here

    const router = useRouter();
    const setUser = useSetRecoilState(userState);
    const user = useRecoilValue(userState);
    const isMounted = useRecoilValue(mounted);

    if (!isMounted) {
        return (
            <div className="flex flex-col items-center justify-center h-fit mt-26 bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full w-14 h-14 bg-white">
                        <div className="h-9 w-9 rounded-full bg-blue-500"></div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        if (!user.user) {
            return (
                <div>

                    <span onClick={() => {
                        router.push("/login")
                    }} className="cursor-pointer bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg ">
                        Login</span>
                </div>
            )
        } else {
            return (
                <>
                    <div>
                        <span onClick={() => {
                            try {

                                localStorage.setItem("token", null);
                                setUser({
                                    user: '',
                                    isLoading: true,
                                });


                                router.push('/');
                            } catch (err) {
                                alert(err.message);
                            }
                        }} className="cursor-pointer bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg ">
                            Logout</span>
                    </div>
                </>
            )
        }
    }

};

export default LoginLogout;
