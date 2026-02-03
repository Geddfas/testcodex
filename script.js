const vacations = [
  {
    country: "Nederland",
    name: "Meivakantie",
    start: "2024-04-27",
    end: "2024-05-05",
  },
  {
    country: "Nederland",
    name: "Zomervakantie",
    start: "2024-07-06",
    end: "2024-08-18",
  },
  {
    country: "België",
    name: "Paasvakantie",
    start: "2024-04-01",
    end: "2024-04-14",
  },
  {
    country: "België",
    name: "Zomervakantie",
    start: "2024-07-01",
    end: "2024-08-31",
  },
  {
    country: "Duitsland",
    name: "Osterferien",
    start: "2024-03-25",
    end: "2024-04-06",
  },
  {
    country: "Duitsland",
    name: "Sommerferien",
    start: "2024-07-15",
    end: "2024-08-23",
  },
  {
    country: "Frankrijk",
    name: "Vacances de printemps",
    start: "2024-04-06",
    end: "2024-04-22",
  },
  {
    country: "Frankrijk",
    name: "Vacances d'été",
    start: "2024-07-06",
    end: "2024-09-02",
  },
  {
    country: "Spanje",
    name: "Semana Santa",
    start: "2024-03-25",
    end: "2024-04-01",
  },
  {
    country: "Spanje",
    name: "Vacaciones de verano",
    start: "2024-06-24",
    end: "2024-09-08",
  },
];

const countrySelect = document.getElementById("countrySelect");
const filterForm = document.getElementById("filterForm");
const resultsGrid = document.getElementById("resultsGrid");
const summary = document.getElementById("summary");

const buildCountryOptions = () => {
  const countries = Array.from(new Set(vacations.map((item) => item.country)));
  countrySelect.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Alle landen";
  countrySelect.appendChild(allOption);

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const isOverlapping = (rangeStart, rangeEnd, vacation) => {
  const start = new Date(vacation.start);
  const end = new Date(vacation.end);
  return start <= rangeEnd && end >= rangeStart;
};

const renderResults = (items, rangeStart, rangeEnd, country) => {
  resultsGrid.innerHTML = "";

  if (items.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty";
    emptyState.textContent =
      "Geen vakanties gevonden binnen deze periode. Probeer een andere datum of een ander land.";
    resultsGrid.appendChild(emptyState);
    summary.textContent = "0 vakanties gevonden.";
    return;
  }

  summary.textContent = `${items.length} vakantie(s) gevonden voor ${
    country === "all" ? "alle landen" : country
  } tussen ${formatDate(rangeStart.toISOString())} en ${formatDate(
    rangeEnd.toISOString()
  )}.`;

  items.forEach((vacation) => {
    const card = document.createElement("article");
    card.className = "card";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = vacation.country;

    const title = document.createElement("h3");
    title.textContent = vacation.name;

    const dates = document.createElement("p");
    dates.className = "dates";
    dates.textContent = `${formatDate(vacation.start)} - ${formatDate(
      vacation.end
    )}`;

    card.append(badge, title, dates);
    resultsGrid.appendChild(card);
  });
};

const handleSubmit = (event) => {
  event.preventDefault();
  const startValue = document.getElementById("startDate").value;
  const endValue = document.getElementById("endDate").value;
  const selectedCountry = countrySelect.value;

  if (!startValue || !endValue) {
    summary.textContent = "Selecteer een start- en einddatum.";
    return;
  }

  const rangeStart = new Date(startValue);
  const rangeEnd = new Date(endValue);

  if (rangeStart > rangeEnd) {
    summary.textContent = "De startdatum moet vóór de einddatum liggen.";
    return;
  }

  const filtered = vacations.filter((vacation) => {
    const matchesCountry =
      selectedCountry === "all" || vacation.country === selectedCountry;
    return matchesCountry && isOverlapping(rangeStart, rangeEnd, vacation);
  });

  renderResults(filtered, rangeStart, rangeEnd, selectedCountry);
};

buildCountryOptions();
filterForm.addEventListener("submit", handleSubmit);
