const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

module.exports = function () {
};

// writes <data> on the serial port
module.exports.write = function (data) {
    if (exports.port) {
        exports.port.write(data, function (err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });
    }
    else {
        console.log();
    }
};

// finds all the available port for serial communication and establishes a
// connection if the manufacturer of a connected device is 'STMicroelectronics'
function establishCommunication() {
    SerialPort.list().then(function (ports) {
        if (ports.length === 0) {
            console.log("None serial port is available!");
        }
        for (let i = 0; i < ports.length; i++) {
            if (ports[i]['manufacturer'].includes('STMicroelectronics')) {
                exports.portName = ports[i].comName;
                exports.port = new SerialPort(exports.portName, 9600);
                exports.parser = exports.port.pipe(new Readline({delimiter: '\r\n'}));

                exports.port.on("open", function () {
                    console.log("Serial communication established on port: " + exports.portName + "\n");
                });

                exports.port.on("error", function (err) {
                    if (err) {
                        console.log("error", err);
                    }
                });

                // read the data received through the serial port
                exports.parser.on('data', function (data) {
                    const re = /1{14}0([10]{8})0([10]{8})/;
                    const match = re.exec(data);

                    // if the string is a correct DCC packet
                    if (match && match.length > 2) {
                        address = parseInt(match[1], 2).toString().padStart(3, '0');
                        command = parseInt(match[2], 2).toString().padStart(3, '0');
                        console.log(address + " " + command + " " + data);
                    }

                    // avoid the display of a partial packet by checking if <data> is not an integer
                    else if (isNaN(data)) {
                        // Hides beginning bits of <data> string
                        let regex = /^[0-1]*/;
                        console.log(data.replace(regex, ''));
                    }
                });
            }

            // if a correct port is found, no need to continue to check available ports
            break;
        }
    });
}

establishCommunication();

setTimeout(function () {
    module.exports.write("21 56\r\n");
}, 100);
