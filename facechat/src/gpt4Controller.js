
const fs = require('fs');
const openai = require("openai");

function convertImagesToBase64Deprecated(filePaths, callback) {
    let encodedImages = [];
    for (x in filePaths) {
        fs.readFile(x, function(error, data) {
            if (error) {
                console.error('Error occurred while reading the file:', error);
                return;
            }
            const base64String = Buffer.from(data).toString('base64');
            encodedImages.push(base64String);
        });
    }

    callback(encodedImages);
}

class Gpt4Controller {
    #connector;
    #coachPrompt;

    static shared = new Gpt4Controller();

    constructor() {
        this.#connector = new openai.OpenAI({
            // TODO: Take key from environment
            // FOR NOW - Paste it in here
            apiKey: ""
        });

        this.#coachPrompt = "You are a communication coach who builds bridges between normal people and communication barriers people. Your advice will include the original speech.Give speaking advice and word choics on the following set of images and text. You will have only 3 part, Origin speech, Revised Speech and Communication Tips. each part only 2 sentence. The images were the reactions of listeners when the speaker was talking, and the transcribed text was provided as well.";

    }

    getConnector() {
        return this.#connector;
    }

    getPrompt() {
        return this.#coachPrompt;
    }

    convertImagesToBase64(filePaths, callback) {
        let encodedImages = [];
        for (let x of filePaths) {
            fs.readFile(x, function(error, data) {
                if (error) {
                    console.error('Error occurred while reading the file:', error);
                    return;
                }
                const base64String = Buffer.from(data).toString('base64');
                encodedImages.push(base64String);
            });
        }
    
        callback(encodedImages);
    }

    async transcribeAudio(audioFilePath) {
        const transcription = await Gpt4Controller.shared.getConnector().audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1"
        })

        return transcription.text;
    }

    async sendAllToGPT(audioFilePath, encodedImages) {
        let transcribedAudio =  await Gpt4Controller.shared.transcribeAudio(audioFilePath);

        let messages = [
            {
                role: "user",
                content: [
                    {type: "text", text: Gpt4Controller.shared.getPrompt()},
                    {type: "text", text: transcribedAudio}
                ]
            }
        ];

        for (let x of encodedImages) {
            messages.at(0).content.push(
                {
                    type: "image_url",
                    image_url: {
                        "url": "data:image/jpeg;base64,"+x
                    } 
                }
            );
        }

        try {
            const completion = await Gpt4Controller.shared.getConnector().chat.completions.create({
                messages: messages,
                model: "gpt-4-turbo",
            });
            console.log(completion.choices[0])
            return completion.choices[0];

        } catch (e) {
            console.log("An error occurred.");
            console.log(e);
        }
    }

    async getResponse(audioFilePath, imageFilePaths) {
        this.convertImagesToBase64(imageFilePaths, async function(encodedImages) {
            Gpt4Controller.shared.sendAllToGPT(audioFilePath, encodedImages);
        }); 
    }
};

let controller = Gpt4Controller.shared;
let audioFilePath = './src/assets/n.m4a';
let imageFilePaths = ['./src/assets/n.JPG'];
controller.getResponse(audioFilePath, imageFilePaths);