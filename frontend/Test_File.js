
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
    username,
  ) {
    super(coords);
    this.distance = distance;
    this.calories = this.calcCalories();
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
    username,
  ) {
    super(coords);
    this.distance = distance;
    this.calories = this.calcCalories();
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
    username,
  ) {
    super();
    this.distance = distance;
    this.calories = this.calcCalories();
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
    username,
  ) {
    super();
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
      console.log(distanceLabel.textContent)
      // Toggle visibility based on the selected type
      if (workoutType === "homeworkout") {
        distanceLabel.textContent= "Type";
        lapsLabel.textContent = "Sets";
     } else {
       distanceLabel.textContent = "Distance";
       durationLabel.textContent = "Duration";
     }
      if (workoutType === "swimming" || workoutType === "homeworkout") {
        inputElevation.closest(".form__row")
          .classList.remove("form__row--hidden");
        // inputCadence.closest(".form__row").classList.add("form__row--hidden");
      } else{
        inputElevation.closest(".form__row").classList.add("form__row--hidden");
        inputCadence.closest(".form__row").classList.remove("form__row--hidden");
      }
    
    });
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
      if (
        !Number.isFinite(distance) ||
        !Number.isFinite(duration)  
      )
        return alert("Inputs must be Positive Numbers!");
      workout = new Cycling([lat, lng], distance, 0, duration, "NO", CurrUser);
      workout.speed = distance / (duration / 60); // Calculate speed (km/h)
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
      workout = new HomeWorkout(workoutType, sets, duration, "NO", CurrUser);
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
    const icon = getWorkoutIcon(workout.type)
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}
        <button class = "close_button">❌</h2>
        <div class="workout__details">
          <span class="workout__icon">${icon}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        <div class="workout__details">
          <input type="checkbox" class="workout__checkbox" id="completed" ${workout.completed === "YES" ? "checked" : ""}>`;

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
    if (type === "running" || type === "cycling") {
      const response = await axios.post("http://localhost:3000/user/cardio", workout);
      console.log(response.data);
      if (response.data === "Values Inserted into Cardio Table") {
        alert("Workout is Saved Successfully!")
      } else {
        alert("Error saving profile. Please try again.");
      }
    }
  }
  async getlocalStorage(CurrUser) {
    const cardio = await axios.get("http://localhost:3000/user/getcardio" ,{
      username : CurrUser
    });
    console.log(cardio.data);
    const cardioworkouts = cardio.data;
    cardioworkouts.forEach((workout) => {
      this.renderWorkout(workout);
    });
    const swim = await axios.get("http://localhost:3000/user/getswim" , CurrUser);
    console.log(swim.data);
    const swimworkouts = swim.data;
    swimworkouts.forEach((workout) => {
      this.renderWorkout(workout);
    });
    const home = await axios.get("http://localhost:3000/user/gethome" , CurrUser);
    console.log(home.data);
    const homeworkouts = home.data;
    homeworkouts.forEach((workout) => {
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

const app = new App();
