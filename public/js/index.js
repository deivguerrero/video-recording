const dataReader = [
  "Cuando cuentes cuentos, cuenta cuántos cuentos cuentas, porque si no cuentas cuántos cuentos cuentas, nunca sabrás cuántos cuentos cuentas tú.",
  "Pedro Pablo Pérez Pereira, pobre pintor portugués, pinta preciosos paisajes por poca plata, para poder pasar por París.",
  "Hugo tuvo un tubo, pero el tubo que tuvo se le rompió. Para recuperar el tubo que tuvo, tuvo que comprar un tubo igual al tubo que tuvo.",
  "Si tu gusto no gusta del gusto que gusta mi gusto, qué disgusto se lleva mi gusto al saber que tu gusto no gusta del gusto que gusta mi gusto.",
  "Me han dicho un dicho, que dicen que he dicho yo. Ese dicho está mal dicho, pues si yo lo hubiera dicho, estaría mejor dicho, que ese dicho que dicen que algún día dije yo.",
  "Tres tristes tigres tragaban trigo en tres tristes trastos sentados tras un trigal. Sentados tras un trigal, en tres tristes trastos tragaban trigo tres tristes tigres",
  "Pedro Pérez el pintor, pinta pulcros y preciosos paisajes, por pocas monedas, pinta Pedro Pérez, para poder partir a parís en un viaje. ",
  "Lenguas luengas es lo que hace falta para no trabalenguarse si alguien no tiene lenguas luengas ¿cómo podría destrabalenguarse? ",
  "Erre con erre, guitarra; erre con erre, carril: rápido ruedan los carros,rápido el ferrocarril.",
];
const videoContainer = document.querySelector("video");
const fraseContainer = document.querySelector("#frase-container");
const recButton = document.querySelector("#rec");
const stopButton = document.querySelector("#stop");
const yoloButton = document.querySelector("#yolo");
const enlaceElement = document.querySelector("#enlace");
const uriSave = "https://2o70v2jhmd.execute-api.us-east-1.amazonaws.com/api";
let mediaRecorded;
let recordedBlobs;

const constraints = {
  audio: { echoCancellation: { exact: true } },
  video: { width: { exact: 480 }, height: { exact: 648 } },
};

recButton.addEventListener("click", () => {
  console.log("Iniciando grabacion");
  recordedBlobs = [];
  const options = { mimeType: "video/webm;codecs=vp8" };
  mediaRecorded = new MediaRecorder(window.stream, options);

  mediaRecorded.ondataavailable = handleDataAvailable;
  mediaRecorded.onstop = saveVideo;
  mediaRecorded.start();
  sendMessage("INICIANDO", "Video grabando");
});
yoloButton.addEventListener("click", () => {
  alert("OK");
});

stopButton.addEventListener("click", () => {
  if (mediaRecorded) {
    mediaRecorded.stop();
  } else {
    sendMessage("ATENCION", "Requiere iniciar grabacion");
  }
});

function saveVideo(event) {
  sendMessage("PROCESO", "Enviando video");
  const blob = new Blob(recordedBlobs, { type: "video/webm" });
  let formData = new FormData();
  formData.append("video", blob);
  console.log(formData);
  let options = {
    method: "POST",
    body: formData,
  };
  fetch(`${uriSave}/save`, options)
    .then((resp) => resp.json())
    .then((data) => {
      sendMessage("FINALIZADO", "Video Almacenado");
      console.log(data.uri);
      window.open(data.uri, "_blank");
    })
    .catch((err) => {
      console.log("YOLO ERRRO");
      console.log(err);
    });
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function sendMessage(title, message) {
  iziToast.show({
    title,
    message,
    color: "green",
    topRight: "topRight",
    timeout: 3500,
  });
}

async function init() {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  window.stream = stream;
  videoContainer.srcObject = stream;
  videoContainer.muted = true;
}

window.onload = async () => {
  await init();
};

console.log(fraseContainer);
fraseContainer.innerHTML =
  dataReader[Math.floor(Math.random() * dataReader.length)];
