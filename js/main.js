"use strict";

import { opciones } from "./lista-palabras.js";

//Sonidos
let win = new Audio("./sound/win.wav");
let correct = new Audio("./sound/correct.wav");
let lose = new Audio("./sound/lose.wav");
let fail = new Audio("./sound/fail.wav");
let death = new Audio("./sound/death.wav");
let soundOn = true;
//Funcion Sonido
function playSound(audio) {
    if (soundOn) {
        audio.play();
    }
}
//Funcion habilitar/deshabilitar sonido
function activateSound() {
    soundOn = !soundOn;
    const imagenBoton = document.getElementById("soundIcon");
    imagenBoton.src = soundOn ? "./img/off.png" : "./img/on.png";
    const boton = document.getElementById("soundToggle");
    boton.style.backgroundColor = soundOn ? "#ffffff" : "rgb(246, 140, 108)";
}

const alfabeto = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];

let seleccionCategoria = opciones[Math.floor(Math.random() * opciones.length)];
let objetoSolucion =
    seleccionCategoria.palabras[
        Math.floor(Math.random() * seleccionCategoria.palabras.length)
    ];
let palabraElegida = objetoSolucion.palabra;
let pistaElegida = objetoSolucion.pista;
let solucionArray = palabraElegida.split("");
let palDisplayArr = "_".repeat(palabraElegida.length).split("");

const h2Elem = document.getElementById("h2");
const h3Elem = document.getElementById("h3");
const pistaElem = document.getElementById("pista");
const keys = document.getElementById("keys");
const cuentaAtras = document.getElementById("cuenta-atras");
const modoContrarrelojBtn = document.getElementById("modo-contrarreloj");
const sectionM = document.querySelector(".modal");
const modalImg = document.querySelector('.modal-container');
const h2Perder = document.querySelector(".modal-title");
const pPerder = document.querySelector(".modal-p");

pistaElem.textContent = `¿Quieres una pista? ¡Hazme click!`;
pistaElem.addEventListener("click",() => (pistaElem.textContent = `Pista: ${pistaElegida}`));
h3Elem.textContent = `La categoría es: ${seleccionCategoria.categoria}`;
h2Elem.textContent = palDisplayArr.join(" ");

let fallos = 0;
let tiempoRestante;
let intervalo;

// Función para deshabilitar todos los botones al terminar el juego
function disableAllButtons() {
    const allButtons = document.getElementsByClassName("letra");
    for (const thing of allButtons) {
        thing.disabled = true;
    }
}
//creamos funcion para remover acentos de las vocales
function removeAccent(letter) {
    if (letter === "á") return "a";
    if (letter === "é") return "e";
    if (letter === "í") return "i";
    if (letter === "ó") return "o";
    if (letter === "ú") return "u";
    return letter;
}

// Función para actualizar la imagen del ahorcado
function actualizarImagen(fallos) {
    const imgElem = document.getElementById("dibujoAhorcado");
    imgElem.src = `fotos/ahorcado${fallos}.jpg`;
}

// Función para iniciar la cuenta atrás
function iniciarCuentaAtras() {
    intervalo = setInterval(() => {
        cuentaAtras.textContent = `${tiempoRestante}s`;

        tiempoRestante--;

        if (tiempoRestante < 0) {
            clearInterval(intervalo);
            modalImg.style.backgroundImage = "url(./img/modalPerder.png)";
            cuentaAtras.textContent = "¡Tiempo agotado!";
            h2Perder.textContent = "¡Se acabó el tiempo!";
            pPerder.textContent = `¡Gracias por jugar en nuestro proyecto del Ahorcado! La palabra correcta era: ${palabraElegida}`;
            sectionM.classList.add("modal--show");
            disableAllButtons();
            actualizarImagen(fallos);
            playSound(lose);
        }
    }, 1000);
}

//Juego basico
function charCheck(button, guess) {
    if (solucionArray.some((elem) => removeAccent(elem) === guess)) {
        for (let i = 0; i < solucionArray.length; i++) {
            let elemSinTildes = removeAccent(solucionArray[i]);
            if (guess === elemSinTildes) {
                palDisplayArr[i] = solucionArray[i];
            }
        }
        h2Elem.textContent = palDisplayArr.join(" ");
        playSound(correct);
    } else {
        fallos += 1;
        playSound(fail);
        actualizarImagen(fallos);
    }

    button.disabled = true;
    if (palDisplayArr.indexOf("_") === -1) {
        disableAllButtons();
        playSound(win);
        sectionM.classList.add("modal--show");
    }
    if (fallos >= 6) {
        disableAllButtons();
        actualizarImagen(fallos);
        playSound(lose);
        modalImg.style.backgroundImage = "url(./img/modalPerder.png)";
        h2Perder.textContent = "¡Perdiste!";
        pPerder.textContent = `¡Gracias por jugar en nuestro proyecto del Ahorcado! La palabra correcta era: ${palabraElegida}`;
        sectionM.classList.add("modal--show");
    }
}

//funcion para adivinar palabra completa
const botonAdivinarPalabra = document.querySelector("#adivinarPalabra");
botonAdivinarPalabra.addEventListener("click", adivinarPalabraCompleta);
function remove(text) {
    const accents = {
        á: "a",
        é: "e",
        í: "i",
        ó: "o",
        ú: "u",
        Á: "A",
        É: "E",
        Í: "I",
        Ó: "O",
        Ú: "U",
    };
    return text
        .split("")
        .map((char) => accents[char] || char)
        .join("");
}
function adivinarPalabraCompleta() {
    const intentoPalabra = prompt(
        `Introduce tu intento para la palabra completa (todo en minúsculas y usando tildes donde corresponda): ${palDisplayArr.join(
            " "
        )}`
    );
    if (
        intentoPalabra &&
        remove(intentoPalabra.toLowerCase()) ===
            remove(palabraElegida.toLowerCase())
    ) {
        h2Elem.textContent = palabraElegida;
        playSound(win);
        disableAllButtons();
        sectionM.classList.add("modal--show");
    } else {
        fallos = 6;
        actualizarImagen(fallos);
        disableAllButtons();
        playSound(death);
        modalImg.style.backgroundImage = "url(./img/modalPerder.png)";
        h2Perder.textContent = "¡Perdiste!";
        pPerder.textContent = `¡Gracias por jugar en nuestro proyecto del Ahorcado! La palabra correcta era: ${palabraElegida}`;
        sectionM.classList.add("modal--show");
    }
}

// Crear botones para cada letra del alfabeto
for (let character of alfabeto) {
    let button = document.createElement("button");
    button.classList.add("letras");
    button.innerText = character;
    keys.appendChild(button);
    button.addEventListener("click", (e) => {
        charCheck(e.target, character);
    });
}

// Iniciar el juego y activar el botón "Modo Contrarreloj"
modoContrarrelojBtn.addEventListener("click", () => {
    clearInterval(intervalo);
    tiempoRestante = 15; 
    cuentaAtras.textContent = `${tiempoRestante}s`;
    iniciarCuentaAtras();
    modoContrarrelojBtn.setAttribute("disabled", "disabled");
});

let footer = document.querySelector("footer");
let botonActivarSonido = document.createElement("button");
botonActivarSonido.id = "soundToggle";
botonActivarSonido.style.backgroundColor = "#ffffff";
let imagenBoton = document.createElement("img");
imagenBoton.id = "soundIcon";
imagenBoton.src = soundOn ? "./img/off.png" : "./img/on.png";
imagenBoton.alt = "Icono de sonido";
botonActivarSonido.append(imagenBoton);
botonActivarSonido.addEventListener("click", activateSound);
footer.append(botonActivarSonido);

//Modal
let botonModal = document.querySelector(".modal-close");
botonModal.addEventListener("click", () => location.reload());
