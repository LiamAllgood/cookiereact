export default function UpgradeButton({ upgrade, buyUpgrade, cookies }) {
  // Handle when the player clicks the "Buy Upgrade" button
  const handleUpgrade = () => {
    if (cookies >= upgrade.cost) {
      buyUpgrade(upgrade); // Buy upgrade if the user has enough cookies
    }
  };

  return (
    <div className="upgrade">
      <h3>{upgrade.name}</h3>
      <p>{upgrade.description}</p>
      <p>Cost: {upgrade.cost} cookies</p>
      <p>CPS Increase: {upgrade.cpsIncrease}</p>

      <button
        onClick={handleUpgrade}  // Trigger upgrade when clicked
        disabled={cookies < upgrade.cost} // Disable the button if not enough cookies
      >
        Buy Upgrade
      </button>
    </div>
  );
}