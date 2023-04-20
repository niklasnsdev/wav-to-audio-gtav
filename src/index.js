const path = require("path");
const fs = require("fs");
const ffmpeg = require("ffmpeg-static");
const args = require("minimist")(process.argv.slice(2));

const files = args["_"];

if (files.length > 0) {
	files.forEach((file) => {
		if (path.extname(file) === ".wav") {
			const inputPath = file;
			const outputDir = path.join(__dirname, "ready");
			const outputName = `output-${generateFilename()}.wav`;
			const outputPath = path.join(outputDir, outputName);

			console.log(outputPath);

			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir);
			}

			const ffmpegArgs = ["-i", inputPath, "-ac", "1", "-ar", "44100", "-sample_fmt", "s16", outputPath];
			const proc = require("child_process").spawn(ffmpeg, ffmpegArgs);

			proc.on("close", () => console.log(`File ${outputName} has been converted.`));
			proc.on("error", (err) => console.error(`Error converting from  ${outputName}: ${err.message}`));
		} else {
			console.log(`File must be .wav (https://convertio.co/de/mp3-wav)`);
		}
	});
}

function generateFilename() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");
	const filename = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
	return filename;
}
