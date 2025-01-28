let userData = {
  personal: {
    name: "",
    email: "",
    phone: "",
  },
  plans: {
    plan: "",
    billing: "",
  },
  addons: {
    onlineService: false,
    largerStorage: false,
    customizableProfile: false,
  },
  currentStep: 1,
};

const step__one = document.getElementById("one");
const step__two = document.getElementById("two");
const step__three = document.getElementById("three");
const step__four = document.getElementById("four");


const page__one = document.getElementById("step__one");
const page__two = document.getElementById("step__two");
const page__three = document.getElementById("step__three");
const page__four = document.getElementById("step__four");
const page__five = document.getElementById("step__five");

// Go from step one to step two
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const nameError = document.querySelector(".error__name");
const emailError = document.querySelector(".error__email");
const phoneError = document.querySelector(".error__phone");

page__one.addEventListener("submit", (e) => {
  e.preventDefault();

  // const nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)+$/;
  const nameRegex = /^[a-zA-Z]+[- ']{0,1}[a-zA-Z]+$/;
  const phoneRegex = /^\+1 \d{3} \d{3} \d{3}$/;

  if (!nameRegex.test(nameInput.value)) {
    nameError.textContent = "Invalid name. Please enter only letters, spaces, and hyphens.";
    nameInput.style.outline = "1px solid red";
    return;
  }

  if (nameInput.value === "") {
    nameInput.style.outline = "1px solid red";
    nameError.textContent = "Name is required";
    return;
  }

  if (emailInput.value === "") {
    nameError.textContent = "";
    nameInput.style.outline = "1px solid  var(--light-gray)";
    emailError.textContent = "Email is required";
    emailInput.style.outline = "1px solid red";
    return;
  }

  if (phoneInput.value === "") {
    nameError.textContent = "";
    nameInput.style.outline = "1px solid  var(--light-gray)";
    emailError.textContent = "";
    emailInput.style.outline = "1px solid  var(--light-gray)";
    phoneError.textContent = "Phone is required";
    phoneInput.style.outline = "1px solid red";
    return;
  }

  if (!phoneRegex.test(phoneInput.value)) {
    nameError.textContent = "";
    nameInput.style.outline = "1px solid  var(--light-gray)";
    emailError.textContent = "";
    emailInput.style.outline = "1px solid  var(--light-gray)";
    phoneError.textContent = "Invalid phone number. Please enter a valid phone number.";
    phoneInput.style.outline = "1px solid red";
    return;
  }

  nameError.textContent = "";
  nameInput.style.outline = "1px solid  var(--light-gray)";
  emailError.textContent = "";
  emailInput.style.outline = "1px solid  var(--light-gray)";
  phoneError.textContent = "";
  phoneInput.style.outline = "1px solid  var(--light-gray)";

  userData.personal.name = nameInput.value;
  userData.personal.email = emailInput.value;
  userData.personal.phone = phoneInput.value;
  userData.currentStep = 2;

  localStorage.setItem("userData", JSON.stringify(userData));

  step__one.classList.remove("active");
  step__two.classList.add("active");
  page__one.classList.add("hidden");
  page__two.classList.remove("hidden");
});

// Go back from step two to step one
const back__two = document.getElementById("back__two");
back__two.addEventListener("click", (e) => {
  e.preventDefault();


  step__two.classList.remove("active");
  step__one.classList.add("active");
  
  page__two.classList.add("hidden");
  page__one.classList.remove("hidden");
});

// Go from step two to step three

page__two.addEventListener("submit", (e) => {
  e.preventDefault();

  const plan = page__two.elements["plan"].value;
  const billing = document.getElementById("switch__toggle").checked ? "yearly" : "monthly";

  userData.plans.plan = plan;
  userData.plans.billing = billing;
  userData.currentStep = 3;

  localStorage.setItem("userData", JSON.stringify(userData));

  step__two.classList.remove("active");
  step__three.classList.add("active");
  page__two.classList.add("hidden");
  
  page__three.classList.remove("hidden");
});

// Go back from step three to step two
const back__three = document.getElementById("back__three");
back__three.addEventListener("click", (e) => {
  e.preventDefault();


  step__three.classList.remove("active");
  step__two.classList.add("active");
  
  page__three.classList.add("hidden");
  
  page__two.classList.remove("hidden");
});

// Go from step three to step four

page__three.addEventListener("submit", (e) => {
  e.preventDefault();

  const addon1 = document.getElementById("addon1").checked;
  const addon2 = document.getElementById("addon2").checked;
  const addon3 = document.getElementById("addon3").checked;

  userData.addons.onlineService = addon1;
  userData.addons.largerStorage = addon2;
  userData.addons.customizableProfile = addon3;
  userData.currentStep = 4;

  localStorage.setItem("userData", JSON.stringify(userData));

  step__three.classList.remove("active");
  step__four.classList.add("active");
  page__three.classList.add("hidden");
  
  page__four.classList.remove("hidden");

  generateSummary();
});

// Go back from step four to step three
const back__four = document.getElementById("back__four");
back__four.addEventListener("click", (e) => {
  e.preventDefault();


  step__four.classList.remove("active");
  step__three.classList.add("active");
  
  page__four.classList.add("hidden");
  
  page__three.classList.remove("hidden");

  const summary = document.getElementById("summary");
  summary.innerHTML = "";
  const addons = document.createElement("ul");
  addons.innerHTML = "";
  const plan = document.createElement("p");
  plan.innerHTML = "";
  // let total = 0;
});

const resetForm = () => {
  
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";


  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";

  
  nameInput.style.outline = "1px solid var(--light-gray)";
  emailInput.style.outline = "1px solid var(--light-gray)";
  phoneInput.style.outline = "1px solid var(--light-gray)";

  
  page__one.classList.remove("hidden");
  page__two.classList.add("hidden");
  page__three.classList.add("hidden");
  page__four.classList.add("hidden");
  page__five.classList.add("hidden");


  step__one.classList.add("active");
  step__two.classList.remove("active");
  step__three.classList.remove("active");
  step__four.classList.remove("active");

 
  userData = {
    personal: {
      name: "",
      email: "",
      phone: "",
    },
    plans: {
      plan: "",
      billing: "",
    },
    addons: {
      onlineService: false,
      largerStorage: false,
      customizableProfile: false,
    },
    currentStep: 1,
  };

    const planInputs = page__two.elements["plan"];
    planInputs[0].checked = true;
    planInputs[1].checked = false;
    planInputs[2].checked = false;
  
    document.getElementById("switch__toggle").checked = false;
  
    document.getElementById("addon1").checked = false;
    document.getElementById("addon2").checked = false;
    document.getElementById("addon3").checked = false;

  const summary = document.getElementById("summary");
    summary.innerHTML = "";
    const addons = document.createElement("ul");
    addons.innerHTML = "";
    const plan = document.createElement("p");
    plan.innerHTML = "";

  localStorage.clear();
};
page__four.addEventListener("submit", (e) => {
  e.preventDefault();
  
  page__four.classList.add("hidden");
  
  page__five.classList.remove("hidden");

  const mobile_main = document.querySelector("#step__five .mobile-main");
  mobile_main.style.position = "absolute";
  setTimeout(() => {
    localStorage.clear();
    resetForm();
    // window.location.reload();
  }, 3000);
});

const generateSummary = () => {
  const yearly = document.getElementById("switch__toggle");
  const summary = document.getElementById("summary");
  const plan = document.createElement("p");
  const change = document.createElement("div");
  change.id = "change";
  const addons = document.createElement("ul");

  let total = 0;

  if (yearly.checked) {
    if (userData.addons.onlineService) {
      addons.innerHTML += `<li class="addon"><span>Online service</span> <span class="addon__price">+$10/yr</span></li>`;
      total += 10;
    }

    if (userData.addons.largerStorage) {
      addons.innerHTML += `<li class="addon"><span>Larger storage</span> <span class="addon__price">+$20/yr</span></li>`;
      total += 20;
    }

    if (userData.addons.customizableProfile) {
      addons.innerHTML += `<li class="addon"><span>Customizable profile</span> <span class="addon__price">+$20/yr</span></li>`;
      total += 20;
    }

    switch (userData.plans.plan) {
      case "arcade":
        plan.innerHTML = `<span>Arcade (Yearly)</span> <span class="plan__price">$90/yr</span>`;
        total += 90;
        break;
      case "advanced":
        plan.innerHTML = `<span>Advanced (Yearly)</span> <span class="plan__price">$120/yr</span>`;
        total += 120;
        break;
      case "pro":
        plan.innerHTML = `<span>Pro (Yearly)</span> <span class="plan__price">$150/yr</span>`;
        total += 150;
        break;
      default:
        total;
    }

    document.getElementById("total").innerHTML = `<p><span>Total (per year)</span> <span class="total__price">$${total}/yr</span></p>`;
  } else {
    if (userData.addons.onlineService) {
      addons.innerHTML += `<li class="addon"><span>Online service</span> <span class="addon__price">+$1/mo</span></li>`;
      total += 1;
    }

    if (userData.addons.largerStorage) {
      addons.innerHTML += `<li class="addon"><span>Larger storage</span> <span class="addon__price">+$2/mo</span></li>`;
      total += 2;
    }

    if (userData.addons.customizableProfile) {
      addons.innerHTML += `<li class="addon"><span>Customizable profile</span> <span class="addon__price">+$2/mo</span></li>`;
      total += 2;
    }

    switch (userData.plans.plan) {
      case "arcade":
        plan.innerHTML = `<span>Arcade (Monthly)</span> <span class="plan__price">$9/mo</span>`;
        total += 9;
        break;
      case "advanced":
        plan.innerHTML = `<span>Advanced (Monthly)</span> <span class="plan__price">$12/mo</span>`;
        total += 12;
        break;
      case "pro":
        plan.innerHTML = `<span>Pro (Monthly)</span> <span class="plan__price">$15/mo</span>`;
        total += 15;
        break;
      default:
        total;
    }

    document.getElementById("total").innerHTML = `<p><span>Total (per month)</span> <span class="total__price">+$${total}/mo</span></p>`;
  }

  change.appendChild(plan);
  summary.appendChild(change);
  summary.appendChild(addons);

  const changePlanButton = document.createElement("button");
  changePlanButton.textContent = "Change";
  changePlanButton.id = "change-plan";
  change.appendChild(changePlanButton);

  changePlanButton.addEventListener("click", (e) => {
    e.preventDefault();
    step__four.classList.remove("active");
    step__two.classList.add("active");
    page__four.classList.add("hidden");
    page__two.classList.remove("hidden");

    const summary = document.getElementById("summary");
    summary.innerHTML = "";
    const addons = document.createElement("ul");
    addons.innerHTML = "";
    const plan = document.createElement("p");
    plan.innerHTML = "";
    // let total = 0;
  });
};

window.addEventListener("load", () => {
  let storedUserData = localStorage.getItem("userData");
  if (storedUserData) {
    userData = JSON.parse(storedUserData);

    nameInput.value = userData.personal.name;
    emailInput.value = userData.personal.email;
    phoneInput.value = userData.personal.phone;

    const planInput = page__two.elements["plan"];
    planInput.value = userData.plans.plan;
    if (userData.plans.billing === "yearly") {
      document.getElementById("switch__toggle").checked = true;
    }

    document.getElementById("addon1").checked = userData.addons.onlineService;
    document.getElementById("addon2").checked = userData.addons.largerStorage;
    document.getElementById("addon3").checked = userData.addons.customizableProfile;

    

    page__one.classList.add("hidden");
    page__two.classList.add("hidden");
    page__three.classList.add("hidden");
    page__four.classList.add("hidden");
    page__five.classList.add("hidden");
    step__one.classList.remove("active");

    const currentStep = userData.currentStep;
    switch (currentStep) {
      case 1:
        page__one.classList.remove("hidden");
        step__one.classList.add("active");
        break;
      case 2:
        page__two.classList.remove("hidden");
        step__two.classList.add("active");
        break;
      case 3:
        page__three.classList.remove("hidden");
        step__three.classList.add("active");
        break;
      case 4:
        page__four.classList.remove("hidden");
        step__four.classList.add("active");
        generateSummary();
        console.log("hello");
        break;
      default:
        page__one.classList.remove("hidden");
        step__one.classList.add("active");
    }
  } else {
    page__one.classList.remove("hidden");
    step__one.classList.add("active");
  }
});