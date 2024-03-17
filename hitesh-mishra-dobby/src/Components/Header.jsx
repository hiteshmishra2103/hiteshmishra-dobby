// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoginLogout from './LoginLogout';


const Header = () => {
    const router = useRouter();
 
    
    return (
        <header className="items-center py-4 px-4 bg-white border-gray-200 px-4 lg:px-4 py-4 mt-10 mb-10">
            <nav className="flex flex-wrap justify-center items-center mx-auto max-w-screen-xl h-full">
                <div className="flex items-center justify-center w-full h-full">
                    <Link href="/" className="text-black mb-4 text-center text-3xl font-bold whitespace-nowrap dark:text-white">
                        Dobby
                    </Link>
                </div>
            
            </nav>
        </header>

    );
};

export default Header;
