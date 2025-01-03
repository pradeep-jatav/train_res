"use client";
import { useEffect, useState } from 'react';
import SeatGrid from './login/page';
import Login from './login/page';
import Signup from './signup/page';
export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch data from backend when the component mounts
        const fetchData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/endpoint`);
            const result = await response.json();
            setData(result);
        };

        fetchData();
    }, []);

    return (
        <div>
            <Signup />
            {data && <div>{data.message}</div>}
        </div>
    );
}

