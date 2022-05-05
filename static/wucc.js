function initPage() {

    // Calendar ////////////////////////////////////////////////////////////////

    const today = Date.now();
    const dayinsecs = 1000*3600*24;

    let rows = calendar.getElementsByTagName("tr");
    for (let i=1; i<rows.length; i++) {
        let row = rows[i];
        let entries = Array.from(rows[i].getElementsByTagName("td"))
            .map(e => e.innerHTML);
        let start = new Date(entries[1]);
        let end = new Date(entries[2]);
        end = end.getTime() ? end : start;
        if (today-dayinsecs > end) {
            row.classList += "calpast";
        } else if (today > start) {
            row.classList += "calnow";
        }

        let daystill = 1 + (start - today)/1000/3600/24;
        let weeks = Math.floor(daystill/7);
        let days = Math.floor(daystill%7);
        let text = "";
        text += weeks >= 1 ? `${weeks} week${weeks > 1 ? "s" : ""}` : "";
        text += weeks >= 1 && days >= 1 ? ", " : "";
        text += days >= 1 ? `${days} day${days > 1 ? "s" : ""}` : "";
        console.log(text);
    }

    // Add a days til row

    // Combine From/To column


    // Add countdown timer /////////////////////////////////////////////////////

    const countdownEle = (digit, unit, padding=0) => 
          `<div class="countdownbox">`
        +`<div class="countdowndigit">`
        +`${String(Math.floor(digit)).padStart(padding,'0')}</div>`
        +`<div class="countdownunit">${unit}</div>`
        +`</div>`;

    let countdown = document.createElement('div');
    countdown.id = 'countdown';
    let refnode = document.getElementsByClassName('figure')[0];
    refnode.parentNode.insertBefore(countdown, refnode.nextSibling);
    updateCountdown();

    let id = setInterval(updateCountdown, 10);
    function updateCountdown () {
        const now = Date.now(),
              start = Date.parse('23 July 2022'),
              days = (start-now)/(1000*60*60*24),
              hrs = days%1*24,
              mins = hrs%1*60,
              secs = mins%1*60,
              weeks = days/7;

        document.getElementById('countdown').innerHTML =
            countdownEle(weeks, 'weeks')
            + '<div class="countdownbox"><div class="countdownspacer slash">/</div></div>'
            + countdownEle(days, 'days')
            + '<div class="countdownbox"><div class="countdownspacer">:</div></div>'
            + countdownEle(hrs, 'hours', 2)
            + '<div class="countdownbox"><div class="countdownspacer">:</div></div>'
            + countdownEle(mins, 'minutes', 2)
            + '<div class="countdownbox"><div class="countdownspacer">:</div></div>'
            + countdownEle(secs, 'seconds', 2);
    }


    // Add dropdown arrows /////////////////////////////////////////////////////
    const h2s = document.getElementsByTagName('h2');
    const h3s = document.getElementsByTagName('h3');
    const arrowsvg = `<svg width="10" height="10" viewBox="0 0 10 10" class="droparrow" `
        +`xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">`
        +`<path style="stroke-width:1;stroke-linejoin:round;" `
        +`d="M 1.1517591,2.9637924 4.9865781,7.6621763 8.8213969,2.9637924 Z" /></svg>`;

    [...h2s, ...h3s].map(h =>
        h.innerHTML = arrowsvg + h.innerHTML);


    // Add show/hide functionality /////////////////////////////////////////////

    const outline2s = document.getElementsByClassName('outline-2');
    [...outline2s].map(outline =>
        [...outline.children].map(div =>
            div.tagName !== 'H2' ? div.classList.toggle('inactive') : null));

    [...h2s].map(h2 =>
        h2.addEventListener('click', function() {
            [...this.parentElement.children].map(div =>
                div.tagName !== 'H2' ? div.classList.toggle('inactive') : null);
            this.getElementsByClassName('droparrow')[0].classList.toggle('dropped');
        }));

    const outline3s = document.getElementsByClassName('outline-3');
    [...outline3s].map(outline =>
        [...outline.children].map(div =>
            div.tagName !== 'H3' ? div.classList.toggle('inactive') : null));

    [...h3s].map(h3 =>
        h3.addEventListener('click', function() {
            [...this.parentElement.children].map(div =>
                div.tagName !== 'H3' ? div.classList.toggle('inactive') : null);
            this.getElementsByClassName('droparrow')[0].classList.toggle('dropped');
        }));

    // Add diagrams ////////////////////////////////////////////////////////////
    drawDiagrams();
}

function drawDiagrams () {
    
    // Four point marker drill /////////////////////////////////////////////////
    let X = 500,
        Y = 500;
    let svg = svgElemAppend(markerdrill, 'svg', {
        viewBox: `0 0 ${X} ${Y}`,
        preserveAspectRatio:"xMidYMid meet",
    });
    svgElemAppend(svg, 'path', {
        class:'guideline',
        d: 'M 100 400 L 400 400 L 400 100'
    });
    thrower(svg, 100, 400);
    thrower(svg, 400, 400);
    thrower(svg, 400, 100);
    defender(svg, 380, 380, 45);
    disc(svg, 415, 390);

}

function svgElemAppend(parent, type, dict, content='')
{
    let svgNS = 'http://www.w3.org/2000/svg';
    let element = document.createElementNS(svgNS, type);
    Object.keys(dict).forEach(key =>
        element.setAttributeNS(null, key, dict[key]));
    element.innerHTML = content;
    parent.appendChild(element);
    return element;
}
function thrower (parent, x, y) {
    svgElemAppend(parent, 'circle', {
        class:'thrower', cx:`${x}`, cy:`${y}`, r:10
    });
}
function defender (parent, x, y, angle) {
    const size = 30;
    const group = svgElemAppend(parent, 'g', {
        transform:`rotate(${-angle} ${x} ${y})`
    });
    svgElemAppend(group, 'line', {
        class:'defender',
        x1:`${x-size/2}`, y1:`${y}`,
        x2:`${x+size/2}`, y2:`${y}`,
    });
}
function disc (parent, x, y) {
    svgElemAppend(parent, 'circle', {
        class:'disc', cx:`${x}`, cy:`${y}`, r:5
    });
}
