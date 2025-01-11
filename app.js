const { spawn } = require("child_process");

// Function to stream audio
function streamAudio(url, res) {
    // yt-dlp command
    const ytdlp = spawn("yt-dlp", [
        "-f", "bestaudio", // Fetch the best audio quality
        "--no-playlist",   
        "-o", "-",         
        url
    ]);

    // Stream yt-dlp output to the client
    res.writeHead(200, {
        "Content-Type": "audio/mpeg", 
    });

    ytdlp.stdout.pipe(res);

    ytdlp.stderr.on("data", (data) => {
        console.error(`yt-dlp error: ${data}`);
    });

    ytdlp.on("close", (code) => {
        console.log(`yt-dlp process exited with code ${code}`);
        res.end();
    });
}

const express = require("express");
const app = express();

app.get("/stream", (req, res) => {
    const videoUrl = req.query.url; // Pass the YouTube URL as a query parameter
    if (!videoUrl) {
        res.status(400).send("No URL provided");
        return;
    }
    streamAudio(videoUrl, res);
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
