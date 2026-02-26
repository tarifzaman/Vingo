import axios from 'axios';
import { useEffect } from 'react';
import { serverUrl } from '../App';

function useGetCurrentUser() {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`, {
                    withCredentials: true // ✅ cookie send
                });
                console.log(result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

}

export default useGetCurrentUser;