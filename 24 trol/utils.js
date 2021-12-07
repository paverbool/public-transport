import fs from "fs";

export const writeIfFileExists = async (file, data) => {
    if (!fs.existsSync(file)) {
        fs.appendFileSync(file, data);
    } else {
        // await fs.truncate(file, 0, () => {})
        await fs.writeFileSync(file, data);
    }
}
