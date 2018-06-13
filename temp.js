var colorMap = [];
colorMap["0"] = "Gainsboro";
colorMap["2"] = "Burlywood";
colorMap["4"] = "LightCoral";
colorMap["8"] = "IndianRed";
colorMap["16"] = "Red";
colorMap["32"] = "DarkRed";
colorMap["64"] = "MediumVioletRed";
colorMap["128"] = "OrangeRed";
colorMap["256"] = "Yellow";
colorMap["512"] = "YellowGreen";
colorMap["1024"] = "LightGoldenRodYellow";
colorMap["2048"] = "Gold";
colorMap["4096"] = "LawnGreen";
colorMap["8192"] = "LightGrey";
colorMap["16384"] = "LightSkyBlue";
var holder = new Array(4);
for(let i = 0; i < 4; i++) {
    holder[i] = new Array(4);
}
let mainFrame = document.getElementById("mainFrame");
for(let i = 0; i < 4; i++) {
    let rowContainer = document.createElement("div");
    rowContainer.style.display="flex";
    for(let j = 0; j < 4; j++) {
        let currentElement = document.createElement("div");
        currentElement.style.width = "100px";
        currentElement.style.height = "100px";
        currentElement.style.fontFamily = "monospace";
        currentElement.style.fontSize = "50px";
        currentElement.style.textAlign = "center";
        currentElement.style.verticalAlign = "middle";
        currentElement.style.lineHeight = "100px";
        currentElement.style.backgroundColor= "Gainsboro";
        currentElement.style.margin= "10px";
        currentElement.style.left = j * 100 + "px";
        currentElement.style.top = i * 100 + "px";
        currentElement.innerHTML = "";
        currentElement.setAttribute("value2048", "0");
        currentElement.setAttribute('horizontal', '');
        currentElement.setAttribute("swap", "0");
        holder[i][j] = currentElement;
        rowContainer.appendChild(currentElement);
    }
    mainFrame.appendChild(rowContainer);
};

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;
   if (key == 37) {
    console.log("left pressed");
    moveLeft();
   } else if (key == 38) {
    console.log("up pressed");
    moveUp();
   } else if (key == 39) {
    console.log("right pressed");
    moveRight();
   } else if (key == 40) {
    console.log("down pressed");
    moveDown();
   }
};

function randomBlock() { 
    let tempHolder = [];
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
           if(holder[i][j].getAttribute("value2048") === '0') {
               tempHolder.push([i,j]);
           }
        }
    }
    if(tempHolder.length > 0) {
        let insertIndex = Math.floor(Math.random() * tempHolder.length);
        let row = tempHolder[insertIndex][0];
        let col = tempHolder[insertIndex][1];
        let insertValue = 2;
        if(Math.random() > 0.85) {
            insertValue = 4;
        }
        holder[row][col].setAttribute("value2048", insertValue.toString());
        holder[row][col].innerHTML = insertValue.toString();
        holder[row][col].style.backgroundColor = colorMap[insertValue.toString()];
        resetSwap();
    } else {
        alert("You lose");
    }
}

randomBlock();
randomBlock();

function moveBlock(sr, sc, tr, tc) {
    let sv = holder[sr][sc].getAttribute("value2048");
    holder[tr][tc].setAttribute("value2048", sv);
    holder[tr][tc].innerHTML= sv;
    if(colorMap[sv]) {
        holder[tr][tc].style.backgroundColor = colorMap[sv];
    }
    holder[sr][sc].setAttribute("value2048", "0");
    holder[sr][sc].innerHTML = "";
    holder[sr][sc].style.backgroundColor = colorMap["0"];
    //animateMove(sr,sc,tr,tc);
}

var animateFlag;
function animateMove(sr, sc, tr, tc) {
    clearTimeout(animateFlag);
    let oleft = holder[sr][sc].style.left;
    oleft = Number(oleft.substring(0, oleft.length - 2));
    let otop = holder[sr][sc].style.top;
    otop = Number(otop.substring(0, otop.length - 2));
    let tleft = holder[sr][sc].style.left;
    tleft = Number(tleft.substring(0, oleft.length - 2));
    let ttop = holder[sr][sc].style.top;
    ttop = Number(ttop.substring(0, ttop.length - 2));
    let hdiff = tleft - oleft;
    let vdiff = ttop - tleft;
    if(Math.abs(hdiff) > 80) {
        holder[sr][sc].style.left = holder[sr][sc].style.left + 10 * Math.sign(hdiff);
        animateFlag = setTimeout(animateMove(sr, sc, tr, tc), 1);
    }
    if(Math.abs(vdiff) > 80) {
        holder[sr][sc].style.top = holder[sr][sc].style.top + 10 * Math.sign(vdiff);
        animateFlag = setTimeout(animateMove(sr, sc, tr, tc), 1);
    }
}

let winFlag = 0;
function combineBlock(sr, sc, tr, tc) {
    let sv = holder[sr][sc].getAttribute("value2048");
    let tv = 2 * Number(sv);
    holder[tr][tc].setAttribute("value2048", tv.toString());
    holder[tr][tc].innerHTML= tv.toString();
    holder[sr][sc].setAttribute("value2048", "0");
    holder[sr][sc].innerHTML = "";
    holder[sr][sc].style.backgroundColor = colorMap["0"];
    holder[tr][tc].setAttribute("swap", "1");
    if(colorMap[tv.toString()]) {
        holder[tr][tc].style.backgroundColor = colorMap[tv.toString()];
    }

    if(tv == 2048 && winFlag == 0) {
        winFlag = 1;
        alert("you won");
    }
}

function resetSwap() {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            holder[i][j].setAttribute("swap", "0");
        }
    }
}

function moveUp() {
    let changeCount = 0;
    for(let i = 0; i < 4; i++) {
        for(let j = 1; j < 4; j++) {
            if(holder[j][i].getAttribute("value2048") != "0") {
                let curr = j;
                let flag = 1;
                while(curr >= 1 && flag == 1) {
                    if(holder[curr - 1][i].getAttribute("value2048") == "0") {
                        changeCount = changeCount + 1;
                        moveBlock(curr, i, curr - 1, i);
                        curr = curr - 1;
                    } else if(holder[curr - 1][i].getAttribute("value2048") == holder[curr][i].getAttribute("value2048")) {
                        if(holder[curr - 1][i].getAttribute("swap") == "0") {
                            combineBlock(curr, i, curr - 1, i);
                            changeCount = changeCount + 1;
                        }
                        flag = 0;
                    } else {
                        flag = 0;
                    }
                }
            }
        }
    }
    randomBlock();
    if(changeCount != 0) {
        var audio = new Audio('sound.mp3');
        audio.play();
    }
}

function moveDown() {
    let changeCount = 0;
    for(let i = 0; i < 4; i++) {
        for(let j = 2; j >= 0; j--) {
            if(holder[j][i].getAttribute("value2048") != "0") {
                let curr = j;
                let flag = 1;
                while(curr <= 2 && flag == 1) {
                    if(holder[curr + 1][i].getAttribute("value2048") == "0") {
                        moveBlock(curr, i, curr + 1, i);
                        curr = curr + 1;
                        changeCount = changeCount + 1;
                    } else if(holder[curr + 1][i].getAttribute("value2048") == holder[curr][i].getAttribute("value2048")) {
                        if(holder[curr + 1][i].getAttribute("swap") == "0") {
                            combineBlock(curr, i, curr + 1, i);
                            changeCount = changeCount + 1;
                        }
                        flag = 0;
                    } else {
                        flag = 0;
                    }
                }
            }
        }
    }
    randomBlock();
    if(changeCount != 0) {
        var audio = new Audio('sound.mp3');
        audio.play();
    }
}

function moveRight() {
    let changeCount = 0;
    for(let i = 0; i < 4; i++) {
        for(let j = 2; j >= 0; j--) {
            if(holder[i][j].getAttribute("value2048") != "0") {
                let curr = j;
                let flag = 1;
                while(curr <= 2 && flag == 1) {
                    if(holder[i][curr + 1].getAttribute("value2048") == "0") {
                        moveBlock(i, curr, i, curr + 1);
                        curr = curr + 1;
                        changeCount = changeCount + 1;
                    } else if(holder[i][curr + 1].getAttribute("value2048") == holder[i][curr].getAttribute("value2048")) {
                        if(holder[i][curr + 1].getAttribute("swap") == "0") {
                            combineBlock(i, curr, i, curr + 1);
                            changeCount = changeCount + 1;
                        }
                        flag = 0;
                    } else {
                        flag = 0;
                    }
                }
            }
        }
    }
    randomBlock();
    if(changeCount != 0) {
        var audio = new Audio('sound.mp3'); 
        audio.play();
    }
}

function moveLeft() {
    let changeCount = 0;
    for(let i = 0; i < 4; i++) {
        for(let j = 1; j < 4; j++) {
            if(holder[i][j].getAttribute("value2048") != "0") {
                let curr = j;
                let flag = 1;
                while(curr >= 1 && flag == 1) {
                    if(holder[i][curr - 1].getAttribute("value2048") == "0") {
                        moveBlock(i, curr, i, curr - 1);
                        curr = curr - 1;
                        changeCount = changeCount + 1;
                    } else if(holder[i][curr - 1].getAttribute("value2048") == holder[i][curr].getAttribute("value2048")) {
                        if(holder[i][curr - 1].getAttribute("swap") == "0") {
                            combineBlock(i, curr, i, curr - 1);
                            changeCount = changeCount + 1;
                        }
                        flag = 0;
                    } else {
                        flag = 0;
                    }
                }
            }
        }
    }
    randomBlock();
    if(changeCount != 0) {
        var audio = new Audio('sound.mp3'); 
        audio.play();
    }
}












