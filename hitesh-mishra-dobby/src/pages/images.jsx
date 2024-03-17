import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/styles/store/user';
import { useRouter } from 'next/router';
import { mounted } from '@/store/atoms/mounted';

export default function Images() {
    const router = useRouter();
    const user = useRecoilValue(userState);
    const [images, setImages] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const isMounted = useRecoilValue(mounted);


    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    useEffect(() => {
        async function fetchImages() {
            if (!user.user) {
                // Optionally, redirect to login page or show a message
                return;
            }

            const res = await fetch(`https://jubilant-space-fortnight-6wvjrr977xrf449g-3001.app.github.dev/images`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                }
            });

            if (res.status === 401) {
                alert("You are not authorized to view this page");
                return;
            } else {
                const data = await res.json();
                setImages(data.images);
            }
        }
        fetchImages();
    }, [user.user]);

    const filteredImages = images.filter((image) =>
        image.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (!isMounted) {
        return (
            <div className="flex flex-col items-center justify-center h-screen mt-26 bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full w-14 h-14 bg-gradient-to-tr from-gray-500 to-black">
                        <div className="h-9 w-9 rounded-full bg-gray-200"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (!user.user) {
        return (
            <div className='mt-20'>
                <div className="flex justify-center mb-20">
                    <div className="w-full max-w-xs m-auto bg-gray-100 rounded p-5">
                        <p className="text-center text-pink-800 mb-4">You are not logged in.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full bg-blue-700 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </div>

        );
    }

    return (
        <div className='mt-20 mb-10'>
            <div className="flex justify-center mb-20">
                <input
                    type="text"
                    placeholder="Search Image by name"
                    className="border-2 border-gray-300 p-2 rounded-lg w-1/3"
                    onChange={handleSearchChange}
                />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {filteredImages.map((image) => (
                    <div key={image._id} className="flex flex-col items-center">
                        <img
                            src={image.url}
                            alt={image.name}
                            className="w-72 h-72 object-cover rounded-lg"
                        />
                        <p className="text-lg font-bold mt-2">{image.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
