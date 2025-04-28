// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CurrUser = sessionStorage.getItem("username");

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const close_button = document.querySelector(".close_button");
const distanceLabel = document.getElementById("dist");
const durationLabel = document.getElementById("dura");
const lapsLabel = document.getElementById("laps");
const checkbox = document.querySelector(".workout__checkbox");

let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  // setdescription(type) {
  //   //prettier-ignore
  //   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  //   //prettier-ignore
  //   this.description = `${type[0].toUpperCase()}${type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  //   console.log(this.description);
  // }
  calcCalories(distance = 1, duration = 1, laps = 1, sets = 1) {
    if (this.type === "running") {
      this.calories = distance * 0.75 * duration;
    } else if (this.type === "cycling") {
      this.calories = distance * 0.5 * duration;
    } else if (this.type === "swimming") {
      this.calories = distance * laps * 0.8 * duration;
    } else if (this.type === "homeworkout") {
      this.calories = sets * 0.6 * duration;
    }
    return this.calories;
  }
}

class Running extends Workout {
  type = "running";
  constructor(
    coords,
    distance,
    calories,
    duration,
    completed = "NO",
    username
  ) {
    super(coords);
    this.distance = distance;
    this.calories = this.calcCalories(distance, duration);
    this.duration = duration;
    this.completed = completed;
    this.username = username;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(
    coords,
    distance,
    calories,
    duration,
    completed = "NO",
    username
  ) {
    super(coords);
    this.distance = distance;
    this.calories = this.calcCalories(distance, duration);
    this.duration = duration;
    this.completed = completed;
    this.username = username;
  }
}

class Swimming extends Workout {
  type = "swimming";
  constructor(distance, calories, laps, duration, completed = "NO", username) {
    super();
    this.distance = distance;
    this.laps = laps;
    this.calories = this.calcCalories(distance, duration, laps);
    this.duration = duration;
    this.completed = completed;
    this.username = username;
  }
}

class HomeWorkout extends Workout {
  type = "homeworkout";
  constructor(
    workoutType,
    calories,
    sets,
    duration,
    completed = "NO",
    username
  ) {
    super();
    this.types = workoutType; // Like "Push-ups" or "Squats"
    this.sets = sets;
    this.calories = this.calcCalories(duration, sets); // Assuming calories are calculated based on the workout type and duration
    this.duration = duration;
    this.completed = completed;
    this.username = username;
  }
}

class App {
  #map;
  #mapEvent;
  #CurrUser = CurrUser;
  #workout = [];
  #CurrLat;
  #Currlong;
  #mapzoomlevel = 13;
  constructor() {
    this.getPosition();
    form.addEventListener("submit", this.newWorkout.bind(this));
    inputType.addEventListener("change", function () {
      // Get the current selected value
      const workoutType = inputType.value;
      console.log("workout type = ", workoutType);
      // Toggle visibility based on the selected type
      if (workoutType === "homeworkout") {
        distanceLabel.textContent = "Type";
        lapsLabel.textContent = "Sets";
      } else {
        distanceLabel.textContent = "Distance";
        durationLabel.textContent = "Duration";
      }
      if (workoutType === "swimming" || workoutType === "homeworkout") {
        inputElevation
          .closest(".form__row")
          .classList.remove("form__row--hidden");
        // inputCadence.closest(".form__row").classList.add("form__row--hidden");
      } else {
        inputElevation.closest(".form__row").classList.add("form__row--hidden");
        inputCadence.classList.remove("form__row--hidden");
      }
    });
    containerWorkouts.addEventListener("change", (e) => {
      const storedWorkouts = JSON.parse(localStorage.getItem("workouts")) || [];
      console.log("Stored workouts: ", storedWorkouts);
      const workoutEl = e.target.closest(".workout");
      const workoutId = workoutEl.dataset.id;
      const workout = storedWorkouts.find((work) => work.id === workoutId);

      if (!workout) console.log("Workout not found in localStorage.");

      if (workout) {
        workout.completed = e.target.checked ? "YES" : "NO";
      } else {
        console.error("Workout not found for the given ID.");
      }
      console.log(`Workout ${workoutId}, ${workoutEl.dataset.type} completed status: ${workout.completed}`);

      // Update localStorage with the modified workout
      localStorage.setItem("workouts", JSON.stringify(storedWorkouts));
    });
    console.log("CurrUser = ", CurrUser);
    this.getlocalStorage(CurrUser);
  }
  getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.loadmap.bind(this),
        function () {
          alert("Could not get your position");
        }
      );
  }

  //Insert Login

  loadmap(position) {
    this.#CurrLat = position.coords.latitude;
    this.#Currlong = position.coords.longitude;
    console.log(this.#CurrLat, this.#Currlong);
    this.#map = L.map("map").setView(
      [this.#CurrLat, this.#Currlong],
      this.#mapzoomlevel
    );
    //prettier-ignore
    L.marker([this.#CurrLat, this.#Currlong])
      .addTo(this.#map)
      .bindPopup("Your Home")
      .openPopup();
    L.tileLayer("https://tile.osm.org/{z}/{x}/{y}.png").addTo(this.#map);
    this.#map.on("click", this.showForm.bind(this));
    this.#workout.forEach((work) => {
      this.renderWorkoutMarker(work);
    });
  }
  showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
  }
  hideForm() {
    inputDistance.value = inputDuration.value = inputElevation.value = "";
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }
  newWorkout(e) {
    e.preventDefault();
    const type = inputType.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === "running") {
      const distance = +inputDistance.value;
      const duration = +inputDuration.value;
      if (!Number.isFinite(distance) || !Number.isFinite(duration))
        return alert("Inputs must be Positive Numbers!");
      workout = new Running([lat, lng], distance, 0, duration, "NO", CurrUser);
      this.renderWorkoutMarker(workout);
      this.renderWorkout(workout);
    }

    if (type === "cycling") {
      const distance = +inputDistance.value;
      const duration = +inputDuration.value;
      if (!Number.isFinite(distance) || !Number.isFinite(duration))
        return alert("Inputs must be Positive Numbers!");
      workout = new Cycling([lat, lng], distance, 0, duration, "NO", CurrUser);
      this.renderWorkoutMarker(workout);
      this.renderWorkout(workout);
    }

    if (type === "swimming") {
      const distance = +inputDistance.value;
      const duration = +inputDuration.value;
      const laps = +inputElevation.value; // Assuming laps are entered in the elevation field
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(laps)
      )
        return alert("Inputs must be Positive Numbers!");
      workout = new Swimming(distance, 0, laps, duration, "NO", CurrUser);
      this.renderWorkout(workout);
    }

    if (type === "homeworkout") {
      const workoutType = inputDistance.value;
      const duration = +inputDuration.value; // Assuming workout type is entered in cadence field
      const sets = +inputElevation.value; // Assuming sets are entered in elevation field
      console.log(workoutType, duration, sets);
      if (!workoutType || !Number.isFinite(sets) || !Number.isFinite(duration))
        return alert("Inputs must be valid!");
      const calories = sets * 0.6 * duration; // Calculate calories for HomeWorkout
      workout = new HomeWorkout(
        workoutType,
        calories,
        sets,
        duration,
        "NO",
        CurrUser
      );
      this.renderWorkout(workout);
    }
    this.#workout.push(workout);
    console.log(workout);
    this.hideForm();
    this.setlocalStorage(workout);
  }
  renderWorkoutMarker(Workout) {
    const control = new L.Routing.Control({
      waypoints: [
        L.latLng(this.#CurrLat, this.#Currlong),
        L.latLng(Workout.coords[0], Workout.coords[1]),
      ],
      routeWhileDragging: true,
      show: false,
      addWaypoints: false,
      lineOptions: {
        styles: [
          {
            color: Workout.type === getWorkoutColour(Workout.type),
            opacity: 1,
            weight: 4,
          },
        ],
      },
    });
    control.addTo(this.#map);
    L.marker(Workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${Workout.type}-popup`,
        })
      )
      .setPopupContent(`${getWorkoutIcon(Workout.type)} ${Workout.type}`)
      .openPopup();
  }
  catch(error) {
    console.error("Error in renderWorkoutMarker:", error);
  }

  renderWorkout(workout) {
    const icon = getWorkoutIcon(workout.type);
    let html = `
      <li class="workout workout--${workout.type}" 
          data-id="${workout.id}"
          data-type="${workout.type}"
          data-duration="${workout.duration}"
          ${
            workout.type === "homeworkout"
              ? `data-types="${workout.types}" data-sets="${workout.sets}"`
              : `data-distance="${workout.distance}"`
          }>
        <h2 class="workout__title">${getWorkoutTitle(workout.type)}</h2>
        ${
          workout.type === "homeworkout"
            ? `
            <div class="workout__details">
              <span class="workout__icon">${icon}</span>
              <span class="workout__value">${workout.types}</span>
              <span class="workout__unit">type</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🔄</span>
              <span class="workout__value">${workout.sets}</span>
              <span class="workout__unit">sets</span>
            </div>`
            : `
            <div class="workout__details">
              <span class="workout__icon">${icon}</span>
              <span class="workout__value">${workout.distance}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${workout.duration}</span>
              <span class="workout__unit">min</span>
            </div>`
        }
        <div class="workout__details">
          <span class="workout__icon">🔥</span>
          <span class="workout__value">${workout.calories}</span>
          <span class="workout__unit">kcal</span>
        </div>
        <div class="workout__details">
          <input type="checkbox" class="workout__checkbox" id="completed" 
            ${workout.completed === "YES" ? "checked" : ""}>
        </div>
      </li>`;

    form.insertAdjacentHTML("afterend", html);
  }
  removeOneWorkout(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;
    const workout = this.#workout.find(
      (work) => work.id === workoutEl.dataset.id
    );
    const index = this.#workout.indexOf(workout);
    console.log(index);
    localStorage.removeItem("workouts[index]");
    this.#workout.splice(index, 1);
    workoutEl.remove();
    this.setlocalStorage();
  }
  async setlocalStorage(workout) {
    const type = workout.type;
    let response;
    switch (type) {
      case "running":
        console.log("Workout passed to setlocalStorage: ", workout);
        response = await axios.post("http://localhost:3000/user/run", {
          workout,
        });
        break;
      case "cycling":
        console.log("Workout passed to setlocalStorage: ", workout);
        response = await axios.post("http://localhost:3000/user/cycling", {
          workout,
        });
        break;
      case "swimming":
        console.log("Workout passed to setlocalStorage: ", workout);
        response = await axios.post("http://localhost:3000/user/swim", {
          workout,
        });
        break;
      case "homeworkout":
        console.log("Workout passed to setlocalStorage: ", workout);
        response = await axios.post("http://localhost:3000/user/home", {
          workout,
        });
        break;
      default:
        console.error("Unknown workout type:", type);
        return;
    }
    console.log(response.data);
    if (response.data === "Values Inserted into Required Table") {
      alert("Workout is Saved Successfully!");
    } else {
      alert("Error saving your workout. Please try again.");
    }
    localStorage.setItem(
      "workouts",
      JSON.stringify(this.#workout.map(workout => ({ ...workout })))
    );
  }

  async getlocalStorage(CurrUser) {
    console.log("getlocalStorage called with username:", CurrUser);
    if (!CurrUser) {
      console.error("Error: username is undefined or null.");
      return;
    }
    const run = await axios.get(
      `http://localhost:3000/user/getrun?username=${CurrUser}`
    );
    const runworkouts = run.data;
    console.log(runworkouts);
    runworkouts.forEach((workout) => {
      workout.type = "running";
      this.renderWorkout(workout);
    });
    const cycling = await axios.get(
      `http://localhost:3000/user/getcycling?username=${CurrUser}`
    );
    const cyclingworkouts = cycling.data;
    console.log(cyclingworkouts);
    cyclingworkouts.forEach((workout) => {
      workout.type = "cycling";
      this.renderWorkout(workout);
    });

    const swim = await axios.get(
      `http://localhost:3000/user/getswim?username=${CurrUser}`
    );
    const swimworkouts = swim.data;
    console.log(swimworkouts);
    swimworkouts.forEach((workout) => {
      workout.type = "swimming";
      this.renderWorkout(workout);
    });
    const home = await axios.get(
      `http://localhost:3000/user/gethome?username=${CurrUser}`
    );
    const homeworkouts = home.data;
    console.log(homeworkouts);
    homeworkouts.forEach((workout) => {
      workout.type = "homeworkout";
      this.renderWorkout(workout);
    });
  }
}

function getWorkoutIcon(type) {
  switch (type) {
    case "running":
      return "🏃";
    case "cycling":
      return "🚴";
    case "swimming":
      return "🏊";
    case "homeworkout":
      return "🏋️";
    default:
      return "❓"; // Default icon for unknown workout types
  }
}

function getWorkoutColour(type) {
  switch (type) {
    case "running":
      return "green";
    case "cycling":
      return "orange";
    case "swimming":
      return "blue";
    case "homeworkout":
      return "purple";
    default:
      return "gray"; // Default color for unknown workout types
  }
}

function getWorkoutTitle(type) {
  switch (type) {
    case "running":
      return "Running";
    case "cycling":
      return "Cycling";
    case "swimming":
      return "Swimming";
    case "homeworkout":
      return "Home Workout";
    default:
      return "Unknown Workout"; // Default title for unknown workout types
  }
}
const app = new App();
