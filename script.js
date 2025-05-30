let display = document.getElementById("display");
let currentInput = ""
let currentOperator = ""


function appendNumber(value){
    currentInput += value
    display.textContent = currentInput
}

function appendOperator(operador){
    if (currentInput === "" && operador !== ".") return
    currentInput += operador;
    display.textContent = currentInput;
}

function calculate(){
    try{
        let result = eval(currentInput)
        if(!Number.isInteger (result)){
            result = result.toFixed(2)
        }
        currentInput = result;
        display.textContent = currentInput;
    } catch(error){
        display.textContent = "error";
        currentInput = "";
    }
}

function clearDisplay(){
    currentInput = "";
    display.textContent = currentInput;
}

function applyPercentage() {
    if (currentInput === "" || currentInput === "Erro") return;

    const parts = currentInput.match(/^(.*(?:[+\-*/]))?(-?\d*\.?\d+)$/);

    if (!parts) {
        const lastChar = currentInput.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            return;
        }
        const singleNumber = parseFloat(currentInput);
        if (!isNaN(singleNumber)) {
            currentInput = `(${singleNumber}/100)`;
            calculate();
        }
        return;
    }

    let baseExpressionPart = parts[1] || "";
    const lastNumberStr = parts[2];

    if (parseFloat(lastNumberStr) === 0 && baseExpressionPart.slice(-1) === '/') {
        display.textContent = "Erro";
        currentInput = "";
        return;
    }
    
    if (baseExpressionPart) {
        const operator = baseExpressionPart.slice(-1);
        let actualBaseExpression = baseExpressionPart.slice(0, -1);

        if (operator === '+' || operator === '-') {
            if (actualBaseExpression === "" || actualBaseExpression === "-") { 
                currentInput = `${actualBaseExpression}${operator}(${lastNumberStr}/100)`;
            } else {
                try {
                    let baseValue = eval(actualBaseExpression.replace(/--/g, '+'));
                    if (typeof baseValue !== 'number' || isNaN(baseValue)) {
                        throw new Error("Base para % inválida");
                    }
                    currentInput = `${actualBaseExpression}${operator}(${lastNumberStr}/100*${baseValue})`;
                } catch (e) {
                    display.textContent = "Erro";
                    currentInput = "";
                    return;
                }
            }
        } else if (operator === '*' || operator === '/') {
            currentInput = `${baseExpressionPart}(${lastNumberStr}/100)`;
        } else {
            currentInput = `(${lastNumberStr}/100)`;
        }
    } else {
        currentInput = `(${lastNumberStr}/100)`;
    }
    calculate();
}