"use client";
import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

const SeatGrid = () => {
    const [seats, setSeats] = useState([]);
    const [bookingCount, setBookingCount] = useState(1);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [autoBooking, setAutoBooking] = useState(false); // Toggle between manual and auto booking
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirect to login if token is missing
        } else {
            const fetchSeats = async () => {
                try {
                    const response = await api.get('/seats/available-seats');
                    setSeats(response.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchSeats();
        }
    }, []);

    const handleBookSeats = async () => {
        try {
            const response = await api.post('/seats/book-seats', { userId: 1, seatCount: bookingCount });
            if (response.data.message === 'Seats booked successfully') {
                setBookedSeats(response.data.seats);
                setSeats((prevSeats) =>
                    prevSeats.map((seat) =>
                        response.data.seats.includes(seat.id) ? { ...seat, is_booked: true } : seat
                    )
                );
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleResetBooking = async () => {
        try {
            await api.post('/seats/reset-booking');
            setSeats((prevSeats) => prevSeats.map((seat) => ({ ...seat, is_booked: false })));
            setBookedSeats([]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
            router.push('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const renderSeatGrid = () => {
        return (
            <div className="grid grid-cols-7 gap-1">
                {seats.map((seat) => (
                    <div
                        key={seat.id}
                        className={`p-2 rounded ${seat.is_booked ? 'bg-yellow-500 cursor-not-allowed' : 'bg-green-500 cursor-pointer'}`}
                        onClick={() => {
                            if (!seat.is_booked && bookedSeats.length < bookingCount) {
                                setBookedSeats((prev) => [...prev, seat.id]);
                            }
                        }}
                    >
                        {seat.seat_number}
                    </div>
                ))}
            </div>
        );
    };

    const availableSeatsCount = seats.filter(seat => !seat.is_booked).length;
    const bookedSeatsCount = seats.filter(seat => seat.is_booked).length;

    return (
        <div className="flex flex-col justify-center items-center h-screen pl-20 pr-10">
            <div className="w-2/3">
                <div className="mb-4 flex">{/* Render Seat Grid */}</div>
            </div>
            <div className="w-1/3 ml-4">
                <button
                    onClick={handleLogout}
                    className="absolute right-10 bottom-10 p-2 bg-red-500 text-white rounded mx-auto block"
                >
                    Logout
                </button>
            </div>

            <div className="flex justify-center w-2/3">
                <div className="w-2/3">
                    <h3 className="text-black font-bold mb-2 text-center">Seat Availability</h3>
                    <div className="mb-4">{renderSeatGrid()}</div>
                    <div className="text-black bg-gray-200 p-4 rounded text-center">
                        <p className="font-semibold">Available Seats: {availableSeatsCount}</p>
                        <p className="font-semibold">Booked Seats: {bookedSeatsCount}</p>
                    </div>
                </div>

                <div className="w-full ml-4">
                    <h3 className="text-black font-bold mb-4 text-center">Train Seat Booking</h3>
                    <div className="mb-4">
                        <label htmlFor="seatCount" className="block text-black text-center">Number of Seats to Book:</label>
                        <input
                            id="seatCount"
                            type="number"   
                            value={bookingCount}
                            onChange={(e) => setBookingCount(Math.min(7, Math.max(1, e.target.value)))}
                            min="1"
                            max="7"
                            className="w-1/2 p-2 text-black border border-gray-300 rounded mx-auto block"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-black text-center">Booking Method:</label>
                        <select
                            onChange={(e) => setAutoBooking(e.target.value === 'auto')}
                            className="w-1/2 p-2 text-black border border-gray-300 rounded mx-auto block"
                        >
                            <option value="manual">Manual</option>
                            <option value="auto">Auto</option>
                        </select>
                    </div>
                    <button
                        onClick={autoBooking ? handleBookSeats : handleBookSeats}
                        className="w-1/2 p-2 bg-blue-500 text-white rounded mx-auto block"
                        disabled={bookedSeats.length !== bookingCount}
                    >
                        Book Seats
                    </button>
                    <button
                        onClick={handleResetBooking}
                        className="w-1/2 p-2 bg-gray-500 text-white rounded mt-4 mx-auto block"
                    >
                        Reset Booking
                    </button>
                    {bookedSeats.length > 0 && (
                        <div className="mt-4 text-center">
                            <h4 className="font-semibold text-blue-700">Booked Seats:</h4>
                            <ul className="list-disc pl-5 inline-block text-left">
                                {bookedSeats.map((seat) => (
                                    <li key={seat} className="text-blue-700">{seat}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatGrid;
