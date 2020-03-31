/*
* result field component
* */
export default class CalcResultField {
    /* constructor
     * _context - calculator component
     * _theme - css theme for component
    * */
    constructor(_context,_theme) {
        this._context = _context;
        this._theme = _theme;
        this._resultField = document.createElement('div');//create node
        this._resultField.classList.add(_theme+"-result-field");//add css class
        this._context.appendChild(this._resultField);// append node to calculator node
    }
    /*destroy method*/
    destroy(){
        this._resultField.remove();
        this._resultField = null;
        this._context = null;
    }
    /*set result*/
    setResult(_result){
        this._resultField.innerHTML = _result;
    }
    /*add or remove invalid css class*/
    setValidView(_isValid){
        if(_isValid)this._resultField.classList.remove(this._theme+"-result-field-invalid");
        else this._resultField.classList.add(this._theme+"-result-field-invalid");
    }
}