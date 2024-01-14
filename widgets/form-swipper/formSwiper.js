class NavBarElement{
    constructor(parent, config){
        this.parent = document.getElementById(config['parentElementId']).firstElementChild;
        this.nextText = config['text']['next'];
        this.backText = config['text']['back'];
        this.submitText = config['text']['submit'];
        this.nextBtnId = 'formSliderNextBtn';
        this.backBtnId = 'formSliderBackBtn';
        this.submitBtnId = 'formSliderSubmitBtn'
        this.create();
    }
    create(){
        // Crear elemento Nav
        let nav = document.createElement('nav');

        // Crear contenedores para los botones
        let leftContainer = document.createElement('div');
        let rigthContainer = document.createElement('div');;

        // Crear botones
        let backBtnElement = document.createElement('button');
        let nextBtnElement = document.createElement('button');
        let submitBtnElement = document.createElement('button');
        // Insertar Texto para los botones y atributo Type y Id
        backBtnElement.textContent = this.backText;
        backBtnElement.setAttribute('type', 'button');
        backBtnElement.id = this.backBtnId;

        nextBtnElement.textContent = this.nextText;
        nextBtnElement.setAttribute('type', 'button')
        nextBtnElement.id = this.nextBtnId;

        submitBtnElement.textContent = this.submitText;
        submitBtnElement.setAttribute('type', 'submit');
        submitBtnElement.id = this.submitBtnId;

        // Configurar el estado de los botones por defecto
        backBtnElement.disabled = true;
        backBtnElement.ariaDisabled = true;
        nextBtnElement.disabled = true;
        nextBtnElement.ariaDisabled = true;
        submitBtnElement.style.display = 'none';
        submitBtnElement.disabled = true;
        submitBtnElement.ariaDisabled = true;

        // Insertar gerarquicamente de menos a mas
        leftContainer.appendChild(backBtnElement);
        rigthContainer.appendChild(nextBtnElement);
        rigthContainer.append(submitBtnElement);

        nav.appendChild(leftContainer);
        nav.appendChild(rigthContainer);

        this.parent.appendChild(nav);
    }
}

class NavbarSwipper{
    constructor(parent, config){
        this.parent = parent;
        this.element = new NavBarElement(parent, config) 
        this.nextBtn = document.getElementById(this.element.nextBtnId);
        this.backBtn = document.getElementById(this.element.backBtnId);
        this.submitBtn = document.getElementById(this.element.submitBtnId);
        this.submitCallback = config['submitCallback']
        this.start();
    }

    start(){
        // Rutinas para inicializar en el constructor
        this.pushListener();
    }

    pushListener(){
        this.nextBtn.addEventListener('click', () => {this.parent.scrollAction(true)})
        this.backBtn.addEventListener('click', () => {this.parent.scrollAction(false)})
        this.submitBtn.addEventListener('click', (event) => {this.submitCallback(event)})
    }

    updateState(){
        // Si es la primera pagina, desahabilitar el backBtn
        if(this.parent.pageIndex > 0 ){
            this.backBtn.ariaDisabled = false;
            this.backBtn.disabled = false;
        }else{
            this.backBtn.ariaDisabled = true;
            this.backBtn.disabled = true;
        }
        // Definir y renderizar si next sera "next" o "submit"
        let nextBtn;
        if(this.parent.pageIndex == this.parent.maxPageIndex){
            this.nextBtn.style.display = "none";
            this.submitBtn.style.display = "inline";
            nextBtn = this.submitBtn;
        } 
        else{
            this.nextBtn.style.display = "inline";
            this.submitBtn.style.display = "none";
            nextBtn = this.nextBtn;
        }

        // Validar si la pagina actual tiene el next desbloqueado
        let unlockNext = this.parent.pageProgress.includes(this.parent.pageIndex);
        nextBtn.ariaDisabled = !unlockNext;
        nextBtn.disabled = !unlockNext;
    }
}

export class FormSwipper{
    constructor(config){
        this.parent = document.getElementById(config['parentElementId']);
        this.pages = document.getElementsByClassName(config['pagesClass']);
        this.navBar = new NavbarSwipper(this, config);
        this.pageIndex = 0;
        this.minPagesIndex = 0
        this.maxPageIndex = (this.pages.length) - 1;
        this.pageProgress = [];
        this.submit = config['submitCallback'];
        this.theme = new ThemeColors(config['theme'] ? config['theme'] : null);
        this.start();
    }
    // Metodo para inicializar el estilo: Solo visible la primera pagina y ocultar las otras
    start(){
        for(let i = 0; i < this.pages.length; i++){
            if(i == 0) this.pages[i].style.display = "Block";
            else this.pages[i].style.display = "None";
            
        }
    }

    nextBtnEnabled(bool){
        // Activar o desactivar botones
        if(this.pageIndex == this.maxPageIndex){
            this.navBar.submitBtn.ariaDisabled = !bool;
            this.navBar.submitBtn.disabled = !bool;
        }
        else{
            this.navBar.nextBtn.ariaDisabled = !bool;
            this.navBar.nextBtn.disabled = !bool;
        }
        // Actualizar Progresso: Caso el parametro bool sea true, desbloquear page
        // caso contrario, sacar de la lista de desbloqueos
        if(this.pageProgress.includes(this.pageIndex) == false && bool){
            this.pageProgress.push(this.pageIndex);
        }
        else{
            let removeProgres = this.pageProgress.indexOf(this.pageIndex);
            if(removeProgres !== -1) this.pageProgress.splice(removeProgres, 1);
        }
    }

    submitBtnEnabled(bool){
        this.navBar.submitBtn.ariaDisabled = !bool;
        this.navBar.submitBtn.disabled = !bool;
        // Actualizar Progresso
        if(this.pageProgress.includes(this.pageIndex) == false) this.pageProgress.push(this.pageIndex);
    }

    scrollAction(action){
        // Si true = next, elese back
        this.pages[this.pageIndex].style.display = "None";

        if(action){
            // Validar si ha llegado al final
            if(this.pageIndex < this.maxPageIndex) this.pageIndex++; // Siguiente pagina
            else ; // Ultima accion callbackForm
        } 
        else{
            if(this.pageIndex > this.minPagesIndex) this.pageIndex--;
        } 

        this.pages[this.pageIndex].style.display = "Block";

        //Actualizar estado
        this.update();
    }

    update(){
        this.navBar.updateState();
    }
    
}

export class FormHandler{
    constructor(formSwiper){
        this.form = formSwiper
    }
}

class ThemeColors{
    constructor(theme = null){
        this.defaultTheme = {
            formSwipperColor : "#438ce6",
            formSwipperColorDisabled: "#6d6d6d",
            formSwipperBackGround : "#ffffff",
            formSwipperColorBorder : "#b4b4b4ac",
        }
        this.theme = theme;

        this.render();
    }
    setTheme(theme){
        this.theme = theme;
        this.render();
    }
    render(){
        // Cargar tema por defecto
        for (const [key, value] of Object.entries(this.defaultTheme)) {
                document.documentElement.style.setProperty(`--${key}`, `${value}`)
            }
        // Sobreescribir si hay un tema en la configuracion
        if(this.theme != null){
            for (const [key, value] of Object.entries(this.theme)) {
                document.documentElement.style.setProperty(`--${key}`, `${value}`)
            }
        }
        
    }
}
