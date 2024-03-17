import React from "react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { mounted } from "@/store/atoms/mounted";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import axios from "axios";

export default function uploadImages() {
    const router = useRouter();
    const [name, setName] = useState("");
    const user = useRecoilValue(userState);
    const isMounted = useRecoilValue(mounted);
    const [url, setUrl] = useState("");
    const [userImage, setUserImage] = useState(null);

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            setUserImage(files[0]);
        } else {
            alert("Please select a file to upload.");
        }
    };


    //using cloudinary to upload images


    const uploadImage = async () => { // Removed the event parameter since it's not needed here
        try {
            if (!userImage) {
                alert("Please select a file to upload.");
                return;
            }
            if (
                userImage.type === "image/png" ||
                userImage.type === "image/jpeg" ||
                userImage.type === "image/jpg" ||
                userImage.type === "image/webp" ||
                userImage.type === "image/svg") {

                const data = new FormData();
                data.append('file', userImage); // Use userImage directly
                data.append("cloud_name", `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
                data.append("upload_preset", `${process.env.NEXT_PUBLIC_UPLOAD_PRESET}`);
                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
                    {
                        method: "POST",
                        body: data,
                    }
                );
                const file = await res.json();
                setUrl(file.secure_url);

                const imageData = {
                    name: name,
                    url: file.secure_url
                }
                const response = await fetch(`https://jubilant-space-fortnight-6wvjrr977xrf449g-3001.app.github.dev/upload`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify(imageData),
                });
                if (response.status === 201) {
                    setName("");
                    setUserImage(null);
                    alert("Image uploaded successfully!");

                } else {
                    const data = await response.json();
                    console.log(data.message);
                    alert(data.message);
                }
            }
        }
        catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    }



    return (
        <div className="flex flex-col items-center justify-center mt-26 bg-white">
            {!isMounted ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full w-14 h-14 bg-gradient-to-tr from-gray-500 to-black">
                        <div className="h-9 w-9 rounded-full bg-gray-200"></div>
                    </div>
                    <p className="mt-2 text-xl">Loading...</p>
                </div>


            ) : user.user ? (
                <div className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
                    <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
                    <input
                        type="file"
                        name="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                        className="mb-4 p-2 border border-gray-300 rounded-md"
                        placeholder="Upload an image"
                        onChange={(e) => handleImageChange(e)}
                    />

                    <input
                        type="text"
                        name="name"
                        className="mb-4 p-2 border border-gray-300 rounded-md"
                        placeholder="Name of the image"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button
                        onClick={uploadImage}
                        className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                        Submit
                    </button>
                </div>
            ) : (
                <div className='mt-20'>
                    <div className="flex justify-center mb-20">
                        <div className="w-full max-w-xs m-auto bg-white rounded p-5">
                            <p className="text-center text-xl text-pink-900 mb-4">You are not logged in.</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full bg-blue-700 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )

}