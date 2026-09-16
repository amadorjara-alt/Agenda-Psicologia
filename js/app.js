// ========================================
// DATOS Y LOCALSTORAGE
// ========================================

let pacientes =
    JSON.parse(localStorage.getItem("pacientes")) || [];

let citas =
    JSON.parse(localStorage.getItem("citas")) || [];

let fotoSeleccionada = "";

console.log("Agenda Psicológica iniciada correctamente");


// ========================================
// ELEMENTOS DEL HTML
// ========================================

const formPaciente =
    document.getElementById("formPaciente");

const formCita =
    document.getElementById("formCita");


const nombrePaciente =
    document.getElementById("nombrePaciente");

const telefonoPaciente =
    document.getElementById("telefonoPaciente");

const correoPaciente =
    document.getElementById("correoPaciente");

const fotoPaciente =
    document.getElementById("fotoPaciente");

const fotoPreview =
    document.getElementById("fotoPreview");


const pacienteCita =
    document.getElementById("pacienteCita");

const fechaCita =
    document.getElementById("fechaCita");

const horaCita =
    document.getElementById("horaCita");

const motivoCita =
    document.getElementById("motivoCita");


const tablaPacientes =
    document.getElementById("tablaPacientes");

const tablaCitas =
    document.getElementById("tablaCitas");


const sinPacientes =
    document.getElementById("sinPacientes");

const sinCitas =
    document.getElementById("sinCitas");


const contadorPacientes =
    document.getElementById("contadorPacientes");

const contadorCitas =
    document.getElementById("contadorCitas");


const totalPacientes =
    document.getElementById("totalPacientes");

const totalCitas =
    document.getElementById("totalCitas");

const citasDisponibles =
    document.getElementById("citasDisponibles");


const mensaje =
    document.getElementById("mensaje");


// ========================================
// INICIO DEL SISTEMA
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    establecerFechaMinima();

    mostrarPacientes();

    actualizarSelectPacientes();

    mostrarCitas();

    actualizarResumen();

});


// ========================================
// NAVEGACIÓN
// ========================================

const botonesNavegacion =
    document.querySelectorAll("[data-section]");


botonesNavegacion.forEach((boton) => {

    boton.addEventListener("click", () => {

        const seccionId =
            boton.dataset.section;


        // Ocultar todas las secciones

        document.querySelectorAll(".section")
            .forEach((seccion) => {

                seccion.classList.remove("active");

            });


        // Mostrar sección seleccionada

        const seccion =
            document.getElementById(seccionId);


        if (seccion) {

            seccion.classList.add("active");

        }


        // Actualizar botón activo

        document.querySelectorAll(".nav-btn")
            .forEach((btn) => {

                btn.classList.remove("active");

            });


        const botonNav =
            document.querySelector(
                `.nav-btn[data-section="${seccionId}"]`
            );


        if (botonNav) {

            botonNav.classList.add("active");

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// ========================================
// SELECCIONAR FOTO
// ========================================

fotoPaciente.addEventListener("change", () => {

    const archivo =
        fotoPaciente.files[0];


    if (!archivo) {

        fotoSeleccionada = "";

        fotoPreview.innerHTML =
            "<span>👤</span>";

        return;
    }


    // Verificar que sea una imagen

    if (!archivo.type.startsWith("image/")) {

        mostrarMensaje(
            "Seleccione un archivo de imagen válido.",
            "error"
        );

        fotoPaciente.value = "";

        fotoSeleccionada = "";

        fotoPreview.innerHTML =
            "<span>👤</span>";

        return;
    }


    // Leer imagen

    const lector =
        new FileReader();


    lector.onload = (evento) => {

        fotoSeleccionada =
            evento.target.result;


        fotoPreview.innerHTML = `
            <img
                src="${fotoSeleccionada}"
                alt="Foto del paciente"
            >
        `;

    };


    lector.readAsDataURL(archivo);

});


// ========================================
// FORMATEAR TELÉFONO
// ========================================

telefonoPaciente.addEventListener("input", () => {

    let telefono =
        telefonoPaciente.value.replace(/\D/g, "");


    // Máximo 9 dígitos

    telefono =
        telefono.substring(0, 9);


    let telefonoFormateado = "";


    if (telefono.length > 6) {

        telefonoFormateado =
            telefono.substring(0, 3) +
            " " +
            telefono.substring(3, 6) +
            " " +
            telefono.substring(6, 9);

    }

    else if (telefono.length > 3) {

        telefonoFormateado =
            telefono.substring(0, 3) +
            " " +
            telefono.substring(3);

    }

    else {

        telefonoFormateado =
            telefono;
    }


    telefonoPaciente.value =
        telefonoFormateado;

});


// ========================================
// REGISTRAR PACIENTE
// ========================================

formPaciente.addEventListener("submit", (evento) => {

    evento.preventDefault();


    const nombre =
        nombrePaciente.value.trim();

    const telefono =
        telefonoPaciente.value.trim();

    const correo =
        correoPaciente.value.trim();


    // ====================================
    // CAMPOS OBLIGATORIOS
    // ====================================

    if (!nombre || !telefono || !correo) {

        mostrarMensaje(
            "Complete todos los campos del paciente.",
            "error"
        );

        return;
    }


    // ====================================
    // VALIDAR NOMBRE
    // ====================================

    const nombreValido =
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;


    if (!nombreValido.test(nombre)) {

        mostrarMensaje(
            "El nombre solo debe contener letras y espacios.",
            "error"
        );

        return;
    }


    // ====================================
    // VALIDAR TELÉFONO
    // ====================================

    const telefonoLimpio =
        telefono.replace(/\D/g, "");


    const telefonoValido =
        /^\d{9}$/;


    if (!telefonoValido.test(telefonoLimpio)) {

        mostrarMensaje(
            "El teléfono debe contener exactamente 9 dígitos.",
            "error"
        );

        return;
    }


    // ====================================
    // VALIDAR GMAIL
    // ====================================

    const correoValido =
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;


    if (!correoValido.test(correo)) {

        mostrarMensaje(
            "El correo debe ser una cuenta Gmail válida.",
            "error"
        );

        return;
    }


    // ====================================
    // EVITAR CORREOS DUPLICADOS
    // ====================================

    const pacienteExiste =
        pacientes.some(
            (paciente) =>
                paciente.correo.toLowerCase() ===
                correo.toLowerCase()
        );


    if (pacienteExiste) {

        mostrarMensaje(
            "Ya existe un paciente registrado con ese correo.",
            "error"
        );

        return;
    }


    // ====================================
    // CREAR PACIENTE
    // ====================================

    const nuevoPaciente = {

        id: Date.now(),

        nombre: nombre,

        telefono: telefonoLimpio,

        correo: correo,

        foto: fotoSeleccionada

    };


    pacientes.push(nuevoPaciente);


    // Guardar

    guardarPacientes();


    // Actualizar interfaz

    mostrarPacientes();

    actualizarSelectPacientes();

    actualizarResumen();


    // Limpiar formulario

    formPaciente.reset();

    fotoSeleccionada = "";

    fotoPreview.innerHTML =
        "<span>👤</span>";


    mostrarMensaje(
        "Paciente registrado correctamente.",
        "success"
    );

});


// ========================================
// GUARDAR PACIENTES
// ========================================

function guardarPacientes() {

    localStorage.setItem(
        "pacientes",
        JSON.stringify(pacientes)
    );

}


// ========================================
// MOSTRAR PACIENTES
// ========================================

function mostrarPacientes() {

    tablaPacientes.innerHTML = "";


    if (pacientes.length === 0) {

        sinPacientes.style.display =
            "block";

    }

    else {

        sinPacientes.style.display =
            "none";


        pacientes.forEach((paciente) => {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `

                <td>

                    <div class="patient-photo-small">

                        ${
                            paciente.foto

                            ? `
                                <img
                                    src="${paciente.foto}"
                                    alt="Foto"
                                >
                              `

                            : `
                                <span>👤</span>
                              `
                        }

                    </div>

                </td>


                <td>
                    ${paciente.nombre}
                </td>


                <td>
                    ${formatearTelefono(
                        paciente.telefono
                    )}
                </td>


                <td>
                    ${paciente.correo}
                </td>

            `;


            tablaPacientes.appendChild(fila);

        });

    }


    contadorPacientes.textContent =
        `${pacientes.length} paciente${
            pacientes.length !== 1 ? "s" : ""
        }`;

}


// ========================================
// ACTUALIZAR SELECT DE PACIENTES
// ========================================

function actualizarSelectPacientes() {

    pacienteCita.innerHTML = `
        <option value="">
            Seleccione un paciente
        </option>
    `;


    pacientes.forEach((paciente) => {

        const opcion =
            document.createElement("option");


        opcion.value =
            paciente.id;


        opcion.textContent =
            paciente.nombre;


        pacienteCita.appendChild(opcion);

    });

}


// ========================================
// FECHA MÍNIMA
// ========================================

function establecerFechaMinima() {

    const hoy =
        new Date();


    const año =
        hoy.getFullYear();


    const mes =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    const fechaActual =
        `${año}-${mes}-${dia}`;


    fechaCita.min =
        fechaActual;

}


// ========================================
// PROGRAMAR CITA
// ========================================

formCita.addEventListener("submit", (evento) => {

    evento.preventDefault();


    const pacienteId =
        pacienteCita.value;

    const fecha =
        fechaCita.value;

    const hora =
        horaCita.value;

    const motivo =
        motivoCita.value.trim();


    // ====================================
    // CAMPOS OBLIGATORIOS
    // ====================================

    if (
        !pacienteId ||
        !fecha ||
        !hora ||
        !motivo
    ) {

        mostrarMensaje(
            "Complete todos los campos de la cita.",
            "error"
        );

        return;
    }


    // ====================================
    // VALIDAR MOTIVO
    // ====================================

    if (motivo.length < 3) {

        mostrarMensaje(
            "El motivo debe tener al menos 3 caracteres.",
            "error"
        );

        return;
    }


    // ====================================
    // VERIFICAR PACIENTE
    // ====================================

    const pacienteExiste =
        pacientes.some(
            (paciente) =>
                paciente.id === Number(pacienteId)
        );


    if (!pacienteExiste) {

        mostrarMensaje(
            "Debe seleccionar un paciente registrado.",
            "error"
        );

        return;
    }


    // ====================================
    // VALIDAR FECHA
    // ====================================

    const hoy =
        new Date();


    hoy.setHours(
        0,
        0,
        0,
        0
    );


    const fechaSeleccionada =
        new Date(
            `${fecha}T00:00:00`
        );


    if (
        Number.isNaN(
            fechaSeleccionada.getTime()
        ) ||
        fechaSeleccionada < hoy
    ) {

        mostrarMensaje(
            "La fecha de la cita no es válida.",
            "error"
        );

        return;
    }


    // ====================================
    // EVITAR HORARIOS DUPLICADOS
    // ====================================

    const horarioOcupado =
        citas.some(
            (cita) =>
                cita.fecha === fecha &&
                cita.hora === hora &&
                cita.estado === "Programada"
        );


    if (horarioOcupado) {

        mostrarMensaje(
            "Ya existe una cita programada para esa fecha y hora.",
            "error"
        );

        return;
    }


    // ====================================
    // CREAR CITA
    // ====================================

    const nuevaCita = {

        id: Date.now(),

        pacienteId:
            Number(pacienteId),

        fecha: fecha,

        hora: hora,

        motivo: motivo,

        estado: "Programada"

    };


    citas.push(nuevaCita);


    // Guardar

    guardarCitas();


    // Actualizar interfaz

    mostrarCitas();

    actualizarResumen();


    // Limpiar

    formCita.reset();

    establecerFechaMinima();


    mostrarMensaje(
        "Cita programada correctamente.",
        "success"
    );

});


// ========================================
// GUARDAR CITAS
// ========================================

function guardarCitas() {

    localStorage.setItem(
        "citas",
        JSON.stringify(citas)
    );

}


// ========================================
// MOSTRAR CITAS
// ========================================

function mostrarCitas() {

    tablaCitas.innerHTML = "";


    if (citas.length === 0) {

        sinCitas.style.display =
            "block";

    }

    else {

        sinCitas.style.display =
            "none";


        citas.forEach((cita) => {

            const paciente =
                pacientes.find(
                    (p) =>
                        p.id === cita.pacienteId
                );


            const fila =
                document.createElement("tr");


            const fechaFormateada =
                formatearFecha(
                    cita.fecha
                );


            const estadoClase =
                cita.estado.toLowerCase();


            fila.innerHTML = `

                <td>
                    ${
                        paciente
                        ? paciente.nombre
                        : "Paciente no encontrado"
                    }
                </td>

                <td>
                    ${fechaFormateada}
                </td>

                <td>
                    ${cita.hora}
                </td>

                <td>
                    ${cita.motivo}
                </td>

                <td>

                    <span
                        class="status ${estadoClase}">

                        ${cita.estado}

                    </span>

                </td>

                <td class="accion-cita"></td>

            `;


            // =================================
            // BOTÓN CANCELAR
            // =================================

            if (
                cita.estado === "Programada"
            ) {

                const botonCancelar =
                    document.createElement("button");


                botonCancelar.className =
                    "cancel-btn";


                botonCancelar.textContent =
                    "Cancelar";


                botonCancelar.addEventListener(
                    "click",
                    () => {

                        cancelarCita(
                            cita.id
                        );

                    }
                );


                fila
                    .querySelector(".accion-cita")
                    .appendChild(
                        botonCancelar
                    );

            }

            else {

                fila
                    .querySelector(".accion-cita")
                    .textContent = "—";

            }


            tablaCitas.appendChild(fila);

        });

    }


    contadorCitas.textContent =
        `${citas.length} cita${
            citas.length !== 1 ? "s" : ""
        }`;

}


// ========================================
// CANCELAR CITA
// ========================================

function cancelarCita(id) {

    const cita =
        citas.find(
            (cita) =>
                cita.id === id
        );


    if (!cita) {

        mostrarMensaje(
            "No se encontró la cita.",
            "error"
        );

        return;
    }


    const confirmar =
        confirm(
            "¿Está seguro de cancelar esta cita?"
        );


    if (!confirmar) {

        return;
    }


    cita.estado =
        "Cancelada";


    guardarCitas();


    mostrarCitas();

    actualizarResumen();


    mostrarMensaje(
        "La cita fue cancelada correctamente.",
        "success"
    );

}


// ========================================
// ACTUALIZAR RESUMEN
// ========================================

function actualizarResumen() {

    const programadas =
        citas.filter(
            (cita) =>
                cita.estado === "Programada"
        );


    totalPacientes.textContent =
        pacientes.length;


    totalCitas.textContent =
        programadas.length;


    citasDisponibles.textContent =
        programadas.length;

}


// ========================================
// FORMATEAR FECHA
// ========================================

function formatearFecha(fecha) {

    const partes =
        fecha.split("-");


    if (partes.length !== 3) {

        return fecha;

    }


    return `
        ${partes[2]}/
        ${partes[1]}/
        ${partes[0]}
    `.replace(/\s/g, "");

}


// ========================================
// FORMATEAR TELÉFONO
// ========================================

function formatearTelefono(telefono) {

    const numero =
        telefono.replace(/\D/g, "");


    if (numero.length !== 9) {

        return telefono;

    }


    return `
        ${numero.substring(0, 3)}
        ${numero.substring(3, 6)}
        ${numero.substring(6, 9)}
    `.replace(/\s+/g, " ").trim();

}


// ========================================
// MOSTRAR MENSAJES
// ========================================

function mostrarMensaje(
    texto,
    tipo
) {

    mensaje.textContent =
        texto;


    mensaje.className =
        `message show ${tipo}`;


    setTimeout(() => {

        mensaje.className =
            "message";

    }, 3000);

}