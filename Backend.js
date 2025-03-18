import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://BrageHN:<db_password>@flybooking.45yvr.mongodb.net/?retryWrites=true&w=majority&appName=Flybooking";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


const API_URL = "https://flybooking.onrender.com";
const aircrafts = [804, 806, 809, 811, 813, 817, 836, 838, 839, 803, 810, 815, 843, 844, 845, 846];

export default function AircraftBooking() {
  const [bookings, setBookings] = useState({});

  useEffect(() => {
    fetch(`${API_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => {
        const aircraftData = {};
        data.forEach((aircraft) => {
          aircraftData[aircraft.name] = aircraft;
        });
        setBookings(aircraftData);
      });
  }, []);

  const bookAircraft = async (aircraft) => {
    await fetch(`${API_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: aircraft }),
    });
    refreshAircrafts();
  };

  const releaseAircraft = async (aircraft) => {
    await fetch(`${API_URL}/release`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: aircraft }),
    });
    refreshAircrafts();
  };

  const refreshAircrafts = () => {
    fetch(`${API_URL}/rooms`)
      .then((res) => res.json())
      .then((data) => {
        const aircraftData = {};
        data.forEach((aircraft) => {
          aircraftData[aircraft.name] = aircraft;
        });
        setBookings(aircraftData);
      });
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {aircrafts.map((aircraft) => (
        <div key={aircraft} className="p-4 border rounded-lg">
          <h3 className="text-lg font-bold">Fly {aircraft}</h3>
          {bookings[aircraft]?.booked ? (
            <p className="text-red-500">Opptatt til {new Date(bookings[aircraft].endTime).toLocaleTimeString()}</p>
          ) : (
            <Button onClick={() => bookAircraft(aircraft)}>Reserver</Button>
          )}
          {bookings[aircraft]?.booked && (
            <Button onClick={() => releaseAircraft(aircraft)} className="ml-2">Frigjør</Button>
          )}
        </div>
      ))}
    </div>
  );
}
