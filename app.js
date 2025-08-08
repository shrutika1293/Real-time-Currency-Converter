const API_KEY = "62de1ecd86ac5378c32f194e";  // Replace with your actual API key from ExchangeRate-API
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const fromCurrency = fromCurr.value;
  const toCurrency = toCurr.value;

  const URL = `${BASE_URL}${fromCurrency}`;

  try {
    // Fetching exchange rate data from ExchangeRate-API
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rate. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);  // Log the entire API response to see what is being returned

    // Now check if the conversion data is in the response
    const exchangeRate = data.conversion_rates[toCurrency];

    if (exchangeRate) {
      const finalAmount = (amtVal * exchangeRate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
    } else {
      throw new Error("Conversion rate not available.");
    }
  } catch (error) {
    msg.innerText = `Error fetching exchange rate: ${error.message}. Please try again.`;
    console.error("Error details:", error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  if (!countryCode) {
    console.error(`Country code for ${currCode} not found.`);
    return;
  }
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  } else {
    console.error("Flag image element not found.");
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
