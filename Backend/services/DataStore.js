const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/data.json");

class DataStore {
    static save(input) {
        let data = [];

        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        }

        data.push({
            input,
            date: new Date().toISOString(),
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
}

module.exports = DataStore;
