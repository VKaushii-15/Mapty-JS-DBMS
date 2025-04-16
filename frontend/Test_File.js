// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginButton = document.querySelector(".login-button");

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const close_button = document.querySelector(".close_button");

import { user } from "./Login.js";

let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
  setdescription() {
    //prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //prettier-ignore
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
  calcCalories() {
    if (this.type === "running") this.calories = this.distance * 0.75 * 60;
    if (this.type === "cycling") this.calories = this.distance * 0.5 * 60;
    if (this.type === "swimming") this.calories = this.distance * 0.8 * 60;
    if (this.type === "homeworkout") this.calories = this.distance * 0.5 * 60;
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
    username = "user"
  ) {
    super(coords);
    this.distance = distance;
    this.calories = calories;
    this.duration = duration;
    this.completed = completed;
    this.username = username;
    this.setdescription();
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
    username = "user"
  ) {
    super(coords);
    this.distance = distance;
    this.calories = calories;
    this.duration = duration;
    this.completed = completed;
    this.username = username;
    this.setdescription();
  }
}

class Swimming extends Workout {
  type = "swimming";
  constructor(
    distance,
    calories,
    laps,
    duration,
    completed = "NO",
    username = "user"
  ) {
    super();
    this.distance = distance;
    this.calories = calories;
    this.laps = laps;
    this.duration = duration;
    this.completed = completed;
    this.username = username;
    this.setdescription();
  }
}

class HomeWorkout extends Workout {
  type = "homeworkout";
  constructor(
    workoutType,
    sets,
    duration,
    completed = "NO",
    username = "user"
  ) {
    super(coords);
    this.types = workoutType; // Like "Push-ups" or "Squats"
    this.sets = sets;
    this.duration = duration;
    this.completed = completed;
    this.username = username;
    this.setdescription();
  }
}

class App {
  #map;
  #mapEvent;
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
      // Toggle visibility based on the selected type
      if (workoutType === "swimming") {
        inputElevation
          .closest(".form__row")
          .classList.remove("form__row--hidden");
        inputCadence.closest(".form__row").classList.add("form__row--hidden");
      } else {
        inputElevation.closest(".form__row").classList.add("form__row--hidden");
        inputCadence
          .closest(".form__row")
          .classList.remove("form__row--hidden");
      }
    });
    containerWorkouts.addEventListener("click", this.moveToPopup.bind(this));
    this.getlocalStorage();
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
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === "running") {
      if (!Number.isFinite(distance) || !Number.isFinite(duration))
        return alert("Inputs must be Positive Numbers!");
      workout = new Running([lat, lng], distance, 0, duration, "NO", "user");
      this.renderWorkoutMarker(workout);
      this.renderWorkout(workout);
    }

    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(elevation)
      )
        return alert("Inputs must be Positive Numbers!");
      workout = new Cycling([lat, lng], distance, 0, duration, "NO", "user");
      workout.speed = distance / (duration / 60); // Calculate speed (km/h)
      this.renderWorkoutMarker(workout);
      this.renderWorkout(workout);
    }

    if (type === "swimming") {
      const laps = +inputElevation.value; // Assuming laps are entered in the elevation field
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration) ||
        !Number.isFinite(laps)
      )
        return alert("Inputs must be Positive Numbers!");
      workout = new Swimming(distance, 0, laps, duration, "NO", "user");
      this.renderWorkout(workout);
    }

    if (type === "homeworkout") {
      const workoutType = inputCadence.value; // Assuming workout type is entered in cadence field
      const sets = +inputElevation.value; // Assuming sets are entered in elevation field
      if (!workoutType || !Number.isFinite(sets) || !Number.isFinite(duration))
        return alert("Inputs must be valid!");
      workout = new HomeWorkout(workoutType, sets, duration, "NO", "user");
      this.renderWorkout(workout);
    }
    this.#workout.push(workout);
    console.log(workout);
    this.hideForm();
    this.setlocalStorage();
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
            color: Workout.type === "running" ? "green" : "orange",
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
      .setPopupContent(
        `${Workout.type === "running" ? "🏃" : "🚴"} ${Workout.description}`
      )
      .openPopup();
  }
  catch(error) {
    console.error("Error in renderWorkoutMarker:", error);
  }

  renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}
        <button class = "close_button">❌</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === "running" ? "🏃" : "🚴"
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>`;

    // if (workout.type === "running")
    //   html += `
    //     <div class="workout__details">
    //       <span class="workout__icon">⚡️</span>
    //       <span class="workout__value">${workout.pace.toFixed(1)}</span>
    //       <span class="workout__unit">min/km</span>
    //     </div>
    //     <div class="workout__details">
    //       <span class="workout__icon">🦶🏼</span>
    //       <span class="workout__value">${workout.cadence}</span>
    //       <span class="workout__unit">spm</span>
    //     </div>
    //   </li>
    //  `;
    // if (workout.type === "cycling")
    //   html += `
    //     <div class="workout__details">
    //       <span class="workout__icon">⚡️</span>
    //       <span class="workout__value">${workout.speed.toFixed(1)}</span>
    //       <span class="workout__unit">km/h</span>
    //     </div>
    //     <div class="workout__details">
    //       <span class="workout__icon">🏔️</span>
    //       <span class="workout__value">${workout.elevationGain}</span>
    //       <span class="workout__unit">m</span>
    //     </div>
    //   </li>`;
    form.insertAdjacentHTML("afterend", html);
  }
  moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;
    const workout = this.#workout.find(
      (work) => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, 17, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
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
  async setlocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workout));
  }
  getlocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;

    this.#workout = data;
    this.#workout.forEach((work) => {
      this.renderWorkout(work);
    });
  }
}

const app = new App();
