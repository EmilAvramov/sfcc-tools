const parser = require('xml2json');
const path = require('path');
const fs = require('fs');
const { writeLogFile } = require('./loggers')

const resolveFile = (file, rootDir) => {
	return new Promise((resolve, reject) => {
		fs.readFile(path.resolve(__dirname, `../${rootDir}/${file}`), (err, data) => {
			if (err) {
				writeLogFile(err);
				reject(err);
			} else {
				resolve(JSON.parse(parser.toJson(data)));
			}
		});
	});
};

module.exports = {
    resolveFile: resolveFile
}