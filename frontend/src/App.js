import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const API_URL = "";
const flights = [804, 806, 809, 811, 813, 817, 836, 838, 839, 803, 810, 815, 843, 844, 845, 846];

export default function AircraftBooking() {
  const [bookings, setBookings] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/flights`)
      .then((res) => res.json())
      .then((data) => {
        const flightData = {};
        data.forEach((flight) => {
          flightData[flight.flightNumber] = flight;
        });
        setBookings(flightData);
      });
  }, []);

  const bookFlight = async (flightNumber) => {
    await fetch(`${API_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flightNumber }),
    });
    refreshFlights();
  };

  const releaseFlight = async (flightNumber) => {
    await fetch(`${API_URL}/release`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flightNumber }),
    });
    refreshFlights();
  };

  const refreshFlights = () => {
    fetch(`${API_URL}/flights`)
      .then((res) => res.json())
      .then((data) => {
        const flightData = {};
        data.forEach((flight) => {
          flightData[flight.flightNumber] = flight;
        });
        setBookings(flightData);
      });
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {flights.map((flightNumber) => (
        <div key={flightNumber} className="p-4 border rounded-lg">
          <h3 className="text-lg font-bold">Fly {flightNumber}</h3>
          {bookings[flightNumber]?.booked ? (
            <p className="text-red-500">Opptatt til {new Date(bookings[flightNumber].endTime).toLocaleTimeString()}</p>
          ) : (
            <Button onClick={() => bookFlight(flightNumber)}>Reserver</Button>
          )}
          {bookings[flightNumber]?.booked && (
            <Button onClick={() => releaseFlight(flightNumber)} className="ml-2">Frigjør</Button>
          )}
        </div>
      ))}
    </div>
  );
}
