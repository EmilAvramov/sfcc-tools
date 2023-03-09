const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const writeLogFile = (text) => {
	const dir = path.resolve(__dirname, '../logs');
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	fs.writeFile(`${dir}/${uuidv4()}.txt`, text, (err) => {
		if (err) {
			console.log('An error occurred during logging', err)
		}
	});
};

module.exports = {
    writeLogFile: writeLogFile
}
