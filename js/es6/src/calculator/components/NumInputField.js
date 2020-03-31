/*
* input field and calculate component
* */
export default class NumInputField {
    /* constructor
    * _context - calculator component
    * _theme - css theme for component
    * */
    constructor(_context,_isNumericValidator,_theme) {
       this._context = _context;
       this._theme = _theme;
       this._isNumericValidator = _isNumericValidator;
       this._inputField = document.createElement('input');//create node
       this._inputField.classList.add(_theme+"-input-field"+(_isNumericValidator ? "-validator":""));//add css class
       /*add input attributes*/
       this._inputField.setAttribute('type',"text");
       this._inputField.setAttribute('pattern',"[0-9]");
       this._inputField.setAttribute('inputmode',"tel");
       this._context.appendChild(this._inputField);// append node to calculator node
       this._text = '';
       this._value = null;
       this._isValid = true
       this._inputField.addEventListener('input',(e) => {this.onChangeField(e)});//add listener for handle input data to field
    }

    /*destroy method*/
    destroy(){
        this._inputField.removeEventListener('input',(e) => {this.onChangeField(e)});
        this._inputField.remove();
        this._inputField = null;
        this._context = null;
    }
    /*input handler*/
    onChangeField(e){
        this.onValueSeted();
    }
    /*make calculate and dispatch event*/
    onValueSeted(){
        this._text = this._inputField.value;
        if(!this._isNumericValidator){
            this._inputValue = "("+this._inputField.value+")";
            this._inputValue =  this._inputValue.replace(/\s/g,"");//remove all spaces in input value
            this.normalize();
        }//make calculate and analysis of value
        else {
            this._inputValue = this._inputField.value;
            this.validateNumber();
        }

        /*add or remove invalid css class*/
        if(this._isValid)this._inputField.classList.remove(this._theme+"-input-field-invalid");
        else this._inputField.classList.add(this._theme+"-input-field-invalid");

        let event = new CustomEvent("ON_CALCULATED", {bubbles: true, cancelable: true,detail:{value:this._value,isValid:this._isValid,text:this._text}});
        this._inputField.dispatchEvent(event);// dispatch event with calculated data
    }

    validateNumber(){

        let txt = this._inputValue.replace("(","").replace(")","");
        this._isValid = !isNaN(this._inputValue);
        if(this._isValid){
            this._value = txt == "" ? null : txt;
        }else{
            this._value = undefined;
        }
    }

    /*method for calculate and analysis of value*/
    normalize(){
        let result = this._inputValue.match(/\(-?[0-9]\d*(\.\d+)?([+-/*]\d+)+\)/g);// analyze input data for valid
        /*simplify the string for calculate
        * for exaple make (2+3)*5-10 = > (5)*5-10 = > 25-10
        * */
        while (result){
            for(let i = 0;i<result.length;i++){
                let block = result[i];
                block = this.calculate(block,"*");//calculate block with multiplication
                block = this.calculate(block,"/");//calculate block with devision
                block = this.calculate(block,"+");//calculate block with sum
                block = this.calculate(block,"-");//calculate block with subtraction
                this._inputValue = this._inputValue.replace(result[i],block)
            }
            result = this._inputValue.match(/\(-?[0-9]\d*(\.\d+)?([+-/*]\d+)+\)/g);
        }
        /*============================================================================*/
        let txt = this._inputValue.replace("(","").replace(")","");
        this._isValid = !isNaN(txt);
        if(this._isValid){
            this._value = txt == "" ? null : txt;
        }else{
            this._value = undefined;
        }

        console.log("RESULT = "+this._value+" isValid "+this._isValid);
    }

    /*create patterns for search data in string*/
    getPattern(_name){
        let patterns = [];
        switch (_name){
            case "*":
                patterns.push(/-?[0-9]\d*(\.\d+)?[*][0-9]\d*(\.\d+)?/);
                patterns.push(/[*]/);
                break;
            case "/":
                patterns.push(/-?[0-9]\d*(\.\d+)?[/][0-9]\d*(\.\d+)?/);
                patterns.push(/[/]/);
                break;
            case "+":
                patterns.push(/-?[0-9]\d*(\.\d+)?[+][0-9]\d*(\.\d+)?/);
                patterns.push(/[+]/);
                break;
            case "-":
                patterns.push(/-?[0-9]\d*(\.\d+)?[-][0-9]\d*(\.\d+)?/);
                patterns.push(/[-]/);
                break;
        }
        return patterns;
    }
    /*calculate block*/
    calculate(_operation,_option){
        let mOperation = _operation;
        let pattern = this.getPattern(_option);
        let multy = mOperation.match(pattern[0]);

        while (multy){
            let multyStep = multy['0'].match(pattern[1]);
            let multyInput = multyStep.input;


            let i = 0;
            let a = '';
            let b = '';
            for(i = 0;i<multyStep.index;i++){
                a+=multyInput[i];
            }
            for(i = multyStep.index+1;i<multyInput.length;i++){
                b+=multyInput[i];
            }
            //   console.log(" a= "+a+" b= "+b)
            switch (_option){
                case "*":
                    mOperation = mOperation.replace(multyInput,parseFloat(a)*parseFloat(b));
                    break;
                case "/":
                    mOperation = mOperation.replace(multyInput,parseFloat(a)/parseFloat(b));
                    break;
                case "+":
                    mOperation = mOperation.replace(multyInput,parseFloat(a)+parseFloat(b));
                    break;
                case "-":
                    mOperation = mOperation.replace(multyInput,parseFloat(a)-parseFloat(b));
                    break;
            }
            multy = mOperation.match(pattern[0]);
        }
        return mOperation.replace("(","").replace(")","");
    }

    setTextInField(_value) {
       this._inputField.value = _value;
       this.onValueSeted();
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

}