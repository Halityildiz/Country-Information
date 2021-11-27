const form = document.querySelector(".form");
// const update = document.querySelector("#update");
// console.log(update);
const input = document.querySelector(".input");
// console.log(input);
// update.addEventListener("click", (e) => {
//   e.preventDefault();
//   e.target.parentElement.parentElement.nextElementSibling.style.display =
//     "none";
// });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // input.value = "";
  showCountryWithNeighbours();
});

const renderCountry = (data, className = "") => {
  const {
    name: { common: countryName },
    region,
    capital,
    flags: { svg: countryFlag },
    population,
    languages,
    currencies,
  } = data;

  const countryElm = document.querySelector(".countries");
  const htmlContent = `
    <div class="country ${className}">
      <img class="country__img" src="${countryFlag}" />
      <div class="country__data">
        <h3 class="country__name">${countryName}</h3>
        <h4 class="country__region">${region}</h4>
        <p class="country__row">
                <span><i class="fas fa-2x fa-landmark"></i></span>${capital}</p>
        <p class="country__row"> <span><i class="fas fa-lg fa-users"></i></span>${(
          +population / 1_000_000
        ).toFixed(1)}M People</p>
        <p class="country__row"><span><i class="fas fa-lg fa-comments"></i></span>${Object.values(
          languages
        )}</p>
        <p class="country__row"><span><i class="fas fa-lg fa-money-bill-wave"></i></span>${
          Object.values(currencies)[0].name
        } <strong>${Object.values(currencies)[0].symbol}</strong>
        </p>
      </div>
    </div>
    `;
  countryElm.insertAdjacentHTML("beforeend", htmlContent);
  countryElm.style.opacity = 1;
};

const getCountryDataByName = async (countryName) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );
    if (!response.ok) throw new Error(`Something is wrong! ${response.status}`);
    const data = await response.json();
    return data[0];
  } catch (error) {
    renderError(error.message);
    console.log(error);
  } finally {
  }
};

const showCountry = async () => {
  let countryName = input.value;
  try {
    const countryData = await getCountryDataByName(countryName);
    renderCountry(countryData);
  } catch (error) {
    renderError(error.message);
    console.log(error);
  }
  form.reset();
  input.focus();
};

// showCountry("Turkey");

const getCountryDataByCode = async (countryCode) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    if (!response.ok) throw new Error(`something is wrong! ${response.status}`);
    const data = await response.json();
    // const [countryData] = data;
    return data[0];
    // return countryData;
  } catch (error) {
    renderError(error.message);
    console.log(error.message);
  } finally {
    // always executed
    // console.log('try catch block finished either successfully or with failures');
  }
};

const showCountryWithNeighbours = async () => {
  let countryName = input.value;
  try {
    const countryData = await getCountryDataByName(countryName);
    renderCountry(countryData);
    const neighbours = countryData.borders;
    if (!neighbours) throw new Error("I am sorry 🤷‍♀️..No neighbours..");
    neighbours.forEach(async (neighbour) => {
      const country = await getCountryDataByCode(neighbour);
      renderCountry(country, "neighbour");
    });
    /*     const neighbour = neighbours[0];
    const neighbourData = await getCountryDataByCode(neighbour);
    renderCountry(neighbourData, 'neighbour'); */
  } catch (error) {
    renderError(error.message);
    // console.log(error);
  }
  form.reset();
  input.focus();
};

const renderError = (message) => {
  const countryElm = document.querySelector(".msg");
  countryElm.innerHTML += message;
  countryElm.style.opacity = 1;
};
