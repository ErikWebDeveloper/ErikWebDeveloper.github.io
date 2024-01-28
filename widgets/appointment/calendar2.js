// Modelo abstracto
class Layer{
    constructor(layerId, parent){
        this.parent = parent;
        this.id = layerId;
        this.class = null;
        this.element = null;
        this.render();

    }
    createMainElement(){
        this.element = document.createElement('div');
        this.element.element.id = this.id;
    }
    render(){
        this.createMainElement();
        this.parent.appendChild(this.element)
    }
}

/* 
Construccion por capas: 
    1. Contenedor principal -> CalendarApp
    2. Calendario           -> CalendarLayer
    3. Seleccionar hora     -> ScheduleLayer
    ... 
*/

class CalendarLayer extends Layer{
    constructor(controller, layerId, parent){
        // Inizializar herencia
        super(layerId, parent);
        // Emparejar con su controlador de capa superior
        this.controller = controller;
        // Capas Intenras de ClandarLayer
        this.year = new Layer("year", this.element);
        this.month = new Layer("month", this.element);
        this.weekDays = new Layer("week-days", this.element);
        this.weeksNumbers = new Layer("weeks-num", this.element);

    }

    getCurrentDate(){
        this.currentDate = new Date();

        this.currentDate = {
            day : this.currentDate.getDate(),
            month : this.currentDate.getMonth(),
            year: this.currentDate.getFullYear()
        }
    }
}

class YearLayer