const image = "imagePreview"
const inputLoader = "uploadImageInput";
const radioNames = 'image';
const closeButtonsClass = '.closeModal';
const saveBtnId = 'saveModal';
const imageOutOfModal = 'user_avatar_image';
const valueOutOfModalName = 'user_avatar'; 


class RadioInputs{
    constructor(controller, name){
        this.controller = controller;
        this.inputs = document.querySelectorAll(`input[name="${name}"]`);
        this.labels = [];
        this.ckeckedSrc = null;
        this.init();
    }
    init(){
        this.inputs.forEach( (i) => {
            let label = document.querySelector(`label[for="${i.id}"]`);
            this.labels.push(label)
        })
        this.listener();
    }
    callback(event){
        this.ckeckedSrc = event.target.src;
        this.controller.handleInputs(false);
    }
    listener(){
        this.labels.forEach( (label) => {
            label.addEventListener('click', (event) => this.callback(event));

        })
    }
    uncheck(){
        this.ckeckedSrc = null;
        this.inputs.forEach( (i) => {
            i.checked = false;
        })
    }
}

class ImageUpload{
    constructor(controller, imageId, inputLoader){
        this.controller = controller
        this.imageElement = document.getElementById(imageId) 
        this.defaultImg = this.imageElement.src;
        this.inputLoader = document.getElementById(inputLoader)
        this.init();
    }

    init(){
        this.listener();
    }

    reset(){
        this.imageElement.src = this.defaultImg;
        this.inputLoader.value = "";
    }

    callback(e) {
        // Si hay archivo, pasar imagen al elemento
        if (this.inputLoader.files && this.inputLoader.files[0]) {

            const reader = new FileReader();

            reader.addEventListener('load', (e) => {
                this.imageElement.src = e.target.result;
            })
           
            reader.readAsDataURL(this.inputLoader.files[0]);
        }

        this.controller.handleInputs(true);
    }

    listener(){
        this.inputLoader.addEventListener('change', (e) => {this.callback(e)});
    }
}

class Close{
    constructor(controller, closeClass){
        this.controller = controller;
        this.elements = document.querySelectorAll(closeClass);
        this.init();
    }
    init(){
        this.listener();
    }
    callback(){
        this.controller.reset();
    }
    listener(){
        this.elements.forEach( (i) => {
            i.addEventListener('click', this.callback.bind(this));
        })
    }
}

class Save{
    constructor(controller, elementId){
        this.controller = controller;
        this.element = document.getElementById(elementId);
        this.init();
    }
    init(){
        this.listener();
    }
    callback(){
        this.controller.saveForm();
    }
    listener(){
        this.element.addEventListener('click', this.callback.bind(this));
    }
}

class Value{
    constructor(image, fieldName){
        this.image = document.getElementById(image)
        this.field = document.querySelector(`input[name="${fieldName}"]`)
    }
    set(imgSource){
        this.image.src = imgSource;
        this.field.value = false;
    }

}

class ModalController{
    constructor(imageId, inputLoader, radioName, closeClass, saveBtnId, imageOutModal, fieldOutMoadal){
        this.imageUpload = new ImageUpload(this, imageId, inputLoader); 
        this.radioInputs = new RadioInputs(this, radioName);
        this.close = new Close(this, closeClass);
        this.save = new Save(this, saveBtnId)
        this.value = new Value(imageOutModal, fieldOutMoadal);
    }
    saveForm(){
        let imageSrc = null;

        if(this.radioInputs.ckeckedSrc != null) imageSrc = this.radioInputs.ckeckedSrc;
        else imageSrc = this.imageUpload.imageElement.src;

        this.value.set(imageSrc)
        this.close.elements[0].click();
    }
    reset(){
        this.radioInputs.uncheck();
        this.imageUpload.reset();
    }
    handleInputs(action){
        // Action = false -> Se ha echo click en un radio, 
        // Action = true -> Se ha subido una imagen
        if(action) this.radioInputs.uncheck();
        else this.imageUpload.reset();
    }
}

// Configuracion requerida

/*
var modalConfig =  {
    // Element ID
    modalImagePreviewFile : ,
    // Element ID
    outModalImagePreview : ,
    // Element ID
    modalInputFile : ,
    // Field name 
    modalRadioInputs : ,
    // Close Modal Buttons class
    modalCloseBtn : ,
    // Save Modal Button ID 
    modalSaveBtn : ,
    // Name field
    outModalField : ,
}
*/

var modal = new ModalController(image, inputLoader, radioNames, closeButtonsClass, saveBtnId, imageOutOfModal, valueOutOfModalName)

/*
TODO:
    - Pasar parametros de configuracion genericos: por classes y/o nombres de inputs

*/