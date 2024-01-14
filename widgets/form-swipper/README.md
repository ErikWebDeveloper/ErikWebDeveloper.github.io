# Form Swipper

## Introducción
El widget Form Swipper ha sido desarrollado para dar una solución de disenyo a formularios extensos, ya sea porque el formulario tiene muchos campos, o para poder implementar distintos sets de campos `<fieldset>`.

Form Swipper utiliza las tecnologías **HTML**, **CSS**, y **JS**, lo que lo convierte en un widget fácil de implementar. Está diseñado para que puedas agregarle tu propio estilo y adaptarlo fácilmente a tus necesidades.

## Descargar

## Implementación
### HTML
Para importar la biblioteca, primero debes agregar el archivo `formSwipper.css` en la sección `<head>` de tu documento HTML.

```html
<link rel="stylesheet" href="./formSwipper.css">
```
> [!WARNING] 
> Asegúrate de que el atributo `src` apunte al archivo `formSwipper.css` en tu directorio.

También necesario agregar un elemento HTML correspondiente para su integración.

```html
<!-- Contenedor principal --> 
<div class="formSwipperContainer">
    <!-- Configura tu formulario si es necesario -->
    <form class="formSwipper">
        <!-- Dentro de <section> debes poner las paginas de formulario -->
        <section>
            <!-- Cada contenedor sera una pagina a mostrar -->
            <div class="formPage"></div>
            <div class="formPage"></div>
            <div class="formPage"></div>
            <div class="formPage"></div>
        </section>
    </form>
</div>
```
El elemento `<div class="formPage">` actúa como el contenedor para mostrar las páginas. Se recomienda que cada página resida en un `<div class="formPage">` separado.

Al final del documento HTML, justo antes de la etiqueta `<body>`, se debe añadir un bloque de script.

```html
    <!-- Final del documento HTML -->
        <script type="module" src="./formSwipper.js"></script>
    </body>
</html>
```
Asegúrate de modificar el atributo `src` para que apunte al archivo **formSwipper.js** y refleje la ubicación donde lo tengas almacenado.

> [!WARNING] 
> Asegúrate de haber configurado el atributo `type="module"` correctamente.


### CSS
Puedes personalizar el estilo de la clase `.formSwipperContainer`, ajustando propiedades como ancho, posicionamiento, ya que no hay ningún estilo predefinido.

Un ejemplo:

```css
.formSwipperContainer{
    width: 90%;
    max-width: 450px;
    margin: auto;
    margin-top: 5rem;
}
```

Para ajustar la propiedad de altura, sería conveniente hacerlo en la clase `.formSwipper`. Por defecto, esta clase no tiene una altura predeterminada.

Ejemplo de añadir altura mínima:

```css
.formSwipper{
    min-height: 60vh
}
```

### JS
Crea un archivo JavaScript para la implementación de la clase `FormSwipper`. Para utilizar la clase, sigue estos pasos:

```js
// myFile.js

// IMPORTANTE: La primera línea del script debe ser:
import { FormSwipper, FormHandler } from "./formSwiper.js";

// Crear la configuración
var myFormSwipperConfig = {
    // ID del elemento <form class="formSwipper" id="exampleForm">
    parentElementId: 'exampleForm',
    // Nombre de la clase que se asigna a cada página en el elemento <div class="formPage">
    pagesClass: 'formPage',
    // Texto para los botones de navegación
    text: {
        next: 'Next',  // Botón de 'siguiente'
        back: 'Back',  // Botón de 'atrás'
        submit: 'Send' // Botón de 'enviar'
    },
    // Función para ejecutar el Submit del formulario
    submitCallback: submit
};

// Ejemplo de la función submit
function submit(event) {
    event.preventDefault();
    alert('Submit successfully');

// Instanciar la classe formSwipper
var fs = new FormSwipper(myFormSwipperConfig);
}
```
Agrega el archivo al documento HTML:
```html
        <script type="module" src="./formSwipper.js"></script>
        <!-- Usa el atributo type="module" para importar la libreria -->
        <script type="module" src="./myFile.js"></script>
    </body>
</html>
```
> [!WARNING] Atención
> Asegúrate de haber configurado correctamente el atributo `type="module"` para utilizar la biblioteca en tu código.


## Ejemplo de implementación
### Directorios
```bash
Folder
├── formSwipper.css
├── formSwipper.js
├── myFile.js
├── myStyle.css
└── index.html
```
### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Swipper</title>
    <link rel="stylesheet" href="./formSwipper.css">
    <link rel="stylesheet" href="./myStyle.css">
</head>
<body>

    <div class="formSwipperContainer">
        <form class="formSwipper" id="exampleForm">
            <section>
                <div class="formPage">
                    <input type="radio" id="page-1" class="eventCallback">
                    <label for="page-1">Click me for validate</label>
                </div>
                <div class="formPage">
                    <input type="radio" id="page-2" class="eventCallback">
                    <label for="page-2">Click me for validate</label>
                </div>
                <div class="formPage">
                    <input type="radio" id="page-3" class="eventCallback">
                    <label for="page-3">Click me for validate</label>
                </div>
                <div class="formPage">
                    <input type="radio" id="page-4" class="eventCallback">
                    <label for="page-4">Click me for validate</label>
                </div>
            </section>
        </form>
    </div>

    <script type="module" src="./formSwipper.js"></script>
    <script type="module" src="./myFile.js"></script>
</body>
</html>
```
### myStyle.css
```css
.formSwipperContainer {
    width: 90%;
    max-width: 450px;
    margin: auto;
    margin-top: 5rem;
}
.formSwipper {
    min-height: 10vh
}
```
### myFile.js
```js
import { FormSwipper, FormHandler } from "./formSwipper.js";

var myFormSwipperConfig = {
    parentElementId: 'exampleForm',
    pagesClass: 'formPage',
    text: {
        next: 'Next',  
        back: 'Back', 
        submit: 'Send' 
    },
    submitCallback: myAlert
};

function myAlert(event) {
    event.preventDefault();
    alert('Submit successfully');
}

var fs = new FormSwipper(myFormSwipperConfig);



// En este ejemplo, se crea es una clase que gestiona todas las páginas,
// sin embargo, se recomienda utilizar una clase por cada página.

class MyPagesForms extends FormHandler{
    constructor(formSwipper){
        super(formSwipper);
        this.elements = document.getElementsByClassName('eventCallback');
        this.init();
    }
    init(){
        this.listener();
    }
    listener(){
        for(let i = 0; i < this.elements.length; i++){
            this.elements[i].addEventListener('click', this.callBack.bind(this) )
        }
    }
    callBack(){
        // This.form -> Atributo heredado de FormHandler
        this.form.nextBtnEnabled(true);
    }
}

var formHandler = new MyPagesForms(fs);
```


