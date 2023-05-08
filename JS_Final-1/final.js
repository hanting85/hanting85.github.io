//Global variables
let divReg, divMain; 

document.addEventListener("DOMContentLoaded", function(event){
	//Reference to div element Registered
	divReg = document.getElementById("divRegistered");
	//Reference to main div element for event bubbling of focus and blur for all input elements
	divMain = document.getElementById("divMain");
	//Assign all form input and password elements into array
	//0 = txtLogin, 1 = txtPassword, 2 = txtConfirmPassword, 3 = txtEmail, 4 = txtConfirmEmail
	let inputElements = document.querySelectorAll("#frmRegister input[type=text], input[type=password]");
	//Assign all form span elements into array
	//0 = spnLogin, 1 = spnPasswordComplexity, 2 = spnPasswordCompare, 3 = spnEmail, 4 = spnEmailCompare	
	let spanElements  = document.querySelectorAll("#frmRegister span");
	/* FOR TESTING PURPOSES ONLY
	for (let i = 0; i < spanElements.length;i++){
		alert(spanElements[i].id);
	}
	*/
	//Listening to onsubmit event for form validation
	document.getElementById("frmRegister").addEventListener('submit', function(event){ fFormValidate(event, spanElements);});
	//Emphazing input focus by changing style properties
	divMain.addEventListener('focus',fHandleEnter,true);	
	divMain.addEventListener('blur',fHandleExit,true);
	//Input event for txtLogin to check length, ARGS: txtLogin.value.length, config min length, config max length, spnLogin
	inputElements[0].addEventListener('input', function() {fCheckLength(this.value.length,spanElements[0]);});
	//Input event for txtPassword to display password complexity rules, ARGS: txtPassword.value, spnPassword, txtConfirmPassword, spnPasswordCompare
	inputElements[1].addEventListener('input', function() {fPasswordComplexity(this.value,spanElements[1],inputElements[2], spanElements[2]);});
	//Blur event for txtPasswordCompare to ensure password entered matches, ARGS: txtPassword, txtPasswordCompare, spanPasswordCompare
	inputElements[2].addEventListener('blur', function() {fCompareInput(inputElements[1].value, this.value, spanElements[2]);});
	//Input event for txtEmail to display valid email, ARGS: txtEmail.value, spnEmail, txtConfirmEmail, spnEmailCompare
	inputElements[3].addEventListener('input', function() {fValidateEmail(this.value,spanElements[3],inputElements[4], spanElements[4]);});	
	//Blur event for txtEmailCompare to ensure password entered matches, ARGS: txtEmail, txtEmailCompare, spanEmailCompare
	inputElements[4].addEventListener('blur', function(event) {fCompareInput(inputElements[3].value, this.value, spanElements[4]);});
	//Invoke process form function everytime the document is loaded
	fProcessForm();	
});


function fHandleEnter(e){
	//Only change background on input type = text and password elements --> exclude submit button
	if(e.target.type.toLowerCase() != 'submit')
		e.target.style.backgroundColor= color.YELLOW;
}
function fHandleExit(e){
		//Remove background style, no need to test for specific elements
		e.target.style.backgroundColor="";
}

function fValidateEmail(email,display,confirmEmail, confirmDisplay){
	if (confirmDisplay){ //If confirmDisplay is truthy = contains a value
		confirmEmail.value=""; //Remove entry in 2nd email input
		confirmDisplay.innerHTML = ""; //Remove text in span element
	}
	if (config.email.Validation.test(email)) { //If validation is successful
		display.innerHTML = config.email.VALID[0]; //Display valid email message
		display.style.backgroundColor = config.email.VALID[1]; //Use valid color
	} else{
		display.innerHTML = config.email.INVALID[0]; //Display invalid message
		display.style.backgroundColor = config.email.INVALID[1];	//Use invalid color	
	}
}

//Function to verify length of login user name*************************************************************************
function fCheckLength(length,display){
	let strMessage, strColor; //Local variables to be used to store message and color based on current state of form
	if (length == 0){
		strMessage=""; //Set message to empty when length of login is zero
	} else if (length < config.userName.MinLength){ //Length of login is less than min length
		strMessage = config.userName.SHORT[0] + " (" + length + ")";
		strColor = config.userName.SHORT[1];
	} else if (length > config.userName.MaxLength) { //Length of login is greater than max length
		strMessage = config.userName.LONG[0] + " (" + length + ")";
		strColor = config.userName.LONG[1];		
	}
	else { //Length is in ideal range (greater than min and less than max length)
		strMessage = config.userName.GOOD[0] + " (" + length + ")";
		strColor = config.userName.GOOD[1];		
	}
	display.innerHTML = strMessage;
	display.style.backgroundColor = strColor;
} //End of function fCheckLength***************************************************************************************

function fPasswordComplexity(password,display, confirmPassword, confirmDisplay){
	let score = 0;
	//Setting confirmation password input to empty
	if (confirmDisplay) {
		confirmPassword.value = "";
		confirmDisplay.innerHTML = "";
	}
	//If password is too short, set text and color in span element and exit the function
	if (!config.pw.ComplexMinMax.test(password)) {
		display.innerHTML = config.pwRank.TOO_SHORT[0]; 
		display.style.backgroundColor=config.pwRank.TOO_SHORT[1];
	} else {
		// Increment the score for each of these conditions
		score += (password.match(config.pw.ComplexUpper)||[]).slice(0,config.pw.NumberOfMaxChar).length;
		score += (password.match(config.pw.ComplexNumeric)||[]).slice(0,config.pw.NumberOfMaxChar).length;
		score += (password.match(config.pw.ComplexSpecial)||[]).slice(0,config.pw.NumberOfMaxChar).length;
		//Testing score and set text and color of span element
		if (score < 3) { display.innerHTML = config.pwRank.WEAK[0]; return display.style.backgroundColor=config.pwRank.WEAK[1];}// score is 2 or lower
		if (score < 4) { display.innerHTML = config.pwRank.MEDIUM[0];return display.style.backgroundColor=config.pwRank.MEDIUM[1] }// score is 3
		if (score < 6) { display.innerHTML = config.pwRank.STRONG[0]; return display.style.backgroundColor=config.pwRank.STRONG[1] }// score is 4 or 5
		// score is 6 or higher
		display.innerHTML = config.pwRank.VERY_STRONG[0]; 
		display.style.backgroundColor=config.pwRank.VERY_STRONG[1];
	}
}

function fCompareInput(value1, value2, display){
	//If both text input elements empty, clear span element
	if (value1.length == 0 || value2.length == 0){
		display.innerHTML="";
		display.style.backgroundColor="";
	} else if (value1 === value2){ //Both inputs are strictly equal
		display.innerHTML = "Entries matched";
		display.style.backgroundColor = color.GREEN;
	}else { //Both entries do not match
		display.innerHTML = "Entries did not match";
		display.style.backgroundColor = color.RED;
	}
}


function fProcessForm(){
	divReg.style.display = "none"; //Hide div element if visible from previous operation
	if (location.search.replace(/^.*?\=/, '').length > 0){ //Query parameter exists
		let login = location.search.replace(/^.*?\=/, ''); //Extract login
		//Setting inner HTML of registered div element
		divReg.innerHTML = "Thank you, " + login + " , your are now registered."
		divMain.style.display = "none"; //Hide main div element
		$('#divRegistered').fadeIn(3000);
	} else { //No query parameter exists 
		divReg.style.display = "none"; //Hide span element
		divMain.style.display = ""; //Show main div element
	}
}

function fFormValidate(evt, spanElts){
	let blnInvalid = 0;
	//Check whether all span elements contain green color
	//Assign zero when green, otherwise one, calculate sum
	//If all span elements contain green background sum of blnInvalid = zero --> false
	for (let i = 0; i < spanElts.length;i++){ //Loop over span elements
		//Ternary operator to assign either 0 or 1 depending on backcolor
		blnInvalid += (spanElts[i].style.backgroundColor==color.GREEN ? 0 : 1);
	}	
	if (blnInvalid){ //If true (blnValid > 0)
		alert('Form validation failed');
		evt.preventDefault(); //prevent default action of submit
	} else { //False (blnValid = 0)
		alert('Form validation successful');			
	}
}


