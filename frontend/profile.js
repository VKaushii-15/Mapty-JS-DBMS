import { pass, user } from "./Login.js";

async function ProfileInsert() {
  const profileData = {
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    bmi: document.getElementById("bmi").value,
    username: user,
    password: pass,
  };

  console.log(profileData);
  const response = await axios.post(
    "http://localhost:3000/user/register",
    profileData
  );
  console.log(response.data);
  if (response.data === "Values Inserted") {
    alert("Profile saved successfully!");
  } else {
    alert("Error saving profile. Please try again.");
  }
}

document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  ProfileInsert();
  console.log("Submitted profile:", profileData);
  alert("✅ Profile saved successfully!");
});
