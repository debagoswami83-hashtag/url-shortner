async function shortenURL() {

    const url = document.getElementById("urlInput").value;

    const result = document.getElementById("result");

    result.innerHTML = "";

    try {

        const response = await fetch("/api/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ url })

        });

        const data = await response.json();

        if (!response.ok) {
            result.innerHTML =
                `<span style="color:red">${data.error}</span>`;
            return;
        }

        result.innerHTML = `
        <p>Short URL:</p>

        <a href="${data.shortUrl}" target="_blank">

            ${data.shortUrl}

        </a>

        <br><br>

        <button onclick="copyURL('${data.shortUrl}')">
            Copy
        </button>
        `;

    } catch {

        result.innerHTML =
            "<span style='color:red'>Something went wrong.</span>";

    }

}

function copyURL(url){

    navigator.clipboard.writeText(url);

    alert("Copied!");

}