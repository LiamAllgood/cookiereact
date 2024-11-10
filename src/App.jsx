import './App.css';
import { useState, useEffect } from "react";
import UpgradeButton from "./components/UpgradeButton";

export default function App() {
  const [cookies, setCookies] = useState(0);
  const [cps, setCps] = useState(1); // Cookies Per Second
  const [upgrades, setUpgrades] = useState([]); // State for upgrades
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch upgrades from the API when the component mounts
  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const response = await fetch("https://cookie-upgrade-api.vercel.app/api/upgrades");
        if (!response.ok) {
          throw new Error("Failed to fetch upgrades");
        }
        const data = await response.json();
        setUpgrades(data); // Save the fetched upgrades into state
      } catch (error) {
        setError(error.message); // Handle error if fetching fails
      } finally {
        setLoading(false); // Stop loading when finished
      }
    };

    fetchUpgrades(); // Call the function to fetch upgrades
  }, []); // Empty dependency array means it runs only once when the component mounts

  // Increment cookies manually
  function incrementCookies() {
    setCookies((prevCookies) => prevCookies + 1);
  }

  // Function to buy an upgrade (increases cps and deducts cookies)
  function buyUpgrade(upgrade) {
    setCps((prevCps) => {
      if (cookies >= upgrade.cost) {
        setCookies((prevCookies) => prevCookies - upgrade.cost); // Deduct the cookies for the upgrade
        return prevCps + upgrade.cpsIncrease; // Increase CPS based on the upgrade
      }
      return prevCps; // If not enough cookies, return the previous CPS value
    });
  }

  // Update cookies every second based on CPS
  useEffect(() => {
    const interval = setInterval(() => {
      setCookies((prevCookies) => prevCookies + cps); // Add CPS to cookies every second
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [cps]); // Only re-run if cps changes

  return (
    <div className="App">
      <h1>Cookie Clicker</h1>
      <button onClick={incrementCookies}>
        <img src="/cookie.jpg" alt="cookie" style={{ width: '200px', height: '200px' }} />
      </button>
      <p>Cookies: {cookies}</p>
      <p>CPS (Cookies Per Second): {cps}</p>

      <h2>Upgrades</h2>
      <div>
        {upgrades.length > 0 ? (
          upgrades.map((upgrade) => (
            <UpgradeButton
              key={upgrade.id}
              upgrade={upgrade} // Pass the upgrade data to the UpgradeButton
              buyUpgrade={buyUpgrade} // Pass the buyUpgrade function
              cookies={cookies} // Pass the current cookies state
            />
          ))
        ) : (
          <p>No upgrades available</p>
        )}
      </div>
    </div>
  );
}