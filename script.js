function writeTable(text) {
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
    for(let line of lines) {
        let td = $('<td>')
        line = $(line)
        let lntxt = line.text()
        if(lntxt.startsWith('Week')) {
            if(currTr) {
                maintable.append(pushListToRow(dayList, currTr))
            }
            currTr = $('<tr>')
            td.text(line.text())
            currTr.append(td)
        } else {
            dayList = ['','','','']
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
}
function pushListToRow(arr, trEl) {
    for(let day of arr) {
        let td = $('<td>')
        td.text(day)
        trEl.append(td)
    }
    return trEl
}
fetch('https://sklar-server.vercel.app/soph-honors').then(function(r) {
    r.text().then(writeTable)
})