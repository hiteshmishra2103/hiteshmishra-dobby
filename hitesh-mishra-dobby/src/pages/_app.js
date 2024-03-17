import Header from "@/Components/Header";
import "@/styles/globals.css";
import { userState } from '@/store/atoms/user'
import { RecoilRoot, constSelector, useRecoilValue } from 'recoil'
import axios from 'axios'
import { useSetRecoilState } from 'recoil'
import { useEffect } from 'react'
import { mounted } from '@/store/atoms/mounted'


export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <InitUser/>
      <Header />
      <Component {...pageProps} />
    </RecoilRoot>

  );
}

function InitUser() {
  const setUser = useSetRecoilState(userState);
  const setMounted = useSetRecoilState(mounted);

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.get(`https://jubilant-space-fortnight-6wvjrr977xrf449g-3001.app.github.dev/me`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (response.data.user) {
          setUser({
            user: response.data.user,
            isLoading: false,
          });
        } 
      } catch (e) {
        console.error(e);
      } finally {
        setMounted({
          isMounted: true
        });
      }
    };

    init();
  }, []);
  return null;
};