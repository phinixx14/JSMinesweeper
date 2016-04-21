var mineField = [];
var board;
var boardWidth;
var remaining;
var boardHeight;
const maxHW = 40;
var wins = 0;
var losses = 0;

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].x == obj.x && this[i].y == obj.y) {
            return true;
        }
    }
    return false;
};

function showNewGamePrompt(){
	window.location.href="#newGame";
	var w = document.getElementById("width");
	var h = document.getElementById("height");
	var m = document.getElementById("mines");
	if(isNaN(1*w.value) || 1*w.value > maxHW){
		w.value = maxHW;
	}
	if(isNaN(1*h.value) || 1*h.value > maxHW){
		h.value = maxHW;
	}
	if(isNaN(1*m.value) || 1*m.value > w.value * h.value){
		m.value = w.value*h.value;
	}
}

function newGame(){
	var w = document.getElementById("width").value;
	var h = document.getElementById("height").value;
	var m = document.getElementById("mines").value;
	if(isNaN(1*w) || isNaN(1*h) || isNaN(1*m) || 1*w > maxHW || 1*h > maxHW || 1*m > h*w){
		setTimeout("showNewGamePrompt()",10);
		return;
	}
	drawBoard(w,h);
	plantMines(m,w,h);
}
function drawBoard(width, height){
	boardWidth = width-1;
	boardHeight = height-1;
	remaining = width*height;
	board = document.getElementById("gameBoard");
	board.innerHTML = "";
	for(r = 0; r < height; r++){
		var row = board.insertRow(r);
		for(c = 0; c < width; c++){
			var cell = row.insertCell(c);
			cell.className ="unclicked";
			cell.setAttribute("onclick","clickCell(this)");
			cell.setAttribute("oncontextmenu","rightClickCell(this,event)");
		}
	}
}
function plantMines(mines,width,height){
	mineField = [];
	for(i = 0; i < mines; i++){
		var x;
		var y;
		do{
			x = parseInt(Math.floor(Math.random()*width));
			y = parseInt(Math.floor(Math.random()*height));
		}while(mineField.contains({x:x,y:y}));
		mineField.push({x:x,y:y});
	}
}

function clickCell(cell){
	if(checkCell(cell)){
		getDead();
	}
	else{
		countSurroundingMines([cell]);
	}
}

function rightClickCell(cell,event){
	event = event || window.event;
	event.preventDefault();
	if(cell.className=="clicked"){
		
	}
	else if(cell.className=="unclicked"){
		cell.className="flagged";
	}
	else if(cell.className =="flagged"){
		cell.className="idk";
	}
	else if(cell.className=="idk"){
		cell.className="unclicked";
	}
	return false;
}

function countSurroundingMines(cells){
	for(i = 0;i<cells.length;i++){
		var cell = cells[i];
		var coords = getCoordinatesFromCell(cell);
		var x = coords.x;
		var y = coords.y;
		var mineCount = 0;
		for(xOffset = -1; xOffset <= 1; xOffset++){
			for(yOffset = -1; yOffset <= 1; yOffset++){
				xx = x+xOffset;
				yy = y+yOffset;
				if(xx<0||xx>boardWidth||yy<0||yy>boardHeight){
				}
				else{
					mineCount += checkCell({x:xx,y:yy}) ? 1 : 0;
				}
			}
		}
		if(cell.className != "clicked"){
			remaining--;
			cell.appendChild(document.createTextNode(mineCount > 0 ? mineCount : ""));
			cell.className = "clicked";
			if(mineCount === 0){
				for(yOffset = -1; yOffset <= 1; yOffset++){
					for(xOffset = -1; xOffset <= 1; xOffset++){
						xx = x+xOffset;
						yy = y+yOffset;
						if(xx<0||xx>boardWidth||yy<0||yy>boardHeight){
						}
						else{
							if(!cells.contains({x:xx,y:yy})){
								cells.push(getCellByCoords(xx,yy));

							}
						}
					}
				}
			}
		}		
	}
	if(checkForWin()){
		victory();
	}
}

function checkCell(cell){
	return mineField.contains(getCoordinatesFromCell(cell));
}

function showMines(){
	for(i=0;i<mineField.length;i++){
		var mine = mineField[i];
		var td = getCellByCoords(mine.x,mine.y);
		td.style.backgroundColor = "red";
	}
}

function getCellByCoords(x, y){
	var tr = board.getElementsByTagName("tr")[y];
	if(tr===undefined){
		alert(x+" "+y); 
	}
	return tr.getElementsByTagName("td")[x];
}

function getDead(){
	showMines();
	window.location.href="#lose";
	document.getElementById("losses").innerHTML = ++losses;
}

function getCoordinatesFromCell(cell){
	var x = cell.hasOwnProperty("x") ? cell.x : cell.cellIndex;
	var y = cell.hasOwnProperty("y") ? cell.y : cell.parentNode.rowIndex;
	return {x:x,y:y};
}

function checkForWin(){
	if(remaining == mineField.length){
		return true;
	}
	else{
		return false;
	}
}

function victory(){
	window.location.href="#win";
	document.getElementById("wins").innerHTML = ++wins;
}