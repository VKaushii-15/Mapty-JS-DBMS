"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map, mapEvent;

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
class Swimming extends Workout {
  type = "swimming";
  constructor(coords, distance, duration, laps) {}
}

class App {
  #map;
  #mapEvent;
  #workout = [];
  #CurrLat;
  #Currlong;
  constructor() {
    this.getPosition();
    form.addEventListener("submit", this.newWorkout.bind(this));
    inputType.addEventListener("change", function () {
      inputElevation
        .closest(".form__row")
        .classList.toggle("form__row--hidden");
      inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    });
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
  loadmap(position) {
    this.#CurrLat = position.coords.latitude;
    this.#Currlong = position.coords.longitude;
    console.log(this.#CurrLat, this.#Currlong);
    this.#map = L.map("map").setView([this.#CurrLat, this.#Currlong], 15);
    //prettier-ignore
    L.marker([this.#CurrLat, this.#Currlong])
      .addTo(this.#map)
      .bindPopup("Your Home")
      .openPopup();
    L.tileLayer("https://tile.osm.org/{z}/{x}/{y}.png").addTo(this.#map);
    this.#map.on("click", this.showForm.bind(this));
  }
  showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
  }
  newWorkout(e) {
    e.preventDefault();
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !Number.isFinite(cadence) ||
        !Number.isFinite(distance) ||
        !Number.isFinite(duration)
      )
        return alert("Inputs must be Positive Numbers!");
      workout = new Running([lat, lng], distance, duration, cadence);
      this.#workout.push(workout);
      console.log(workout);
    }
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !Number.isFinite(elevation) ||
        !Number.isFinite(distance) ||
        !Number.isFinite(duration)
      )
        return alert("Inputs must be Positive Numbers!");
      workout = new Cycling([lat, lng], distance, duration, elevation);
      this.#workout.push(workout);
      console.log(workout);
    }
    this.renderWorkoutMarker(workout);
    form.classList.remove("hidden");
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
      .setPopupContent("Workout")
      .openPopup();
  }
  catch(error) {
    console.error("Error in renderWorkoutMarker:", error);
  }
}

const app = new App();
