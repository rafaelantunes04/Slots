button = document.getElementById('button');
button.addEventListener('click', print);
show = document.getElementById('y');
count = document.getElementById('count')
countingStart = 0
 
 
function random() {
    switch(Math.floor(Math.random() * 10)) { // 0-9
        case 0:
            y= "🍓";
            break;
        case 1:
            y= "🍌";
            break;
        case 2:
            y= "🌰";
            break;
        case 3:
            y= "🥨";
            break;
        case 4:
            y= "🍒"
            break;
        case 5:
            y= "🍨";
            break;
        case 6:
            y= "🥩";
            break;
        case 7:
            y= "🥐";
            break;
        case 8:
            y= "🍚";
            break;
        case 9:
            y= "🥞";
            break
    };
    return y
};

function print() {
    var counter = countingStart;
    y1 = random();
    y2 = random();
    y3 = random();
    show.innerHTML = y1 + y2 + y3;
    counter++
    countingStart++
    count.innerHTML = "Play: " + counter
}