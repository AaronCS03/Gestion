# Sistema de Gestión de Tareas Académicas

## Descripción
Este proyecto consiste en un **Sistema de Gestión de Tareas Académicas** desarrollado utilizando **HTML, CSS y JavaScript**.  
La aplicación permite administrar tareas mediante un **CRUD completo (Crear, Leer, Actualizar y Eliminar)**, utilizando un **JSON interno** como estructura de datos y **localStorage** para la persistencia de la información entre sesiones.

Las tareas se visualizan en **tarjetas**, organizadas por estado, con opciones de filtrado, ordenamiento y edición mediante una ventana modal.

---

## Tecnologías utilizadas
- HTML5  
- CSS3  
- JavaScript (ES6)  
- localStorage  

---

## Estructura del proyecto
task-manager/
│
├── index.html
├── css/
│ └── styles.css
├── js/
│ └── app.js
└── README.md


---

## Estructura del JSON
Las tareas se almacenan como un arreglo de objetos en localStorage.

### Ejemplo de una tarea:
```json
{
  "id": 1700000000000,
  "dueDate": "2025-06-22",
  "time": "18:00",
  "subject": "Programación Web",
  "category": "Development",
  "priority": "Alta",
  "status": "In Progress",
  "title": "User Flow",
  "description": "Diseñar el flujo de pantallas del dashboard",
  "progress": 3
}
```
### Descripción de los campos

- id: identificador único de la tarea

- dueDate: fecha de entrega

- time: hora de entrega

- subject: materia o área académica

- category: etiqueta de clasificación

- priority: nivel de prioridad (Alta, Media, Baja)

- status: estado de la tarea

- title: título de la tarea

- description: descripción detallada

- progress: nivel de avance (0–10)

### Cómo ejecutar el proyecto localmente

- Descargar o clonar el repositorio.

- Abrir el archivo index.html en un navegador web moderno.

### Cómo ejecutar el proyecto en GitHub Pages

- Subir el proyecto a un repositorio en GitHub.

- Acceder a Settings → Pages.

- Seleccionar la rama main y la carpeta raíz (/root).

- Guardar los cambios.

- Acceder al enlace proporcionado por GitHub Pages.

### Funcionalidades principales

- Registro de nuevas tareas

- Visualización de tareas en tarjetas

- Edición de tareas existentes

- Eliminación de tareas con confirmación

- Persistencia de datos mediante localStorage

- Diseño responsive para escritorio y dispositivos móviles


