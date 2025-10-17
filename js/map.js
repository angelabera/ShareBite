// Initialize the map centered at Mumbai
const map = L.map("map").setView([19.076, 72.8777], 13);

// Add OpenStreetMap layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Load and display listings
fetch("data/listings.json")
  .then((res) => res.json())
  .then((listings) => {
    listings.forEach((item) => {
      const marker = L.marker([item.lat, item.lng]).addTo(map);
      marker.bindPopup(`
        <strong>${item.name}</strong><br>
        ${item.desc}<br><br>
        <a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}" target="_blank">📍 Get Directions</a>
      `);
    });
  })
  .catch((err) => console.error("Error loading listings:", err));
