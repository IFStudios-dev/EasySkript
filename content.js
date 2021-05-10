console.log("[Easy Skript]: Injected successfully!");


// Once dashboard loads, inject extra buttons
function checkInDashboard() {
    let inDashBoard = [];
    for (let button of document.getElementsByTagName("button")) {
        if (button.innerText.trim().toUpperCase() == "EDIT SERVER") {
            inDashBoard.push(button);
        }
    }
    if (!inDashBoard.length) {
        setTimeout(checkInDashboard, 100);
    } else {
        document.querySelectorAll('[href="/dashboard"]')[0].onclick = (event) => {
            for (let openSkriptsBtn of document.getElementsByClassName("to-skripts-btn")) {
                openSkriptsBtn.remove();
            }
            checkInDashboard();

        };
        for (let editBtn of inDashBoard) {
            editBtn.parentElement.style.display = "flex";
            if (editBtn.classList.contains("v-btn--disabled")) {
                editBtn.parentElement.insertAdjacentHTML("beforeend", `<button disabled="disabled" style="margin-left:16px" type="button" class="v-btn--disabled to-skripts-btn v-btn v-btn--is-elevated v-btn--has-bg theme--dark v-size--default primary"><span class="v-btn__content">TO SKRIPTS</span></button>`);
            } else {
                editBtn.parentElement.insertAdjacentHTML("beforeend", `<button style="margin-left:16px" type="button" class="to-skripts-btn v-btn v-btn--is-elevated v-btn--has-bg theme--dark v-size--default primary"><span class="v-btn__content">TO SKRIPTS</span></button>`);
            }
        }
        for (let openSkriptsBtn of document.getElementsByClassName("to-skripts-btn")) {
            openSkriptsBtn.addEventListener("click", openSkripts);
        }
    }
}
checkInDashboard();

function openSkripts(event) {
    console.log("[Easy Skript]: Opening skripts folder...");
    // In main dashboard
    event.currentTarget.previousElementSibling.click();
    found = false;
    // In server dashboard
    function clickFilesBtn() {
        found = document.querySelectorAll('[href="/dashboard/files"]')[0];
        if (!found) {
            setTimeout(clickFilesBtn, 100);
        } else {
            found.click();
            found = false;
            // In file manager
            function clickPluginsFolder() {
                for (let folder of document.querySelectorAll('[role="option"]')) {
                    if (folder.innerText == "plugins") {
                        found = folder;
                    }
                }
                if (!found) {
                    setTimeout(clickPluginsFolder, 100);
                } else {
                    found.click();
                    found = false;
                    // In plugins folder
                    function clickSkriptFolder() {
                        for (let folder of document.querySelectorAll('[role="option"]')) {
                            if (folder.innerText == "Skript") {
                                found = folder;
                            }
                        }
                        if (!found) {
                            setTimeout(clickSkriptFolder, 100);
                        } else {
                            found.click();
                            found = false;
                            // In Skript folder
                            function clickScriptsFolder() {
                                for (let folder of document.querySelectorAll('[role="option"]')) {
                                    if (folder.innerText == "scripts") {
                                        found = folder;
                                    }
                                }
                                if (!found) {
                                    setTimeout(clickScriptsFolder, 100);
                                } else {
                                    found.click();
                                    found = false;
                                    // In scripts folder
                                    console.log("[Easy Skript]: Skripts folder opened successfully!");
                                }
                            }
                            clickScriptsFolder();
                        }
                    }
                    clickSkriptFolder();
                }
            }
            clickPluginsFolder();
        }
    }
    clickFilesBtn();
}

// When minehut editor is opened, inject easy editor
function checkInEditor() {
    let inEditor = false;
    for (let H3 of document.getElementsByTagName("h3")) {
        let splitH3 = H3.innerText.split(".");
        if (splitH3[splitH3.length - 1] === "sk") {
            inEditor = true;
        }
    }
    if (!inEditor) {
        setTimeout(checkInEditor, 100);
    } else {
        console.log("[Easy Skript]: Detected a .sk file, injecting Easy Skript Editor");
        injectEditor();
    }
}

checkInEditor();


let fakeSaveBtn;
let editorFrame;
let minehutEditor;
let saveBtn;
function injectEditor() {
    minehutEditor = document.getElementsByTagName("textarea")[0];
    let minehutContainer = minehutEditor.parentElement.parentElement.parentElement.parentElement;
    for (let button of document.getElementsByTagName("button")) {
        if (button.innerText.trim().toUpperCase() == "SAVE") {
            saveBtn = button;
            break;
        }
    }
    for (let button of document.getElementsByTagName("button")) {
        if (button.innerText.trim().toUpperCase() == "EXIT") {
            button.onclick = (event) => {
                fakeSaveBtn.remove();
                editorFrame.remove();
                window.removeEventListener("message", handleIframeMsg);

                checkInEditor();
            };
        }
    }
    for (let button of document.getElementsByTagName("button")) {
        if (button.innerText.trim().toUpperCase() == "DELETE FILE") {
            button.onclick = (event) => {
                for (let button of document.getElementsByTagName("button")) {
                    if (button.innerText.trim().toUpperCase() == "YES") {
                        button.onclick = (event) => {
                            fakeSaveBtn.remove();
                            editorFrame.remove();
                            window.removeEventListener("message", handleIframeMsg);


                            function waitForDeletion() {
                                let found = false;
                                for (let label of document.getElementsByTagName("label")) {
                                    if (label.innerText.trim().toUpperCase() == "SEARCH FILES") {
                                        found = label;
                                    }
                                }
                                if (!found) {
                                    setTimeout(waitForDeletion, 100);
                                } else {
                                    checkInEditor();

                                }
                            }
                            waitForDeletion();

                        };
                    }
                }
            };
          
        }
    }

    minehutContainer.firstElementChild.style.display = "none";

    minehutContainer.insertAdjacentHTML("afterbegin", `
    <div style="
        width: 100%;
        height: 550px;
        overflow: hidden!important;
        resize: both!important;
        margin-top: 16px;
        margin-bottom: 16px;
        ">
        <iframe 
            id="editor-iframe"
            src="https://skript-editor.netlify.app/" 
            title="Easy Skript Editor" 
            frameborder="0" 
            style="
                width:100%;
                height:100%;
                border-radius:4px;
                border: 1px solid #555555!important;
            "
            allowfullscreen>
        </iframe>
    </div>`);

    window.addEventListener("message", handleIframeMsg);



    editorFrame = document.getElementById("editor-iframe");
    editorFrame.addEventListener("load", (event) => {
        editorFrame.contentWindow.postMessage({fileContents: minehutEditor.value}, "*");

        saveBtn.style.display = "none";
        saveBtn.parentElement.insertAdjacentHTML("beforeend", `<button id="fake-save-btn" type="button" class="v-btn v-btn--is-elevated v-btn--has-bg theme--dark v-size--default primary"><span class="v-btn__content">Save</span></button>`);
        fakeSaveBtn = document.getElementById("fake-save-btn");
        fakeSaveBtn.addEventListener("click", (event) => {
            saveCode();
        })
    })
}

function saveCode() {
    console.log("[Easy Skript]: Saving your code...");
    fakeSaveBtn.classList.add("v-btn--loading");
    editorFrame.contentWindow.postMessage({getEditorContents: null}, "*");
}

// Receive messages from IFrame
function handleIframeMsg(event) {
    if (event.origin == "https://skript-editor.netlify.app") {
        let eventData = Object.values(event.data)[0];
        switch (Object.keys(event.data)[0]) {
            case "editorContents":
                var simulatedEvent = new Event("input");
                minehutEditor.value = eventData;
                minehutEditor.dispatchEvent(simulatedEvent);
                saveBtn.click();
                fakeSaveBtn.classList.remove("v-btn--loading");
                break
            case "save":
                saveCode();
        }
    }
}

// Recieve events from popup script
chrome.runtime.onMessage.addListener((msg, sender, callback) => {
    switch (Object.keys(msg)[0]) {
        case "refresh":
            console.log("[Easy Skript]: Refreshing Easy Skript Editor...");
            if (fakeSaveBtn) {
                fakeSaveBtn.remove();
            }
            editorFrame.remove();
            window.removeEventListener("message", handleIframeMsg);
            checkInEditor();
            break;
    }
});
