const apiKey = "uL0d3URwYFEAs1ajAN3vinr32gRXouAp";

async function getHolidays() {
  const country = document.getElementById("country").value;
  const year = document.getElementById("year").value;
  const searchTerm = document.getElementById("searchTerm").value.toLowerCase();
  const holidayDiv = document.getElementById("holidays");
  const loadingDiv = document.getElementById("loading");

  holidayDiv.innerHTML = "";
  loadingDiv.style.display = "block";

  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const holidays = data.response.holidays;

    loadingDiv.style.display = "none";

    const today = new Date().toISOString().slice(0, 10);
    const filtered = holidays.filter(holiday =>
      holiday.name.toLowerCase().includes(searchTerm) ||
      (holiday.description && holiday.description.toLowerCase().includes(searchTerm))
    );

    if (filtered.length === 0) {
      holidayDiv.innerHTML = "<p class='no-holidays'>No holidays match your search.</p>";
      return;
    }

    let html = `<h3>Holidays (${filtered.length} found):</h3>`;
    html += filtered.map(holiday => {
      const isToday = holiday.date.iso === today;
      const itemClass = isToday ? "holiday-item today" : "holiday-item";
      return `
        <div class="${itemClass}">
          <strong>${holiday.name}</strong> (${holiday.date.iso})<br/>
          ${holiday.description || 'No description available.'}
        </div>
      `;
    }).join("");
    holidayDiv.innerHTML = html;

  } catch (error) {
    loadingDiv.style.display = "none";
    holidayDiv.innerHTML = "Error fetching holidays. Please try again.";
    console.error(error);
  }
}

function downloadCSV() {
  const holidayDiv = document.getElementById("holidays");
  if (!holidayDiv.innerText.trim()) return alert("No data to download!");

  const rows = [["Name", "Date", "Description"]];
  document.querySelectorAll(".holiday-item").forEach(item => {
    const lines = item.innerText.split("\n");
    const nameDate = lines[0].split("(");
    const name = nameDate[0].trim();
    const date = nameDate[1]?.replace(")", "").trim() || "";
    const desc = lines[1] || "";
    rows.push([name, date, desc]);
  });

  const csvContent = rows.map(row =>
    row.map(col => `"${col.replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "holidays.csv";
  link.click();
}

function toggleTheme() {
  document.body.classList.toggle("light");
}
