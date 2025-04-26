const loginForm = document.getElementById("loginForm");

async function insertIntoLogin(user, pass) {
  console.log("Username = ", user);
  console.log("Password = ", pass);

  sessionStorage.setItem("username", user);
  sessionStorage.setItem("password", pass);

  const data = await axios.post("http://localhost:3000/user/login", {
    username: user,
    password: pass,
  });
  console.log(data.data);
  if (data.data === "UserFound") {
    alert("User Found");
    window.location.href = "./index.html";
  } else {
    console.log(user, pass);
    alert("New User , Redirecting to Profile Register Page");
    window.location.href = "./profile.html";
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    e.preventDefault();
    insertIntoLogin(user, pass);
  });
}
