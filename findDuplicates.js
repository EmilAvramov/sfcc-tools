const fs = require('fs');
const util = require('util');
const { writeLogFile } = require('./utils/loggers');
const { resolveFile } = require('./utils/resolvers')

const readdir = util.promisify(fs.readdir);

const sets = [];
const promises = [];
const catalogNames = [];

const intersection = (setA, setB) => {
	const _intersection = new Set();
	for (const elem of setB) {
		if (setA.has(elem)) {
			_intersection.add(elem);
		}
	}
	return _intersection;
};

const readDirectory = async () => {
	const files = await readdir('./catalogs');
	files.forEach((file) => promises.push(resolveFile(file, 'catalogs')));
};

const findDuplicates = (promises) => {
	Promise.all(promises).then((data) => {
		data.forEach((resolvedFile) => {
			const temp = [];
			resolvedFile.catalog.product.forEach((master) => {
				temp.push(master['product-id']);
			});
			const tempSet = new Set(temp);
			if (sets) {
				sets.forEach((set) => {
					const duplicates = intersection(tempSet, set);
					if (duplicates) {
						const index = sets.indexOf(set);
						let output = `Found duplicates between ${resolvedFile.catalog['catalog-id']} and ${catalogNames[index]}`;
						duplicates.forEach((item) => {
							output += `\n${item}`;
						});
						writeLogFile(output);
					}
				});
			}
			catalogNames.push(resolvedFile.catalog['catalog-id']);
			sets.push(tempSet);
		});
	});
};

readDirectory().then(() => {
	findDuplicates(promises);
	console.log('Finished searching, please check the log files');
});
