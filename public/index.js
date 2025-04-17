const BASE_URL = "/api/exchange-rate";  // Pointing to our server API

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdown) {
    for (currCode in countryList) {
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
    let amount = document.querySelector(".ammount input");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;

    try {
        const response = await fetch(`${BASE_URL}?from=${fromCurrency}&to=${toCurrency}`);
        const data = await response.json();

        if (data.error) {
            msg.innerText = "Error fetching exchange rates!";
        } else {
            // Get the rate from the backend response
            let rate = data.rate; // data.rate is now the correct key
            let finalAmount = amtVal * rate;
            msg.innerText = `${amtVal} ${fromCurrency} = ${finalAmount} ${toCurrency}`;
        }
    } catch (error) {
        msg.innerText = "Error fetching exchange rates!";
    }
};


const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
