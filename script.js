let grids = []; // Array para almacenar los objetos del cartón
let indiceActual = 0; // Índice del cartón actual
let puntosJugadores = []; // Array para almacenar los puntos de cada jugador
let numerosDisponibles = Array.from({ length: 50 }, (_, index) => index + 1); // Array con números del 1 al 50
let contadorTurnos = 0;



// Boton que organiza todo al iniciar el juego, ademas valida que se introduzcan los nombres
document.getElementById('inicio-juego').addEventListener('click', function() {
    if (validarNombres()) {
        ocultarElementos();
        puntosJugadores = [];
        crearGrids();
        inicializarPuntosJugadores(); // Llamar aquí para inicializar los puntos de los jugadores
        mostrarPuntos(); // Llamar aquí para mostrar los puntos en la interfaz
        mostrarGrid(indiceActual); // Mostrar el primer cartón por defecto

        // Muestra los botones y los contadores
        document.getElementById('botones').style.display = 'flex'; 
        document.getElementById('btnRegresar').style.display = 'flex';
        document.getElementById('btnSacarNumero').style.display = 'flex';
        document.getElementById('gridSection').style.display = 'block';
        document.getElementById('puntos').style.display = 'block'; 
        mostrarContadorTurnos();
    } else {
        alert('Por favor, complete todos los campos de nombres antes de iniciar el juego.');
    }
});

//valida campos de nombres
function validarNombres() {
    const nombres = document.querySelectorAll('#title input[type="text"]');
    for (let i = 0; i < nombres.length; i++) {
        if (nombres[i].value.trim() === '') {
            return false;
        }
    }
    return true;
}

//Oculta los elementos de la primera pagina
function ocultarElementos() {
    const elementos = document.querySelectorAll('#title > *:not(#gridContainer)');
    elementos.forEach(elemento => {
        elemento.style.display = 'none';
    });
}

//Crea los cartones
function crearGrids() {
    const nombres = document.querySelectorAll('#title input[type="text"]');
    nombres.forEach(nombreInput => {
        const nombre = nombreInput.value.trim();
        const n = document.getElementById('n').value;
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid');
        gridContainer.style.marginTop = "25%" 

        // Generar una lista de números únicos dentro del rango pedido
        const numerosUnicos = [];
        for (let i = 1; i <= 50; i++) {
            numerosUnicos.push(i);
        }

        // Mezclar aleatoriamente los números
        for (let i = numerosUnicos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numerosUnicos[i], numerosUnicos[j]] = [numerosUnicos[j], numerosUnicos[i]];
        }

        // Asignar números a las celdas del cartón
        let numeroActual = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.textContent = numerosUnicos[numeroActual++];
                gridContainer.appendChild(cell);
            }
        }

        gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

        grids.push({ nombre: nombre, grid: gridContainer });
    });
}

//Muestra el carton y el jugador
function mostrarGrid(indice) {
    const gridActual = document.getElementById('gridContainer');
    gridActual.innerHTML = '';

    const nombreActual = document.createElement('h2');
    nombreActual.textContent = `Cartón para ${grids[indice].nombre}`;
    nombreActual.style.textAlign = 'center';
    gridActual.appendChild(nombreActual);

    gridActual.appendChild(grids[indice].grid);
}

//Inicializa los puntos en 0
function inicializarPuntosJugadores() {
    grids.forEach(grid => {
        puntosJugadores.push({ nombre: grid.nombre, puntos: 0 });
    });
}

function mostrarPuntos() {
    const puntosElemento = document.getElementById('puntosJugador');
    puntosElemento.innerHTML = ''; 
    puntosJugadores.forEach(jugador => {
        const elementoPuntos = document.createElement('div');
        elementoPuntos.textContent = `${jugador.nombre}: ${jugador.puntos} puntos`;
        puntosElemento.appendChild(elementoPuntos);
    });
}

//Muestra el siguiente cartón
document.getElementById('btnAnterior').addEventListener('click', function() {
    indiceActual = (indiceActual - 1 + grids.length) % grids.length;
    mostrarGrid(indiceActual);
});

//Muestra el cartón anterior
document.getElementById('btnSiguiente').addEventListener('click', function() {
    indiceActual = (indiceActual + 1) % grids.length;
    mostrarGrid(indiceActual);
});


function generarNumeroAleatorio() {
    if (numerosDisponibles.length === 0 || contadorTurnos >= 26) {
        alert('Fin del juego. Se alcanzaron los 25 turnos.');
        return;
    }

    const indice = Math.floor(Math.random() * numerosDisponibles.length);
    const numeroAleatorio = numerosDisponibles.splice(indice, 1)[0];

    mostrarNumeroAleatorio(numeroAleatorio);
    mostrarContadorTurnos();
    resaltarNumeroEnCarton(numeroAleatorio);
}

//Muestra el numero aleatorio sacado del bingo
function mostrarNumeroAleatorio(numero) {
    const resultado = document.getElementById('resultado');
    resultado.textContent = `Número sacado: ${numero}`;
}

function mostrarContadorTurnos() {
    const contadorElemento = document.getElementById('contadorTurnos');
    contadorElemento.textContent = `Turno: ${contadorTurnos}`;
}

//Cambia el color de la celda si sale ese numero y coincide en el carton
function resaltarNumeroEnCarton(numero) {
    const n = parseInt(document.getElementById('n').value);

    grids.forEach(grid => {
        const celdas = grid.grid.querySelectorAll('.cell');
        let filasCompletas = 0;
        let columnasCompletas = 0;

        for (let i = 0; i < n; i++) {
            let filaCompleta = true;
            let columnaCompleta = true;
            for (let j = 0; j < n; j++) {
                const valor = parseInt(celdas[i * n + j].textContent);
                if (valor === numero) {
                    celdas[i * n + j].style.backgroundColor = 'yellow';
                }
                if (!celdas[i * n + j].classList.contains('marcada')) {
                    filaCompleta = false;
                }
                if (!celdas[j * n + i].classList.contains('marcada')) {
                    columnaCompleta = false;
                }
            }
            if (filaCompleta) filasCompletas++;
            if (columnaCompleta) columnasCompletas++;
        }

        // Verificar si se completó una línea horizontal o vertical y sumar puntos en caso afirmativo
        if (filasCompletas > 0 || columnasCompletas > 0) {
            sumarPunto(grid.nombre, Math.max(filasCompletas, columnasCompletas)); // Sumar puntos al jugador correspondiente
        }
    });
}





function actualizarPuntosEnInterfaz() {
    mostrarPuntos();
}

// Función para sumar un punto a un jugador
function sumarPunto(nombreJugador, puntosGanados) {
    const jugador = puntosJugadores.find(jugador => jugador.nombre === nombreJugador);
    
    if (jugador) {
        jugador.puntos += puntosGanados;
        actualizarPuntosEnInterfaz(); // Actualizar los puntos en la interfaz
    }
}

//boton que llama a la funcion que genera el numero aleatorio y ademas va sumando a los turnos
document.getElementById('btnSacarNumero').addEventListener('click', function() {
    contadorTurnos++;
    generarNumeroAleatorio();
});

//Carga la pagina para regresar al inicio
document.getElementById('btnRegresar').addEventListener('click', function() {
    // Recargar la página para volver al estado inicial
    window.location.reload();
});