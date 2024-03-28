import { start } from "./game.js";
import initVM from "./vm.js";
import { init as initEditor } from "./editor.js";

const introEl = document.getElementById("intro");
const loadingEl = document.getElementById("loading");
const gameEl = document.getElementById("game");

const editorEl = document.getElementById("editor");
const readmeEl = document.getElementById("readme");

const startForm = document.getElementById("startForm");
const nameInput = document.getElementById("nameInput");
const skillLevelInput = document.getElementById("levelInput");

startForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const skillLevel = skillLevelInput.value;
  if (!name || !skillLevel) return;

  introEl.classList.add("hidden");
  loadingEl.classList.remove("hidden");

  const vm = await initVM();
  const editor = initEditor(editorEl);

  loadingEl.classList.add("hidden");
  gameEl.classList.remove("hidden");

  const game = await start(vm, name, skillLevel);

  readmeEl.innerText = game.readme;
  editor.setValue(game.playerrb.toString());

  const runBtn = document.getElementById("runBtn");
  const turnOutput = document.getElementById("turn");

  runBtn.addEventListener("click", async () => {
    runBtn.setAttribute("disabled", true);
    try {
      let success = await game.play(editor.getValue(), turnOutput);

      if (success) {
        readmeEl.innerText = game.readme;
        editor.setValue(game.playerrb);
      }
    } catch (e) {
      console.error(e);
    }
    runBtn.removeAttribute("disabled");
  });

  const interruptBtn = document.querySelector("#interruptBtn");
  interruptBtn.addEventListener("click", () => {
    game.interrupt();
  });

  const pauseResumeBtn = document.querySelector("#pauseResumeBtn");
  pauseResumeBtn.addEventListener("click", () => {
    game.pauseResume();
  });
});
