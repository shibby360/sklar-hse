function writeTable(text) {
    $('h1').hide()
    let parser = new DOMParser()
    let content = parser.parseFromString(text, 'text/html')
    let jqcontent = $(content)
    let lines = jqcontent.find('p').filter(function(index, element) {
        return $(element).text().trim().length
    })
    lines = lines.slice(1)
    let maintable = $('#maintable')
    let currTr;
    let dayList = ['','','','']
    let weekMillis = 0;
    let wkCounter = 1;
    let wkRanges = {}
    let weeksBeforeBreak = {13:1};
    let breakStyle = {
        13:["Spring", "green"]
    }
    for(let line of lines) {
        let td = $('<td>')
        line = $(line)
        let lntxt = line.text()
        if(lntxt.startsWith('Week')) {
            if(currTr) {
                maintable.append(pushListToRow(dayList, currTr))
                dayList = ['','','','']
            }
            currTr = $('<tr>')
            currTr.attr('id', 'week' + wkCounter);
            td.text(line.text())
            currTr.append(td)
            wkRanges[wkCounter] = [weekMillis, weekMillis+((6.048e+8)-1)]
            weekMillis += 6.048e+8
            wkCounter++;
            if(wkCounter in weeksBeforeBreak) {
                weekMillis += (6.048e+8)*weeksBeforeBreak[wkCounter];
            }
        } else {
            if(lntxt.startsWith('Monday')) {
                dayList[0] = lntxt.replace('Monday — ','')
            } else if(lntxt.startsWith('Tuesday')) {
                dayList[1] = lntxt.replace('Tuesday — ','')
            } else if(lntxt.startsWith('Thursday')) {
                dayList[2] = lntxt.replace('Thursday — ','')
            } else if(lntxt.startsWith('Friday')) {
                dayList[3] = lntxt.replace('Friday — ','')
            }
        }
    }
    maintable.append(pushListToRow(dayList, currTr))
    for(let breakWk in weeksBeforeBreak) {
        for(let i = 1; i <= weeksBeforeBreak[breakWk]; i++) {
            let breakTr = $('<tr style="background: ' + breakStyle[breakWk][1] + ';">')
            breakTr.append($('<td colspan="5" style="text-align: center">' + breakStyle[breakWk][0] + ' break week ' + i + '</td>'))
            $('#week'+breakWk).after(breakTr)
        }
    }
    // scroll to the right row and hightlight the right day
    // let aug5PST = 1.7228412e+12;
    let jan6PST = 1736150400000;
    let weekN
    for(let weekNum in wkRanges) {
        let range = wkRanges[weekNum]
        if(Date.now() - jan6PST > range[0] && Date.now() - jan6PST < range[1]) {
            $('#week'+weekNum)[0].scrollIntoView()
            $('#week'+weekNum).addClass('currWeek')
            weekN = weekNum
        }
    }
    let currDay = new Date().getDay()
    $('#week'+weekN+'>.day'+currDay).addClass('currDay')
    // fill in recap info
    let dayBefore = {2:1,4:2,5:4}
    let dayAfter = {1:2,2:4,4:5}
    if(currDay in dayBefore) { $('#yesterStuff').text($('#week'+weekN+'>.day'+dayBefore[currDay]).text()) }
    if([1,2,4,5].includes(currDay)) { $('#todayStuff').text($('#week'+weekN+'>.day'+currDay).text()) }
    if(currDay in dayAfter) { $('#tomorStuff').text($('#week'+weekN+'>.day'+dayAfter[currDay]).text()) }
}
function pushListToRow(arr, trEl) {
    let dayIndices = [1,2,4,5]
    let dayInd = 0;
    for(let day of arr) {
        let td = $('<td class="day' + dayIndices[dayInd] + ' ">')
        td.text(day)
        trEl.append(td)
        dayInd ++
    }
    return trEl
}
fetch('https://sklar-server.vercel.app/soph-honors').then(function(r) {
    r.text().then(writeTable)
})
let isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches || (localStorage.getItem('darkModeOn')=='true');
if(isDarkMode) {
    $('body').addClass('dark')
    $('#themeSwitch').find('img').attr('src', 'moon.png')
}
localStorage.setItem('darkModeOn', isDarkMode)
$('#themeSwitch').click(function(ev) {
    localStorage.setItem('darkModeOn', !(localStorage.getItem('darkModeOn')=='true'))
    isDarkMode = localStorage.getItem('darkModeOn') == 'true'
    if(isDarkMode) {
        $('body').addClass('dark')
        $('#themeSwitch').find('img').attr('src', 'moon.png')
    } else {
        $('body').removeClass('dark')
        $('#themeSwitch').find('img').attr('src', 'sun.png')
    }
})