import "./style.css";
import { init, invoke } from "./coltrane.js";

const setup = async () => {
  console.log("Initializating Ruby VM...");
  await init();
  console.log("Ruby VM is ready!");
  showChord();

  document.querySelector("#controls").addEventListener("sl-change", () => {
    showChord();
  });
};

const showChord = async () => {
  let chord = document.querySelector("#chordSelect").value;
  let representation = document.querySelector("#representationSelect").value;

  let res = await invoke(chord, representation);
  document.querySelector("#output").innerText = res;
};

setup();
