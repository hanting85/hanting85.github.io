//Part 1: 2 global variables, and 2 reusable arrays for later use
let divReg, divMain, spanElements, inputElements;

document.addEventListener("DOMContentLoaded", function() {	//DOM listener
divReg=document.getElementById("divRegistered");		//assign divRegistered
divMain=document.getElementById("divMain");			//assign divMain	

divMain.addEventListener("focus", fHandleEnter, true);		//2 listeners for focus and blur
divMain.addEventListener("blur", fHandleExit, true);

//Part 2: invoke processform to display username (has been moved to Part 4)
//fProcessForm();

//Part 3-1: assign 2 more arrays for input & span via query selector
inputElements=document.querySelectorAll("#frmRegister input[type=text], input[type=password]");
spanElements=document.querySelectorAll("#frmRegister span");

/*Test only: issue alerts to show elements IDs
for (i=0; i<inputElements.length; i++) {alert(inputElements[i].id)};
for (i=0; i<spanElements.length; i++) {alert(spanElements[i].id)}; */

//Part 3-2: use blur event to trigger pw comparison & email comparison
inputElements[2].addEventListener("blur", function(){
    fCompareInput(inputElements[1].value, this.value, spanElements[2]) //compare passwords
});
inputElements[4].addEventListener("blur", function(){
    fCompareInput(inputElements[3].value, this.value, spanElements[4]) //compare emails
});

//Part 4-1: DIY
inputElements[0].addEventListener("input", function(){			//check username length
    fCheckLength(inputElements[0].value, spanElements[0])
});
inputElements[1].addEventListener("input", function(){			//check pw length
    fCheckLength(inputElements[1].value, spanElements[1])
});
inputElements[0].addEventListener("blur", function(){			//check username validity
    fCheckVal(inputElements[0].value, spanElements[0])
});
inputElements[1].addEventListener("blur", function(){			//check pw validity
    fCheckVal(inputElements[1].value, spanElements[1])
});
inputElements[3].addEventListener("blur", function(){			//check email validity
    fCheckEmail(inputElements[3].value, spanElements[3])
});

//Part 4-2: New fProcessForm - if any field fails, error msg will display
document.getElementById("btnRegister").addEventListener("focus", function(){			//event listener for btnRegister
    fProcessForm(spanElements[0], spanElements[1], spanElements[2], spanElements[3], spanElements[4])	//add all innerHTML as arguments
});

}) 	//closing anonymous function & DOM listener


//all functions are listed below:
function fHandleEnter(e) {
   e.target.style.backgroundColor="yellow"; }	//add yellow bg-color

function fHandleExit(e) {
   e.target.style.backgroundColor=""; }		//rm yellow bg-color

function fCompareInput(va_1, va_2, dsp) {	//va_1 & va_2 comparison, and dsp for element in spanElements
   if (va_1.length==0 || (va_2.length==0)) {
	dsp.innerHTML="";			//empty innerHTML
	dsp.style=""; }				//empty style attribute
   else if (va_1!==va_2) {
	dsp.innerHTML="Entries do not match!";	//unmatching input
	dsp.style.backgroundColor="";		//alert without bg-color
	dsp.style.color="#FF3333"; }		//red font color
   else {
	dsp.innerHTML="Entries match; pass!";	//matching input
	dsp.style.backgroundColor=""; 		//clear any previous bg-color
	dsp.style.color="#90FF90"; }		//alert changed to green
}

function fCheckLength(e, msg_len) {		//e for username or pw input, validity to be shown in msg_len
   msg_len.style.color="";			//clear any previous color
   let count=e.length;
   if (count>0 && count<6) {			//short, red
	msg_len.innerHTML="No. of characters: " +count+ "; weak";
	msg_len.style.backgroundColor="red"; }
   else if (count>=6 && count<9) {		//medium, orange
	msg_len.innerHTML="No. of characters: " +count+ "; fine";
	msg_len.style.backgroundColor="orange"; }
   else if (count>=9 && count<13) {		//strong, green
	msg_len.innerHTML="No. of characters: " +count+ "; strong";
	msg_len.style.backgroundColor="green"; }
   else if (count>=13) {			//exceeds max.
	msg_len.innerHTML="No. of characters: " +count+ "; exceeds max";
	msg_len.style.backgroundColor="red"; }
}

function fCheckVal(e, msg) {			//e for username input type, alert to be shown in msg
    let reg_e=/\W+/;				//e must be 6-12 alphanumeric characters or underscore
    if (reg_e.test(e) || (e.length<5) || (e.length>12)) {
	msg.innerHTML="Only 6-12 letters, nums or _";		//invalid input
	msg.style.backgroundColor="";
	msg.style.color="#FF3333"; }
    else {							//valid input goes green
	msg.innerHTML="Pass!";
	msg.style.backgroundColor="";
	msg.style.color="#90EE90";}
}

function fCheckEmail(e, msg) {			//e for email input, msg to be shown in span tag
    let reg_e=/([a-z0-9]+)@([a-z0-9]+)\.[a-z$]{2,3}/i;
    if (reg_e.test(e) && e.length>5) {
	msg.innerHTML="Pass!";
	msg.style.backgroundColor="";
	msg.style.color="#90EE90"; }
    else {					//e must contains @ and ends in .XX or .XXX
	msg.innerHTML="Invalid email format!";
	msg.style.backgroundColor="";
	msg.style.color="#FF3333" }
}

/*function fProcessForm() {			//Old Part 2 function
   let strQueryString=location.search;							//check location
   let res=decodeURIComponent(strQueryString).replace(/\S+?=/, '').length;		//check input length
	if (res>0) {									//Part 2 test: if username is empty
	let login=decodeURIComponent(strQueryString).replace(/\S+?=/, ''); }		//Part 2 test: take off URL before ?=
   	divReg.innerHTML="Thank you, " +login+ ", you are now registered.";		//Part 2 test: login successful
   else {divReg.style.display="none"; divMain.style.removeProperty('display');}		//Part 2 test: no response
}*/

function fProcessForm(a, b, c, d, e) {		//New Part 2: all fields should display "pass" to proceed
	if (a.innerHTML.toLowerCase().includes("pass")==true &&
	    b.innerHTML.toLowerCase().includes("pass")==true &&
	    c.innerHTML.toLowerCase().includes("pass")==true &&
	    d.innerHTML.toLowerCase().includes("pass")==true &&
	    e.innerHTML.toLowerCase().includes("pass")==true) {
	    divReg.innerHTML="Thank you, " +inputElements[0].value+ ", you are now registered.";	//login successful
   	    divMain.style.display="none";				//hide divMain
	    divErr.style.display="none";				//hide divErr
	    $("#divRegistered").fadeIn(2000); }				//show invisible box in 2 sec
	else {					//otherwise, show error message "divErr" and try again
	    document.getElementById("divErr").innerHTML='Please check all fields; you may refresh this page and try again!';
	    divReg.style.display="none"; divMain.style.removeProperty('display');
	    $('#divErr').fadeIn(1000).fadeOut(200).fadeIn(1000); }
}