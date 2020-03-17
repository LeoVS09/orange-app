import fs  from 'fs';
import util from 'util';
import path from 'path';
const dir = path.join(__dirname, '../logs')

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const logFile = fs.createWriteStream(path.join(dir, '/console.log'), {flags : 'w'});
const warnFile = fs.createWriteStream(path.join(dir, '/warn.log'), {flags : 'w'});
const debugFile = fs.createWriteStream(path.join(dir, '/debug.log'), {flags : 'w'});
const errorFile = fs.createWriteStream(path.join(dir, '/error.log'), {flags : 'w'});

const mockConsole = (mute = true) => {
    const originalConsole = { ...console };

    console.log = function(...d: any[]) { 
        if(mute) 
            return
        logFile.write(util.format(d) + '\n');
      };

    console.warn = function(...d: any[]) {
        if(mute) 
            return
        warnFile.write(util.format(d) + '\n');
    };

    console.debug = function(...d: any[]) {
        if(mute) 
            return
        debugFile.write(util.format(d) + '\n');
    };

    console.error = function(...d: any[]) { 
        if(mute) 
            return
        errorFile.write(util.format(d) + '\n');
    };

    return () => {
        global.console = originalConsole;
    }
}

export default mockConsole
