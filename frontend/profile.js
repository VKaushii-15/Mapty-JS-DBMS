const username = sessionStorage.getItem("username");
const password = sessionStorage.getItem("password");

async function ProfileInsert() {
  const profileData = {
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    bmi: document.getElementById("bmi").value,
    username: username,
    password: password,
  };
  console.log(profileData);
  const response = await axios.post(
    "http://localhost:3000/user/register",
    profileData
  );
  console.log(response.data);
  if (response.data === "Values Inserted into Login & Profile Table") {
    alert("Profile saved successfully!...Enter your login credentials");
    window.location.href = "./login.html";
  } else {
    alert("Error saving profile. Please try again.");
  }
}

document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  ProfileInsert();
  alert("✅ Profile saved successfully!");
});
