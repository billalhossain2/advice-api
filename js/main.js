const selectElementById = (id) => document.getElementById(id);

const adviceDisplay = selectElementById("advice-display");

//Show Message
const showMsg = (status, errorMsg) => {
  if (status === "LOADING") {
    adviceDisplay.innerHTML = `
  <div class="spinner" id="spinner">
    <img width="100px" height="100px" src="img/Spinner.gif" alt="Spinner Img">
  </div>
    `;
  } else if (status === "NETWORK_ERROR") {
    adviceDisplay.innerHTML = `<div class="error-container"><h3>${errorMsg}</h3><h4>Please check your internet connection!</h4></div>`;
  } else if (status === "RESPONSE_ERROR") {
    adviceDisplay.innerHTML = `<div class="error-container"><h3>${errorMsg} !</h3></div>`;
  } else if (status === "SUCCESS") {
    adviceDisplay.innerHTML = "";
  }
};

const getDynamicAdvice = async (endpoint) => {
  //Base API
  const BASE_URL = `https://api.adviceslip.com`;
  try {
    //Clear Previous Data
    adviceDisplay.innerHtml = "";
    showMsg("LOADING");
    const response = await fetch(`${BASE_URL}/${endpoint}`);
    const data = await response.json();
    data.message ? showMsg("RESPONSE_ERROR", data.message.text) : displayAdvice(data);
  } catch (error) {
    showMsg("NETWORK_ERROR", error.message);
  }
};

const displayAdvice = (advice) =>{
  if(Array.isArray(advice.slips)){
    adviceDisplay.innerHTML = "";
    const ul = document.createElement('ul');
    advice.slips.forEach(slip => ul.innerHTML += `<li style ="padding: 10px 0;">${slip.advice}</li>`)
    adviceDisplay.appendChild(ul);
    return;
  }
  adviceDisplay.innerHTML = `<p style="text-align:center; padding-top: 50px">${advice.slip.advice}</p>`;
}

const adviceButtonsContainer = selectElementById("advice-buttons-container");
adviceButtonsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    switch (event.target.innerText) {
      case "Advice By Id": {
        const adviceId = selectElementById("advice-id-input-field").value;
        adviceId
          ? getDynamicAdvice(`advice/${adviceId}`)
          : alert("Please enter id");
        return;
      }
      case "Get Random Advice": {
        getDynamicAdvice("advice");
        return;
      }
      case "Advice By Keyword": {
        const adviceKeyword = selectElementById(
          "advice-keyword-input-field"
        ).value;
        adviceKeyword
          ? getDynamicAdvice(`advice/search/${adviceKeyword}`)
          : alert("Please enter keyword");
        return;
      }
      default:{
        console.log("Not matched!")
      }
    }
  }
});

getDynamicAdvice("advice");
