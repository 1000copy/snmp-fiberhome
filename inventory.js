// const fh = require('./src')
 
const options = {
    ip: '192.168.0.12',             // OLT IP
    community: 'public',
    port: 161,
    trapPort: 162,
    enableWarnings: true,
    enableLogs: true
}
const snmp_fh = require('./src/pack-fiberhome')//
const oid = require('./src/oid-fh')
var inventoryoid = '1.3.6.1.2.1.47.1.1.1.1'
function a(){
    // snmp_fh.subtree(options, oid.OIDs.getUnauth).then(varbindList => {
    snmp_fh.subtree(options, inventoryoid).then(varbindList => {
        // console.log(varbindList)
        var a = formatVarbindList(varbindList, 'unauth')
        console.log(a)
    }, error => {
        console.error('Error: Unable to connect to OLT',error)
        // return resolve(false)
    })
}
a()
function formatVarbindList(varbindList, type) {
    var aONUs = []//
    varbindList.forEach(varbind => {
        var oid = varbind.oid.split('.')
        if (varbind.value != 0 && varbind.value != null) {
            if (oid[12] == 2) {
                aONUs.push({ index: parseInt(oid[13]), slot: varbind.value })
            } else {
                var idx = aONUs.findIndex(e => e.index == oid[13])
                if (idx > -1) {
                    if (type == 'auth') {
                        if (oid[12] == 3)
                            aONUs[idx].pon = varbind.value
                        else if (oid[12] == 4)
                            aONUs[idx].onuId = varbind.value
                        else if (oid[12] == 5)
                            aONUs[idx].onuType = table.ONUType[varbind.value]
                        else if (oid[12] == 10)
                            aONUs[idx].macAddress = varbind.value.toString()
                    } else if (type == 'unauth') {
                        if (oid[12] == 3)
                            aONUs[idx].pon = varbind.value
                        else if (oid[12] == 4){
                            var table = require('./src/tables')
                            aONUs[idx].onuType = table.ONUType[varbind.value]
                        }
                        else if (oid[12] == 7)
                            aONUs[idx].macAddress = varbind.value.toString()
                    }
                }
            }
        }
    })
    return aONUs
}
