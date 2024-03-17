import Navbar from "@/Components/Header";
import Image from "next/image";
import { useRouter } from "next/router";
import { AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import LoginLogout from "@/Components/LoginLogout";
import Login from "./login";

export default function Home() {
  const router = useRouter();
  return (
    <div >
      <div className="flex flex-col items-center justify-center mt-40 bg-white">
        <h1 className="text-6xl font-bold text-black pb-2">Welcome to Dobby</h1>

        <div className="flex flex-col items-center justify-center mt-10 justify-between">
          <div>
            <Link href="/images" className="mr-6 mb-6 inline-flex items-center bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
              <span>View images</span>
              <AiOutlineRight className="ml-2" />

            </Link>
            <span onClick={() => {
              router.push("/upload")
            }} className="hover:bg-blue-700 cursor-pointer bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg ">
              Upload</span>

          </div>
          <LoginLogout />






          {/* <label htmlFor="upload-input" className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg mr-10 cursor-pointer">
              Choose Image
            </label>
            <input
              id="upload-input"
              type="file"
              className="absolute top-0 left-0 w-0 h-0 opacity-0"
              style={{ position: 'absolute', visibility: 'hidden' }}
            /> */}



        </div>
      </div>
    </div>

  );
}
