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
const cBtn = document.getElementById('c')
const squareRootBtn = document.getElementById('square-root')
const percentBtn = document.getElementById('percent')
const pointBtn = document.getElementById('point')
const signBtn = document.getElementById('sign')
const exElement = document.getElementById('ex')
const backBtn = document.getElementById('back')
const inputpercent = document.getElementById('inputpercent')
const inputpercentfrom = document.getElementById('inputpercentfrom')
const percentin = document.getElementById('percentin')
const selectRound = document.getElementById('inputRound')
const pi = document.getElementById('pi')
//------------------------------------------------------------
let result = 0
let sign = 0
let str = ''
let unclosedRoot = []
let subSqrt = ''
let minusStart = 0
let focus = 0
let resultnew = 0
let fix = 3
//----------------------------------------------------------------------
//----функция, определяющая выбранное число знаков после запятой для результата
function select(select) {
	if (select === '0') {
		return 0
	} else if (select === '1') {
		return 1
	} else if (select === '2') {
		return 2
	} else if (select === '3') {
		return 3
	} else if (select === '4') {
		return 4
	} else if (select === '5') {
		return 5
	} else if (select === '6') {
		return 6
	} else if (select === '7') {
		return 7
	} else if (select === '8') {
		return 8
	} else if (select === '9') {
		return 9
	} else if (select === '10') {
		return 10
	}
}
//--------------------
function checking() {
	console.log(`str: ${str}
input1.value: ${input1.value}
unclosedRoot: ${unclosedRoot}(массив выражений под корнем) ${unclosedRoot.length} элементов
result: ${result}
sign: ${sign}
minusStart: ${minusStart}
inputpercent: ${inputpercent.value}
inputpercentfrom: ${inputpercentfrom.value}
focus: ${focus}
fix: ${fix}
--------------------------------------`)
}
//-------------Ф-Я ОПРЕДЕЛЯЮЩАЯ, ЕСТЬ ЛИ НЕЗАКРЫТАЯ СКОБКА В ВЫРАЖЕНИИ ПОД КОРНЕМ
function braceCounter(subSqrt) {
	let closeCounter = 0
	let openCounter = 0
	for (let i = 0; i < subSqrt.length; i++) {
		if (subSqrt[i] === '(') {
			openCounter += 1
		} else if (subSqrt[i] === ')') {
			closeCounter += 1
		}
	} //for
	console.log(`openCounter: ${openCounter}
		closeCounter: ${closeCounter}`)
	if (closeCounter < openCounter) {
		return true
	} else {
		return false
	}
}
//------------------------------
//----Ф-Я ОБРАБОТКИ НАЖАТИЯ КНОПОК act(line,action)-----------------
function act(line, action) {
	if (action === ')') {
		if (unclosedRoot.length > 0) {
			let lastRoot = unclosedRoot.at(-1)
			if (braceCounter(lastRoot)) {
				str += ')'
			} //braceCounter
			else {
				str += ')**(1/2))'
				unclosedRoot.pop()
				if (unclosedRoot.length > 0) {
					unclosedRoot.at(-1).replace('sqr', lastRoot)
				}
			}
		} else {
			str += ')'
		}
		checking()
		return (line = `${line})`)
	} //)
	else if (action === 'root') {
		let strnew = ''
		if (unclosedRoot.length > 0) {
			unclosedRoot.at(-1) + 'sqr'
		}
		unclosedRoot.push('')
		if (str.length > 1) {
			//уже не начало строки
			strnew = ` ${str}`
			strnew = strnew.slice(1)
		}
		console.log(`strnew: ${strnew}`)
		if (containsMathOperators(strnew)) {
			str += '(('
			checking()
			return (line = `${line}√(`)
		} else {
			str = `((${str}`
			checking()
			return (line = `√(${line}`)
		}
	} //root
	else if (action === '(') {
		if (
			line[line.length - 1] === ')' ||
			line[line.length - 1] === '0' ||
			line[line.length - 1] === '1' ||
			line[line.length - 1] === '2' ||
			line[line.length - 1] === '3' ||
			line[line.length - 1] === '4' ||
			line[line.length - 1] === '5' ||
			line[line.length - 1] === '6' ||
			line[line.length - 1] === '7' ||
			line[line.length - 1] === '8' ||
			line[line.length - 1] === '9'
		) {
			str += '*('
			if (unclosedRoot.length > 0) {
				unclosedRoot[unclosedRoot.length - 1] += '*('
			}
		} else {
			str += '('
			if (unclosedRoot.length > 0) {
				unclosedRoot[unclosedRoot.length - 1] += '('
			}
		}
		checking()
		return (line = `${line}(`)
	} //(
	else {
		if (str[str.length - 1] === ')' && sign === 1 && checkLast(str)) {
			minusStart = 1
		}
		str += action
		if (unclosedRoot.length > 0) {
			unclosedRoot[unclosedRoot.length - 1] += action
		}
		checking()
		return (line = `${line}${action}`)
	} //не скобка и не корень
} //function act(line, action)
//--------------------- СОБРАЛИ СТРОКУ ---------------------
//------------------ РАСПАРСИВАНИЕ СТРОКИ И ВЫЧИСЛЕНИЕ----------
function parse(ex) {
	return Function(`'use strict'; return (${ex})`)()
}
//--Ф-Я ОБРАБОТКИ КНОПКИ РАВНО "=" ----------------
function getResult() {
	fix = select(selectRound.value)
	if (unclosedRoot.length > 0) {
		input1.value = act(input1.value, ')')
	}
	// To stop monitoring
	document.removeEventListener('focus', handleFocus, true)
	document.removeEventListener('blur', handleBlur, true)
	focus = 0
	str = ` ${str}`
	str.replace(/[a-zA-Zа-яА-ЯёЁ]/g, '')
	str = str.replace(/\s/g, '')
	console.log(`очищенная строка ${str}`)
	str = parse(str)
	console.log(`Распарсили строку: ${str}`)
	if (inputpercent.value.length > 0) {
		inputpercent.value.replace(/[a-zA-Zа-яА-ЯёЁ]/g, '')
		inputpercent.value = inputpercent.value.replace(/\s/g, '')
		inputpercent.value = parse(inputpercent.value)
		result = ((inputpercent.value * str) / 100).toFixed(fix)
		str = result
		exElement.innerHTML += `<br/>${inputpercent.value} % от ${inputpercentfrom.value} = ${result}`
		input1.style.display = 'inline-block'
		percentin.style.display = 'none'
		input1.value = result
		inputpercent.value = ''
		inputpercentfrom.value = ''
		checking()
	} else {
		result = Number(str).toFixed(fix)
		if (result < 0) {
			sign = 1
			str = ` ${str}`
			// resultnew = str.slice(1)
			// resultnew = Number(resultnew)
		}
		if (result === 'Infinity' || result === '-Infinity') {
			result = 'Error'
			str = ''
			console.log(`Please, do not try to divide by zero`)
		} else if (isNaN(result)) {
			result = 'Error'
			str = ''
			console.log(
				`Please, do not try to take the root of the negative expression`
			)
		}
		exElement.innerHTML += `<br/>${input1.value} = ${result}`
	}
	input1.value = result
	unclosedRoot.length = 0
	minusStart = 0
	console.log(`after all:`)
	checking()
	return result
}
submitBtn.onclick = function () {
	submitBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	getResult()
} //submitBtn
//------------------ОТСЛЕЖИВАНИЕ ФОКУСА НА ЭЛЕМЕНТЕ
// Function to handle focus events
function handleFocus(event) {
	const focusedElement = document.activeElement
	if (focusedElement.id === 'inputpercent') {
		focus = 1
	} else if (focusedElement.id === 'inputpercentfrom') {
		focus = 2
	} else if (focusedElement.id === 'input1') {
		focus = 0
	}
	console.log(`FOCUSED ELEMENTS ID: ${focusedElement.id}
		focus: ${focus}`)
	// You can add more properties or custom logic here
}

//Function to handle blur events (optional)
function handleBlur(event) {
	console.log('Element lost focus:', event.target)
}

// To stop monitoring
// document.removeEventListener('focus', handleFocus, true);
// document.removeEventListener('blur', handleBlur, true);

//--------------
//--------НАЖАТА КНОПКА ОЧИСТКИ ПОЛЯ ВВОДА "C"-------------
function cancelit() {
	input1.value = ''
	str = ''
	inputpercent.value = ``
	inputpercentfrom.value = ``
	result = 0
	sign = 0
	subSqrt = ''
	minusStart = 0
	resultnew = 0
	unclosedRoot.length = 0
	focus = 0
	fix = select(selectRound.value)
	input1.style.display = 'inline-block'
	percentin.style.display = 'none'
	checking()
	// To stop monitoring
	document.removeEventListener('focus', handleFocus, true)
	document.removeEventListener('blur', handleBlur, true)
}
cBtn.onclick = function () {
	cancelit()
	cBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
}

//----------------------ОЧИСТКА ИСТОРИИ ВЫЧИСЛЕНИЙ----------------------
function cancelLink() {
	exElement.innerHTML = ''
} //-----------------------------------cancelLink
function containsMathOperators(check) {
	// Regular expression to match +, -, * or /
	const regex = /[+\-*/]/
	// Test the string against the regular expression
	return regex.test(check)
}
//--------------------НАЖАТА КНОПКА СМЕНЫ ЗНАКА "+/-"-----------------
signBtn.onclick = function () {
	signBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (
		str[str.length - 1] === '-' ||
		str[str.length - 1] === '/' ||
		str[str.length - 1] === '+' ||
		str[str.length - 1] === '*'
	) {
		console.log(`Please, continue your expression`)
	} else {
		if (sign === 0) {
			if (containsMathOperators(str)) {
				str = `-(${str})`
				input1.value = `-(${input1.value})`
			} else {
				str = `-${str}`
				input1.value = `-${input1.value}`
			}
			sign = 1
			console.log(`PRESS KEY "SIGN" & sign=${sign}`)
		} else {
			//sign = 1
			if (minusStart === 1) {
				str = `-(${str})`
				input1.value = `-(${input1.value})`
			} else {
				let strnew = ` ${str.slice(1)}`
				if (containsMathOperators(strnew)) {
					str = str.slice(2)
					str = str.slice(0, -1)
					input1.value = input1.value.slice(2)
					input1.value = input1.value.slice(0, -1)
				} else {
					if (typeof str === 'number') {
						console.log(`type of str ${typeof str}
				str ${str}`)
						str = str.toString()
						// str = ` ${str}`
						// input1.value = ` ${input1.value}`
						input1.value = input1.value.toString()
						console.log(`new type of str ${typeof str}`)
					}
					str = str.slice(1)
					input1.value = input1.value.slice(1)
				}
				sign = 0
			}
			console.log(`PRESS KEY "SIGN" & sign=${sign}`)
		}
	} //защита от дурака
}
zeroBtn.onclick = function () {
	zeroBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '0')
	} else if (focus === 1) {
		inputpercent.value += '0'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '0')
	}
}

pointBtn.onclick = function () {
	pointBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (checkLast(str)) {
		if (focus === 0) {
			input1.value = act(input1.value, '.')
		} else if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, '.')
		}
	}
	if (focus === 1) {
		inputpercent.value += '.'
	}
}
oneBtn.onclick = function () {
	oneBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '1')
	} else if (focus === 1) {
		inputpercent.value += '1'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '1')
	}
}
twoBtn.onclick = function () {
	twoBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '2')
	} else if (focus === 1) {
		inputpercent.value += '2'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '2')
	}
}
threeBtn.onclick = function () {
	threeBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '3')
	} else if (focus === 1) {
		inputpercent.value += '3'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '3')
	}
}
fourBtn.onclick = function () {
	fourBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '4')
	} else if (focus === 1) {
		inputpercent.value += '4'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '4')
	}
}
fiveBtn.onclick = function () {
	five.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '5')
	} else if (focus === 1) {
		inputpercent.value += '5'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '5')
	}
}
sixBtn.onclick = function () {
	sixBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '6')
	} else if (focus === 1) {
		inputpercent.value += '6'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '6')
	}
}
sevenBtn.onclick = function () {
	if (focus === 0) {
		input1.value = act(input1.value, '7')
	} else if (focus === 1) {
		inputpercent.value += '7'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '7')
	}
}
eightBtn.onclick = function () {
	eightBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '8')
	} else if (focus === 1) {
		inputpercent.value += '8'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '8')
	}
}
nineBtn.onclick = function () {
	nineBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '9')
	} else if (focus === 1) {
		inputpercent.value += '9'
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '9')
	}
}
function checkLast(line) {
	if (
		line[line.length - 1] !== '+' &&
		line[line.length - 1] !== '-' &&
		line[line.length - 1] !== '*' &&
		line[line.length - 1] !== '/' &&
		line[line.length - 1] !== '.' &&
		line[line.length - 1] !== '('
	) {
		return true
	}
}
pi.onclick = function () {
	if (focus === 0) {
		input1.value += 'π'
	} else if (focus === 2) {
		inputpercentfrom.value += 'π'
	}
	str += Math.PI
	checking()
}
plusBtn.onclick = function () {
	plusBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (checkLast(str)) {
		if (focus === 0) {
			input1.value = act(input1.value, '+')
		} else if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, '+')
		}
	}
}
minusBtn.onclick = function () {
	minusBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (
		str.at(-1) !== '+' &&
		str.at(-1) !== '-' &&
		str.at(-1) !== '*' &&
		str.at(-1) !== '/' &&
		str.at(-1) !== '.'
	) {
		if (focus === 0) {
			input1.value = act(input1.value, '-')
		} else if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, '-')
		}
	}
}
multBtn.onclick = function () {
	multBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (checkLast(str)) {
		if (focus === 0) {
			input1.value = act(input1.value, '*')
		} else if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, '*')
		}
	}
}
divBtn.onclick = function () {
	divBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (checkLast(str)) {
		if (focus === 0) {
			input1.value = act(input1.value, '/')
		} else if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, '/')
		}
	}
}
squareRootBtn.onclick = function () {
	squareRootBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, 'root')
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, 'root')
	}
}
percentBtn.onclick = function () {
	percentBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	action = '%'
	input1.style.display = 'none'
	percentin.style.display = 'flex'
	inputpercentfrom.value = input1.value
	// Add event listeners
	document.addEventListener('focus', handleFocus, true)
	document.addEventListener('blur', handleBlur, true)
}
openBtn.onclick = function () {
	openBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (focus === 0) {
		input1.value = act(input1.value, '(')
	} else if (focus === 2) {
		inputpercentfrom.value = act(inputpercentfrom.value, '(')
	}
}
closeBtn.onclick = function () {
	closeBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (checkLast(str)) {
		if (focus === 0) {
			input1.value = act(input1.value, ')')
		} else if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, ')')
		}
	}
}
backBtn.onclick = function () {
	backBtn.addEventListener('click', (event) => {
		event.preventDefault();
	});
	if (str[str.length - 1] === ')' && str.includes('**')) {
		console.log(`Please press C key`)
	} else {
		if (str[str.length - 1] === '(' && unclosedRoot === 1) {
			unclosedRoot = 0
			input1.value = input1.value.slice(0, -2)
		} //есть открытый корень
		else {
			input1.value = input1.value.slice(0, -1)
		}
		console.log(`type of str ${typeof str}
		str ${str}`)
		if (typeof str === 'number') {
			str = ` ${str}`
			console.log(`new type of str ${typeof str}`)
		}
		str = str.substring(0, str.length - 1)
		console.log(`new string ${str}`)
	} //нет закрытого корня
}
document.addEventListener('keydown', function (event) {
	if (event.code !== 'Backspace') {
		event.preventDefault()
	}
	if (event.code == 'Digit1' || event.code == 'Numpad1') {
		keyact('1')
	} else if (event.code == 'Digit2' || event.code == 'Numpad2') {
		keyact('2')
	} else if (event.code == 'Digit3' || event.code == 'Numpad3') {
		keyact('3')
	} else if (event.code == 'Digit4' || event.code == 'Numpad4') {
		keyact('4')
	} else if (event.code == 'Digit5' || event.code == 'Numpad5') {
		keyact('5')
	} else if (event.code == 'Digit6' || event.code == 'Numpad6') {
		keyact('6')
	} else if (event.code == 'Digit7' || event.code == 'Numpad7') {
		keyact('7')
	} else if (
		(event.code == 'Digit8' || event.code == 'Numpad8') &&
		!event.shiftKey
	) {
		keyact('8')
	} else if (
		(event.code == 'Digit9' || event.code == 'Numpad9') &&
		!event.shiftKey
	) {
		keyact('9')
	} else if (
		(event.code == 'Digit0' || event.code == 'Numpad0') &&
		!event.shiftKey
	) {
		keyact('0')
	} else if (event.code == 'Minus' || event.code == 'NumpadSubtract') {
		if (checkLast(str) && (focus === 2 || focus === 0)) {
			if (
				str.at(-1) !== '+' &&
				str.at(-1) !== '-' &&
				str.at(-1) !== '*' &&
				str.at(-1) !== '/' &&
				str.at(-1) !== '.'
			) {
				if (focus === 0) {
					input1.value = act(input1.value, '-')
				} else if (focus === 2) {
					inputpercentfrom.value = act(inputpercentfrom.value, '-')
				}
			}
		}
	} else if (event.code == 'Period' || event.code == 'NumpadDecimal') {
		if (checkLast(str)) {
			if (focus === 0) {
				input1.value = act(input1.value, '.')
			} else if (focus === 2) {
				inputpercentfrom.value = act(inputpercentfrom.value, '.')
			}
		}
		if (focus === 1) {
			inputpercent.value += '.'
		}
	} else if (
		(event.code == 'Digit8' && event.shiftKey) ||
		event.code == 'NumpadMultiply'
	) {
		if (checkLast(str) && (focus === 2 || focus === 0)) {
			keyact('*')
		}
	} else if (
		(event.code == 'Equal' && event.shiftKey) ||
		event.code == 'NumpadAdd'
	) {
		if (checkLast(str) && (focus === 2 || focus === 0)) {
			keyact('+')
		}
	} else if (event.code == 'Digit0' && event.shiftKey) {
		if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, ')')
		} else if (focus === 0) {
			input1.value = act(input1.value, ')')
		}
	} else if (event.code == 'Digit9' && event.shiftKey) {
		if (focus === 2) {
			inputpercentfrom.value = act(inputpercentfrom.value, '(')
		} else if (focus === 0) {
			input1.value = act(input1.value, '(')
		}
	} else if (event.code == 'Slash' || event.code == 'NumpadDivide') {
		if (checkLast(str) && (focus === 2 || focus === 0)) {
			keyact('/')
		}
	} else if (event.code == 'Enter') {
		getResult()
	} //Enter
	else if (event.code == 'Backspace') {
		if (result === 'Error') {
			cancelit()
		} else if (str[str.length - 1] === ')' && str.includes('**')) {
			console.log(`Please press C key`)
			event.preventDefault()
		} else {
			if (str[str.length - 1] === '(' && unclosedRoot === 1) {
				unclosedRoot = 0
				input1.value = input1.value.slice(0, -2)
			} //есть открытый корень
			console.log(`type of str ${typeof str}
			str ${str}`)
			if (typeof str === 'number') {
				str = ` ${str}`
				console.log(`new type of str ${typeof str}`)
			}
			str = str.substring(0, str.length - 1)
			console.log(`new string ${str}`)
		} //нет закрытого корня
	} //backspace
	else if (event.code == 'KeyC') {
		cancelit()
	} //Cancel
})
//----------ОБРАБОТКА КЛАВИАТУРЫ----
function keyact(action) {
	if (action === ')') {
		str += action
	} else if (action === '(') {
		if (
			line[line.length - 1] === ')' ||
			line[line.length - 1] === '0' ||
			line[line.length - 1] === '1' ||
			line[line.length - 1] === '2' ||
			line[line.length - 1] === '3' ||
			line[line.length - 1] === '4' ||
			line[line.length - 1] === '5' ||
			line[line.length - 1] === '6' ||
			line[line.length - 1] === '7' ||
			line[line.length - 1] === '8' ||
			line[line.length - 1] === '9'
		) {
			str = `${str}*(`
		} else {
			str += action
		}
	} else {
		if (focus === 2) {
			inputpercentfrom.value += action
		} else if (focus === 1) {
			inputpercent.value += action
		} else {
			input1.value += action
			str += action
		}
	}
}
