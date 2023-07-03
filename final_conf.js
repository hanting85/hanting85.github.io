let	color = { //Color values
		RED:"rgb(255, 0, 0)",
		ORANGE:"rgb(255, 165, 0)",
		GREEN:"rgb(0, 128, 0)",
		YELLOW:"rgb(255, 255, 0)"
};
	
let config = {
	userName: { //Username config parameters
		MinLength: 4,
		MaxLength: 10,
		SHORT:["User name too short", color.RED],
		LONG: ["User name too long", color.ORANGE],
		GOOD: ["User name good", color.GREEN]
	},
	pw: { //Password config parameters
		ComplexUpper: /[A-Z]/g,
		ComplexNumeric: /[0-9]/g,
		//Special characters by ASCII ranges
		//4 ranges: !-/   :-@   /[-`    {-~   [ must be escaped /[
		ComplexSpecial: /[!-/:-@/[-`{-~]/g,
		ComplexMinMax: /^[\s\S]{8,32}$/, //Password length must be between 8 and 32
		NumberOfMaxChar: 2 //Number of characters for each complexity rule to count towards score
	},
	pwRank: { //Password rank config paramenters
		TOO_SHORT:  ["Too short", color.RED],
		WEAK:       ["Weak password", color.ORANGE],
		MEDIUM:     ["Medium strong password",color.ORANGE],
		STRONG:     ["Strong password",color.GREEN],
		VERY_STRONG:["Very strong password",color.GREEN]
	},
	email: { //email config parameters
		Validation: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i,
		VALID:  ["Valid Email",color.GREEN],
		INVALID:["Invalid Email",color.RED]
	}	
};