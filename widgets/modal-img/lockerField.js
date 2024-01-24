/*
    - Todos los campos deben compartir la misma classe CSS.
    - El elemento de cambio, debe pertenecer a la clase 'locker'.
    - El elemento de cambio solo puede tener un hijo, el 🔒.
*/

class FieldLocker{
    constructor(fieldClass, index){
        this.field = document.getElementsByClassName(fieldClass)[index];
        this.lockBtn = document.getElementsByClassName('locker')[index];
        this.lock = this.lockBtn.children[0];
        this.init();
    }
    init(){
        this.listener();
    }
    callback(){
        // Cambiar el estado a opuesto
        this.state = !this.field.disabled;
        // Habilitar/desabilitar elemento en el DOM
        this.field.disabled = this.state;
        this.field.ariaDisabled = this.state;
        // Cambiar simbolo candado
        if(this.lock.textContent === '🔒') this.lock.textContent = '🔓';
        else this.lock.textContent = '🔒';

    }
    listener(){
        this.lockBtn.addEventListener('click', this.callback.bind(this));
    }
}

class Fields{
    constructor(fieldLockerClass = 'fieldLocker'){
        this.fieldClass = document.getElementsByClassName(fieldLockerClass);
        this.fields = [];
        this.init();
    }
    init(){
        for(let i = 0; i < this.fieldClass.length; i++){
            this.fields.push(new FieldLocker('fieldLocker', i))
        }
    }
}

var fieldLocker = new Fields();

