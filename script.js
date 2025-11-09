/*********************
  Mobile menu toggle
*********************/
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

if (menuBtn && mainNav) {
  menuBtn.addEventListener("click", () => {
    const visible = mainNav.getAttribute("data-visible") === "true";
    if (!visible) {
      mainNav.style.display = "flex";
      mainNav.setAttribute("data-visible", "true");
    } else {
      mainNav.style.display = "none";
      mainNav.setAttribute("data-visible", "false");
    }
  });

  function handleResize() {
    if (window.innerWidth <= 980) {
      mainNav.style.display = "none";
      mainNav.setAttribute("data-visible", "false");
    } else {
      mainNav.style.display = "flex";
      mainNav.setAttribute("data-visible", "true");
    }
  }
  handleResize();
  window.addEventListener("resize", handleResize);
}

/*********************
 Contact form handling
*********************/
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const formStatus = document.getElementById("formStatus");

// error elements
const errName = document.getElementById("err-name");
const errEmail = document.getElementById("err-email");
const errPhone = document.getElementById("err-phone");
const errMessage = document.getElementById("err-message");

// validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
function onlyDigitsCount(value) {
  return value.replace(/\D/g, "").length;
}

function clearErrors() {
  errName.textContent = "";
  errEmail.textContent = "";
  errPhone.textContent = "";
  errMessage.textContent = "";
  formStatus.textContent = "";
  formStatus.style.color = "";
}

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  clearErrors();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const phone = contactForm.phone.value.trim();
  const message = contactForm.message.value.trim();

  let valid = true;

  if (!name) {
    errName.textContent = "Name is required";
    valid = false;
  }
  if (!email) {
    errEmail.textContent = "Email is required";
    valid = false;
  } else if (!validateEmail(email)) {
    errEmail.textContent = "Enter a valid email";
    valid = false;
  }
  if (phone) {
    if (onlyDigitsCount(phone) < 6) {
      errPhone.textContent = "Enter a valid phone number";
      valid = false;
    }
  }
  if (!message) {
    errMessage.textContent = "Message is required";
    valid = false;
  } else if (message.length < 10) {
    errMessage.textContent = "Message must be at least 10 characters";
    valid = false;
  }

  if (!valid) {
    return;
  }

  // prepare payload
  const payload = { name, email, phone, message };

  // disable submit
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const res = await fetch("https://vernanbackend.ezlab.in/api/contact-us/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = null;
    try { data = await res.json(); } catch (err) { data = null; }

    if (res.ok) {
      formStatus.textContent = "Form Submitted";
      formStatus.style.color = "#065f46"; // green
      contactForm.reset();
    } else {
      formStatus.textContent = (data && data.message) ? data.message : "Something went wrong. Please try again.";
      formStatus.style.color = "#b91c1c"; // red
    }
  } catch (err) {
    formStatus.textContent = "Network error. Please try again.";
    formStatus.style.color = "#b91c1c";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});

resetBtn.addEventListener("click", () => {
  contactForm.reset();
  clearErrors();
});
