let currentUser = null;

// LOGIN (PHONE + METER + OPTIONAL EMAIL)
function login() {
  const phone = document.getElementById("phone").value;
  const meter = document.getElementById("meter").value;
  const email = document.getElementById("email").value;

  if (!phone || !meter) {
    msg.innerText = "Phone and Meter number required";
    return;
  }

  // create user key
  const userKey = phone + "_" + meter;

  // create user if not exists
  if (!localStorage.getItem(userKey)) {
    localStorage.setItem(userKey, JSON.stringify({
      phone,
      meter,
      email: email || "Not provided",
      units: 0,
      balance: 100,
      history: []
    }));
  }

  currentUser = userKey;

  authCard.classList.add("hidden");
  dashboard.classList.remove("hidden");

  loadUser();
}

// LOAD USER DATA
function loadUser() {
  const user = JSON.parse(localStorage.getItem(currentUser));

  userPhone.innerText = user.phone;
  userMeter.innerText = user.meter;

  units.innerText = user.units;
  balance.innerText = user.balance;

  loadHistory();
}

// BUY TOKEN
function buyToken() {
  const amount = document.getElementById("amount").value;

  if (!amount || amount <= 0) {
    alert("Enter valid amount");
    return;
  }

  const user = JSON.parse(localStorage.getItem(currentUser));

  const token = "KPLC-" + Math.floor(100000000 + Math.random() * 900000000);

  user.balance += Math.floor(amount / 10);

  user.history.push({
    type: "Purchase",
    token,
    amount,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(currentUser, JSON.stringify(user));

  loadUser();
}

// SIMULATE USAGE
function simulateUsage() {
  const user = JSON.parse(localStorage.getItem(currentUser));

  if (user.balance <= 0) {
    alert("No balance left!");
    return;
  }

  user.units += 5;
  user.balance -= 5;

  user.history.push({
    type: "Usage",
    detail: "-5 kWh consumed",
    date: new Date().toLocaleString()
  });

  localStorage.setItem(currentUser, JSON.stringify(user));

  loadUser();
}

// LOAD HISTORY
function loadHistory() {
  const user = JSON.parse(localStorage.getItem(currentUser));
  const container = document.getElementById("history");

  container.innerHTML = "";

  user.history.forEach(h => {
    const div = document.createElement("div");
    div.className = "historyItem";

    div.innerHTML = `
      <strong>${h.type}</strong><br>
      ${h.token ? "Token: " + h.token + "<br>" : ""}
      ${h.amount ? "KES " + h.amount + "<br>" : ""}
      ${h.detail ? h.detail + "<br>" : ""}
      <small>${h.date}</small>
    `;

    container.appendChild(div);
  });
}

// LOGOUT
function logout() {
  location.reload();
}