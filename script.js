const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const statusBar = document.getElementById("status-bar");

const statusTexts = [
    "브라운이 조용히 잔을 닦고 있다.",
    "따뜻한 커피 향이 퍼지고 있다.",
    "Dream Bar는 오늘도 문을 열었다.",
    "창밖에서는 빗소리가 들려온다.",
    "잔잔한 재즈가 흐르고 있다."
];

setInterval(() => {
    statusBar.textContent =
        statusTexts[Math.floor(Math.random() * statusTexts.length)];
}, 5000);

function addMessage(text, type) {

    const msg = document.createElement("div");

    msg.className = `message ${type}`;

    msg.textContent = text;

    chatBox.appendChild(msg);

    chatBox.scrollTop = chatBox.scrollHeight;

    return msg;
}

async function typeMessage(text, type = "ai") {

    const msg = document.createElement("div");

    msg.className = `message ${type}`;

    chatBox.appendChild(msg);

    let currentText = "";

    for (let i = 0; i < text.length; i++) {

        currentText += text[i];

        msg.textContent = currentText;

        chatBox.scrollTop = chatBox.scrollHeight;

        await new Promise(resolve =>
            setTimeout(resolve, 25)
        );
    }
}

function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    askBrown(text);
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        e.preventDefault();

        sendMessage();
    }
});

async function askBrown(message) {

    const thinkingTexts = [
        "브라운이 잔을 닦으며 생각에 잠겼다...",
        "브라운이 조용히 당신의 이야기를 듣고 있다...",
        "브라운이 커피잔을 내려놓는다...",
        "브라운이 잠시 눈을 감는다...",
        "브라운이 천천히 생각을 정리한다..."
    ];

    const thinking = addMessage(
        thinkingTexts[
            Math.floor(Math.random() * thinkingTexts.length)
        ],
        "ai"
    );

    sendBtn.disabled = true;
    input.disabled = true;

    try {

        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "brown:latest",
                    prompt: message,
                    stream: false
                })
            }
        );

        const data = await response.json();

        thinking.remove();

        await typeMessage(
            data.response,
            "ai"
        );

    } catch (error) {

        console.error(error);

        thinking.remove();

        addMessage(
            "브라운이 잠시 자리를 비운 것 같군요...",
            "ai"
        );
    }

    sendBtn.disabled = false;
    input.disabled = false;

    input.focus();
}