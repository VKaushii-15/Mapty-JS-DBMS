export let user;
export let pass;
async function insertIntoLogin() {
  user = document.getElementById("username").value;
  pass = document.getElementById("password").value;

  console.log(user);
  console.log(pass);

  const data = await axios.post("http://localhost:3000/user/login", {
    username: user,
    password: pass,
  });
  console.log(data.data);
  if (data.data === "UserFound") {
    alert("User Found");
    user = username;
    pass = password;
    window.location.href = "./index.html";
  } else {
    alert("New User , Redirecting to Profile Register Page");
    window.location.href = "./profile.html";
  }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  insertIntoLogin();
});
