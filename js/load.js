function randOrd(){
	return (Math.round(Math.random())-0.5); }

var quotes = 
	new Array(
		["We were put on this Earth as creatures of God to have dominion over the Earth.", "Santorum"],
		["We believe in democracy and we also believe in freedom, but we do not believe in liberal democracy.", "Khamenei"],
		["Although the literal meaning of socialism is equitable distribution of wealth, it is associated with other concepts which we hate. Over time, socialism has come to be associated with certain things in society that are unacceptable to us.","Khamenei"],
		["The radical feminists succeeded in undermining the traditional family and convincing women that professional accomplishments are the key to happiness.","Santorum"],
		["This is not a political war at all. This is not a cultural war. This is a spiritual war.", "Santorum"],
		["This is a war between two willpowers: the willpower of the people and the willpower of their enemies.","Khamenei"],
		["Go back and read what the sirens did once you arrived on that island... They devour you. They destroy you. They consume you.", "Santorum"],
		["The Iranian people's hatred for America is profound.","Khamenei"]
	);

quotes = quotes.sort( randOrd );

var template1 = "<div class='question'><p class='quote'>\"";
var template2 ="\"<em> - ?</em></p><div class='pick'><div class='btn ayatollah' onclick='ayatollah(); return false;'><img src='img/ayatollah-circle.png'/><span class='name'>Ali Khamenei</span><span class='desc'>Iranian Supreme Leader</span></div><div class='btn santorum' onclick='santorum(); return false;'><img src='img/santorum-circle.png'/><span class='name'>Rick Santorum</span><span class='desc'>US Presidential Candidate</span></div></div><div class='overlay'></div></div>"

var answer = "Santorum";
var answered = 0;

function addQuestion(num){
	var question = quotes[num][0];
	answer = quotes[num][1];

	document.body.innerHTML += template1 + question + template2;
}

function ayatollah(){
	if (answer == "Khamenei"){
		right(answer);
	}else{
		wrong(answer);
	}
}
function santorum(){
	if (answer == "Santorum"){
		right(answer);
	}else{
		wrong(answer);
	}
}
function makeInactive(ans){
	var qtmp = document.getElementsByClassName('question');
	var q = qtmp[qtmp.length -1];
	var toggle = "ayatollah";
	if (ans == "Santorum"){
		toggle = "santorum";
	}
	q.setAttribute('class', "question inactive " + toggle);
}
function addMessage(correct, ans){
	answered++;
	var endmsg = ".  Try another one.</p>"
	if (answered >= quotes.length){
		endmsg = ". I hope you enjoyed this little experiment. <br/><br/><strong>Follow me on Twitter <a href='https://twitter.com/#!/ryhanhassan'>@ryhanhassan</a><strong>";
	}
	var message = "<p class='message'>Nope, it was actually " + ans + endmsg;
	if (correct == true){
		var message = "<p class='message'>Yep, that was actually " + ans + endmsg;
	}
	document.body.innerHTML += message;
}

function right(ans){
	makeInactive(ans);
	addMessage(true, ans);
	addQuestion(answered);
}
function wrong(ans){
	makeInactive(ans);
	addMessage(false, ans);
	addQuestion(answered);
}




function loadjs(){
	addQuestion(0);
	/*
	writeToConsole("Loading game...");
	loadGame();
	writeToConsole("Running...");
	var t = setTimeout("startGame();", 10);
	*/
}
