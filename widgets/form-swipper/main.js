import  { FormSwipper, FormHandler}  from "./formSwiper.js"

var formSwipperConfig = {
    parentElementId : 'userConfigForm',
    pagesClass : 'formPage',
    text : {
        next : 'Next',
        back : 'Back',
        submit : 'Send'
    },
    submitCallback : submit
}

class BrowseTheme extends FormHandler{
    constructor(formSwiper){
        super(formSwiper);

        this.radios =  document.querySelectorAll('input[name="preference_user"]');

        this.checkedIndex = null;

        this.init();
    
    }

    init(){
        this.checkedListener();
    }

    mainCallback(){
        // Aqui puedes incluir las funciones necesarias para el disparador callback
        this.checkedAction();
    }

    checkedAction(){
        let isChecked = false;
        
        this.radios.forEach(function(radio){
            if(radio.checked) isChecked = true;
        })

        for(let i = 0; i < this.radios.length; i++){
            if(this.radios[i].checked) isChecked = true, this.checkedIndex = i;
        }
        if(isChecked) this.form.nextBtnEnabled(true);
    }

    checkedListener(){

        this.radios.forEach( (radio) => {
            radio.addEventListener('click', this.mainCallback.bind(this));
        })
    }
}

class AliasInput extends FormHandler{
    constructor(form){
        super(form);
        this.emailField = document.querySelector('input[name="user_email_input"]');
        this.init();
    }

    init(){
        this.listener();
    }

    mainCallback(){
        let emailIsValid = this.validateEmail();
    
        if(emailIsValid) this.form.nextBtnEnabled(true);
        else this.form.nextBtnEnabled(false);
    }

    listener(){
        this.emailField.addEventListener('keyup', this.mainCallback.bind(this));
    }

    validateEmail(){
        let email = this.emailField.value;
        // Expresión regular para validar el formato de un correo electrónico
        let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Usar la expresión regular para verificar el formato del correo
        if (regexEmail.test(email)) {
            this.emailField.classList.add('is-valid')
            return true; 
        } else {
            if(this.emailField.classList.contains('is-valid')) this.emailField.classList.remove('is-valid');
            return false;
        }
    }
}

class Policity extends FormHandler{
    constructor(formSwipper){
        super(formSwipper);
        this.checkBox = document.querySelector('input[name="acept_policity"]');
        this.init();
    }
    init(){
        this.listener();
    }
    updateState(){
        this.mainCallback();
    }
    mainCallback(){
        let isChecked = this.isChecked();

        if(isChecked) this.form.nextBtnEnabled(true);
        else this.form.nextBtnEnabled(false)
    }
    listener(){
        this.checkBox.addEventListener('click', this.mainCallback.bind(this));
    }
    isChecked(){
        if(this.checkBox.checked){
            return true
        }else{
            return false
        }
    }

}

function submit(event){
    event.preventDefault();
    
}

var form = new FormSwipper(formSwipperConfig);

var firstPage = new BrowseTheme(form);
var secondPage = new AliasInput(form)
var thirdPage = new Policity(form)

const configBtn = document.getElementById('themeBtn');

configBtn.addEventListener('click', configTheme)

const themesExamples = {
    ligth : {
        formSwipperColor : "#438ce6",
        formSwipperColorDisabled: "#6d6d6d",
        formSwipperBackGround : "#ffffff",
        formSwipperColorBorder : "#b4b4b4ac",
    },
    dark : {
        formSwipperColor : "#ffffff",
        formSwipperColorDisabled: "#6d6d6d",
        formSwipperBackGround : "#3f3e41",
        formSwipperColorBorder : "#ffffff",
    }
}
function configTheme(){
    let theme = document.querySelector('select[name="theme"]').value;
    if(theme != "custom") form.theme.setTheme(themesExamples[theme]);
    else{
        let customTheme = {
            formSwipperColor : document.querySelector('input[name="textColor"]').value,
            formSwipperColorDisabled: document.querySelector('input[name="disabledColor"]').value,
            formSwipperBackGround : document.querySelector('input[name="backgroundColor"]').value,
            formSwipperColorBorder : document.querySelector('input[name="borderColor"]').value,
        }
        form.theme.setTheme(customTheme);
    }
}