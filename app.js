//-----------------ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ----------------------
const input1 = document.getElementById('input1')
const submitBtn = document.getElementById('submit')
const plusBtn = document.getElementById('plus')
const minusBtn = document.getElementById('minus')
const multBtn = document.getElementById('mult')
const divBtn = document.getElementById('div')
const zeroBtn = document.getElementById('zero')
const oneBtn = document.getElementById('one')
const twoBtn = document.getElementById('two')
const threeBtn = document.getElementById('three')
const fourBtn = document.getElementById('four')
const fiveBtn = document.getElementById('five')
const sixBtn = document.getElementById('six')
const sevenBtn = document.getElementById('seven')
const eightBtn = document.getElementById('eight')
const nineBtn = document.getElementById('nine')
const openBtn = document.getElementById('open-parenthesis')
const closeBtn = document.getElementById('close-parenthesis')
// const cancelBtn = document.getElementById('cancel')
const squareRootBtn = document.getElementById('square-root')
const percentBtn = document.getElementById('percent')
const pointBtn = document.getElementById('point')
const signBtn = document.getElementById('sign')
const exElement = document.getElementById('ex')
const backBtn = document.getElementById('back')
//------------------------------------------------------------
let action = ''
let number = '' //ПРОВЕРИТЬ ЧТО ЭТО, ВОЗМОЖНО УПРАЗДНИТЬ
let result = 0
let operands = []
let operators = []
let math = []
let sign = 0
//let mathEx = '' УПРАЗДНИТЬ
let open = [] //Индексы операндов после открытых скобок
let close = [] //Индексы операндов перед закрывающими скобками
let openRoot = [] //Индексы операндов после открытых скобок квадратного корня
let closeRoot = [] //Индексы операндов перед закрывающими скобками квадратного корня
let input = ''
let str = ''
let unclosedRoot = 0
let rootEnclosure = 0
let g = 0 //ПРОВЕРИТЬ ЧТО ЭТО, ВОЗМОЖНО УПРАЗДНИТЬ
//----------------------------------------------------------------------
//------ ФУНКЦИЯ ПЕРЕСБОРКИ СТРОКИ С УДАЛЕНИЕМ СКОБОК -------
//----------------------------------------------------------------------
function cleanString(string) {
	let newString = ''
	for (let i = 0; i < string.length; i++) {
		if (string[i] === '(' || string[i] === ')') {
			newString += ''
		} else {
			newString = `${newString}${string[i]}`
		}
	} //for
	newString = newString.replace(/[a-zа-яё]/gi, '')

	return newString
}
//пересобрали строку без скобок для поиска операнда, последнего перед нажатием кнопки
function checking() {
	console.log(`Нажата кнопка "${action}"
OPERANDS: ${operands}
OPERATORS: ${operators}
OPEN: ${open}
CLOSE: ${close}
ROOT OPEN: ${openRoot}
ROOT CLOSE: ${closeRoot}
input: ${input}
str: ${str}
unclosedRoot: ${unclosedRoot}
rootEnclosure: ${rootEnclosure}
---------------------------------------------------`)
}
//--------------------------------------------------------------------------------
//Ф-Я ОБРАБОТКИ НАЖАТИЯ КНОПКИ ОПЕРАТОРА (КРОМЕ РАВНО): "*", "/", "-", "+"
function act(line) {
	input = line
	// sign = 0
	if (open.length > 0 || openRoot.length > 0) {
		//скобки или корни уже есть в выражении
		str = cleanString(line)
	} else {
		//скобок и корней ещё нет
		str = line
	}
	if (action === ')') {
		// math = str.split(operators[operators.length - 1])
		// operands.push(Number(math[math.length - 1]))
		if (input[input.length - 1] !== ')') {
			math = str.split(operators[operators.length - 1])
			operands.push(Number(math[math.length - 1]))
		}
		if (unclosedRoot > 0) {
			unclosedRoot -= 1
			if (unclosedRoot === 0) {
				closeRoot.push(operands.length - 1)
			} else close.push(operands.length - 1)
		} else {
			close.push(operands.length - 1)
		}
		checking()
		return (line = `${line}${action}`)
	} else if (action === '(') {
		if (unclosedRoot > 0) {
			unclosedRoot += 1
		}
		if (operators.length === 0) {
			//если это начало строки
			open.push(0)
			checking()
			return (line = `${action}${line}`)
		} else {
			open.push(operands.length)
			checking()
			return (line = `${line}${action}`)
		}
	} else if (action === 'root') {
		if (operators.length === 0) {
			//начало строки
			openRoot.push(0)
			unclosedRoot = 1
			checking()
			return (line = `sqrt(${line}`)
		} //начало строки
		else {
			//не начало строки
			if (
				str[str.length - 2] === '+' ||
				str[str.length - 2] === '-' ||
				str[str.length - 2] === '/' ||
				str[str.length - 2] === '*'
			) {
				openRoot.push(operands.length)
				unclosedRoot = 1
				// math = str.split(operators[operators.length - 1])
				// operands.push(Number(math[math.length - 1]))
				checking()
				return (line = `${input1.value}sqrt(`)
			} //строка оканчивается оператором
			else {
				return line
			}
		} //не начало строки
	} //action===root
	else {
		//если нажата не скобка и не корень: +,-,*,/
		if (operators.length === 0) {
			//еще нет операторов
			operands.push(Number(str))
		} else {
			//уже есть операторы
			if (input[input.length - 1] !== ')') {
				math = str.split(operators[operators.length - 1])
				operands.push(Number(math[math.length - 1]))
			}
		}
		operators.push(action)
		checking()
		return (line = `${line}${action}`)
	} //если нажата не скобка и не корень: +,-,*,/
} // функция act(line)
//--------------------- СОБРАЛИ СТРОКУ ---------------------
//------------------ РЕШЕНИЕ ВЫРАЖЕНИЯ БЕЗ СКОБОК.----------
function parse(str) {
	return Function(`'use strict'; return (${str})`)()
}

function calculate(x, y) {
	let calculation = 0
	if (operators.length === 0) {
		//если один операнд - ПРОСТОЕ РАВЕНСТВО
		// console.log(`ПРОСТОЕ РАВЕНСТВО`)
		return (calculation = Number(input1.value))
	} else if (operators.length > 0) {
		let step = 0
		while (operators.indexOf('*') >= 0 || operators.indexOf('/') >= 0) {
			for (let i = 0; i < operators.length; i++) {
				if (operators[i] === '*') {
					operators.splice(i, 1)
					calculation = operands[i] * operands[i + 1]
					operands.splice(i, 2, calculation)
					step += 1
					i -= 1
				} else if (operators[i] === '/') {
					operators.splice(i, 1)
					calculation = operands[i] / operands[i + 1]
					operands.splice(i, 2, calculation)
					step += 1
					i -= 1
				}
			}
		} //loop mult div
		while (operators.indexOf('+') >= 0 || operators.indexOf('-') >= 0) {
			for (let i = 0; i < operators.length; i++) {
				if (operators[i] === '+') {
					console.log(`operators ДО: ${operators}`)
					console.log(`operands ДО: ${operands}`)
					operators.splice(i, 1)
					calculation = operands[i] + operands[i + 1]
					operands.splice(i, 2, calculation)
					step += 1
					i -= 1
				} else if (operators[i] === '-') {
					operators.splice(i, 1)
					calculation = operands[i] - operands[i + 1]
					operands.splice(i, 2, result)
					step += 1
					i -= 1
				}
			}
		} //loop sum minus
		console.log(calculation)
		return calculation
	} // есть несколько операторов
} //calculate ф-я вычисления выражения без скобок
//----------------------------------------------------------
//--Ф-Я ОБРАБОТКИ КНОПКИ РАВНО "=" ----------------
//------------------------------------------------------------
submitBtn.onclick = function () {
	exElement.innerHTML = `${exElement.innerHTML}<br>${input1.value}`
	// m = 5 + 5 - (30 - 2)
	// exElement.innerHTML = typeof m эксперимент
	str = cleanString(input1.value)
	console.log(`---------------------------------------------------
Нажата кнопка "="
str (пересобранная без скобок строка) до вычислений: ${str}`)
	math = str.split(operators[operators.length - 1])
	//-----------------------------------------------------------------
	//------------------- ПОКА ЕСТЬ СКОБКИ while------------------------
	//------------------------------------------------------------------
	while (open.length > 0) {
		console.log('СКОБКИ ЕСТЬ')
		let step = 0
		let x = 0
		let y = 0
		while (
			open[y] < close[x] &&
			(open[y + 1] > close[x] || y + 1 > open.length)
		) {
			//-----------------------------------------------------------------
			//------------------- ПОКА ЕСТЬ ВЫРАЖЕНИЕ В СКОБКАХ ВИДА (a_b)-----
			//-----------------------------------------------------------------
			console.log('-----------------------')
			console.log(`ТЕКУЩЕЕ y: ${y} ТЕКУЩЕЕ x: ${x}`)
			console.log(`найден промежуток`)
			console.log(`open до вычислений: ${open}`)
			console.log(`close до вычислений: ${close}`)
			console.log('----------------------------')
		} //пока есть выражение вида (a_b)
	} //есть скобки while
	open = []
	close = []
	//------------------------------------------------------
	/*if (sign === 1) {//если все выражение под знаком минус
        mathEx = input1.value.slice(1)
        if (operators.length === 0) {//если один операнд ПРОСТОЕ РАВЕНСТВО
            operands.push(Number(mathEx))
            result = Number(mathEx)
            console.log(`простое равенство`)
        } else if (operators.length !== 0) {//если операнд не 1 и есть выражение под скобками и минусом

            mathEx = input1.value.slice(2)
            mathEx = mathEx.slice(0, -1)
        }
    } //sign = 1 */
	//------------------------------------------------------
	if (action === 'root') {
		if (sign === 1) {
			result = 'Error'
		} else {
			result = Math.sqrt(operands[0])
		}
	}
	//------------------------------------------------------
	if (sign === 1) {
		result *= -1
	}
	input1.value = result
	operands = []
	operators = []
	open = []
	close = []
	sign = 0
	exElement.innerHTML = `${exElement.innerHTML} = ${result}`
} //submitBtn

//--------НАЖАТА КНОПКА ОЧИСТКИ ПОЛЯ ВВОДА "C"-------------
cancel.onclick = function () {
	input1.value = ''
	result = 0
	operands = []
	operators = []
	//mathEx = [] УПРАЗДНИТЬ?
	sign = 0
	math = []
	open = []
	close = []
	console.log(`open: ${open}/close: ${close}`)
} //cancel

//----------------------ОЧИСТКА ИСТОРИИ ВЫЧИСЛЕНИЙ----------------------
function cancelLink() {
	exElement.innerHTML = ''
} //cancelLink

//--------------------НАЖАТА КНОПКА СМЕНЫ ЗНАКА "+/-"-----------------
signBtn.onclick = function () {
	if (operators.length === 0) {
		if (sign === 0) {
			//a
			sign = 1
			input1.value = `-${input1.value}`
			// mathEx = input1.value.slice(1) //зачем это здесь?
		} else {
			//-a
			sign = 0
			input1.value = input1.value.slice(1)
		}
	} else {
		if (sign === 0) {
			//a+b+c и -a+b+c и -(a+b)+c
			sign = 1
			input1.value = `-(${input1.value})`
		} else {
			// -(a+b+c)
			sign = 0
			input1.value = input1.value.slice(2)
			input1.value = input1.value.slice(0, -1)
		}
	}
}
zeroBtn.onclick = function () {
	number = 0
	input1.value += 0
}
pointBtn.onclick = function () {
	input1.value += '.'
}
oneBtn.onclick = function () {
	number = 1
	input1.value += 1
}
twoBtn.onclick = function () {
	number = 2
	input1.value += 2
}
threeBtn.onclick = function () {
	number = 3
	input1.value += 3
}
fourBtn.onclick = function () {
	number = 4
	input1.value += 4
}
fiveBtn.onclick = function () {
	number = 5
	input1.value += 5
}
sixBtn.onclick = function () {
	number = 6
	input1.value += 6
}
sevenBtn.onclick = function () {
	number = 7
	input1.value += 7
}
eightBtn.onclick = function () {
	number = 8
	input1.value += 8
}
nineBtn.onclick = function () {
	number = 9
	input1.value += 9
}
plusBtn.onclick = function () {
	action = '+'
	input1.value = act(input1.value)
}
minusBtn.onclick = function () {
	action = '-'
	input1.value = act(input1.value)
}
multBtn.onclick = function () {
	action = '*'
	input1.value = act(input1.value)
}
divBtn.onclick = function () {
	action = '/'
	input1.value = act(input1.value)
}
squareRootBtn.onclick = function () {
	action = `root`
	input1.value = act(input1.value)
}
percentBtn.onclick = function () {
	action = '%'
	input1.value /= 100
}
openBtn.onclick = function () {
	action = '('
	input1.value = act(input1.value)
}
closeBtn.onclick = function () {
	action = ')'
	input1.value = act(input1.value)
}

//---------------------------------------------------------------------------------
//-------------------ПОКА внутри промежутка есть + или - --------------------------
//---------------------------------------------------------------------------------
/*
while ((close[x] !== open[y]) && (((operators.indexOf('/') < 0) || (operators.indexOf('/') > close[x])) && ((operators.indexOf('*') < 0) || (operators.indexOf('*') > close[x]))) && (((operators.indexOf('+') >= 0) && (operators.indexOf('+') < close[x])) || ((operators.indexOf('-') >= 0) && (operators.indexOf('-') < close[x]))))
{
    console.log(`сложение и вычитание внутри скобок`)
    if (operators[open[y]] === '+') {
        console.log(`open[y]: ${open[y]}, operators[open[y]]: ${operators[open[y]]}, operands[open[y]]: ${operands[open[y]]}`)
        console.log(`operands до: ${operands}`)
        console.log(`operators до: ${operators}`)
        steps++
        operators.splice(open[y], 1)
        result = operands[open[y]] + operands[open[y] + 1]
        operands.splice(open[y], 2, result)
        console.log(`close до: ${close}`)
        console.log(`open до: ${open}`)
        console.log(`result: ${result}`)
        console.log(`operators После на шаге ${steps}: ${operators}`)
        console.log(`operands После на шаге ${steps}: ${operands}`)
        close = close.map((value, index, arr) => {
            return value - 1
        })

        for (let j = 0; j < open.length; j++) {
            if (j > 0) {
                open[j] -= 1
            }
        }
        console.log(`close после: ${close}`)
        console.log(`open после: ${open}`)
    } //if +
    else if (operators[open[y]] === '-') {
        console.log(`open[y]: ${open[i]}, operators[open[y]]: ${operators[open[y]]}, operands[open[y]]: ${operands[open[y]]}`)
        console.log(`operands до: ${operands}`)
        console.log(`operators до: ${operators}`)
        steps++
        operators.splice(open[y], 1)
        result = operands[open[y]] - operands[open[y] + 1]
        operands.splice(open[y], 2, result)
        console.log(`close до: ${close}`)
        console.log(`open до: ${open}`)
        console.log(`result: ${result}`)
        console.log(`operators После на шаге ${steps}: ${operators}`)
        console.log(`operands После на шаге ${steps}: ${operands}`)
        close = close.map((value, index, arr) => {
            return value - 1
        })

        for (let j = 0; j < open.length; j++) {
            if (j > 0) {
                open[j] -= 1
            }
        }
        console.log(`close после: ${close}`)
        console.log(`open после: ${open}`)
    }// -
} //while + -
*/
