import React from "react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/atoms/user";
import { mounted } from "@/store/atoms/mounted";

const uploadImages = () => {
    const [name, setName] = useState("");
    const user = useRecoilValue(userState);
    const isMounted = useRecoilValue(mounted);
    const [url, setUrl] = useState("");
    const [userImage, setUserImage] = useState(null);

    const handleImageChange = (e) => {
        const files = e.target.files;
        setUserImage(files[0]);
    };

    //using cloudinary to upload images

    const uploadImage = async (e) => {
        try {
            if (!userImage) {
                return;
            }
            if (
                userImage.type === "image/png" ||
                userImage.type === "image/jpeg" ||
                userImage.type === "image/jpg" ||
                userImage.type === "image/webp" ||
                userImage.type === "image/svg") {

                const files = e.target.files;
                const data = new FormData();
                data.append('file', files[0]);
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
            }
        }
        catch (err) {
            alert(err.message);
        }
    }

    return (
        <div>
            <div>
                <h1>Upload Images</h1>
                <input
                    type="file"
                    name="file"
                    placeholder="Upload an image"
                    onChange={handleImageChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name of the image"
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={uploadImage}>Submit</button>
            </div>
        </div>
    );

}