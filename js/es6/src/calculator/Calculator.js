/*
* main component class
* */
import NumInputField from './components/NumInputField';
import CalcResultField from './components/CalcResultField';
import "./components/calc_styles.css"
export default class Calculator {
    /* constructor
    * _hostElement - html node's id
    * _theme - css theme for component , has default prefix calc
    * _isNumericValidator -  component will check only isNan
    * */
    constructor(_hostElement,_isNumericValidator,_theme = 'calc') {
        this._wrapper = document.querySelector('#'+_hostElement);// get host element
        this._theme = _theme;
        this._isNumericValidator = _isNumericValidator;
        this._hostElement = _hostElement;
        this._calculator = document.createElement('div');// create component node
        this._calculator.classList.add(_theme+"-main");// add css class
        this._wrapper.appendChild(this._calculator);// append component to DOM
        this._numsInputField = new NumInputField(this._calculator,this._isNumericValidator,_theme);// create input field
        if(!this._isNumericValidator)this._resultField = new CalcResultField(this._calculator,_theme);// create result filed
        this._calculator.addEventListener("ON_CALCULATED", (_event)=>{this.onCalcFiedChange(_event)}, false);// add event listener for handle calculate event

        this._numsInputField._inputField.addEventListener('focus',(e) => {this.onFocusFiled(e)});// add event listener for handle focus event
        this._numsInputField._inputField.addEventListener('blur',(e) => {this.onBlurFiled(e)});// add event listener for handle blur event

        this._text = '';
        this._value = null;
        this._isValid = true
    }
    /*focus event handler*/
    onFocusFiled(e){
        this._calculator.classList.add(this._theme+"-filed-on-focus");
    }
    /*blur event handler*/
    onBlurFiled(e){
        this._calculator.classList.remove(this._theme+"-filed-on-focus");
    }
    /*calculate event handler*/
    onCalcFiedChange(_event){
        this._text = _event.detail.text;
        this._value = _event.detail.value;
        this._isValid = _event.detail.isValid;
        if(!this._isNumericValidator){
            if(this.value === null) this._resultField.setResult("")
            else this._resultField.setResult(this.value ? this.value : '?');
            this._resultField.setValidView(this.isValid);
        }
        if(this._isValid)this._calculator.classList.remove(this._theme+"-main-invalid");
        else this._calculator.classList.add(this._theme+"-main-invalid");
    }

    get hostElement() {
        return this._hostElement;
    }

    set text(_value) {
        this._numsInputField.setTextInField(_value);
    }
    set value(_value) {
        this._numsInputField.setTextInField(_value);
    }

    get text() {
        return this._text;
    }
    get value() {
        return this._value;
    }
    get isValid() {
        return this._isValid;
    }
    /*destroy method*/
    destroy(){
        this._numsInputField._inputField.removeEventListener('focus',(e) => {this.onFocusFiled(e)});
        this._numsInputField._inputField.removeEventListener('blur',(e) => {this.onBlurFiled(e)});
        this._numsInputField.destroy();
        this._numsInputField = null;
        if(!this._isNumericValidator){
            this._resultField.destroy();
            this._resultField = null;
        }
        this._calculator.remove();
        this._calculator = null;
        this._wrapper = null;
    }
}

window.Calculator = Calculator