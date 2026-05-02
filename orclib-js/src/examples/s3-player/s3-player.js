// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { and, not, commandQuery, commandQueryConfig, withFrozenExpression } from '../../orc.js';
import { rectCheck } from './rect-check.js';

((strict) => {commandQueryConfig.strictMode = strict; window.s3player = function(s, uplDtFreqMap, uploadApi) {


// INITIALIZE
commandQuery(
    !s, () => {
        s = {
            mouse: { x: -1, y: -1, click: 0 },
            width: 950,//380,
            height: 400,
            index: 0,
            unlocked: 0,
            uplDtFreqMap: uplDtFreqMap,
            uploadApi: uploadApi
        };
        window.s3playerData = s;

        s.getMediaType = function(url) {
            const ext = url.split('?')[0].toLowerCase();
            if (/\.(jpg|jpeg|png|gif|bmp|webp|heic)$/.test(ext)) return "image";
            if (/\.(mp4|mov|webm|mkv|avi)$/.test(ext)) return "video";
            return "unknown";
        };

        let s3player = document.getElementById("s3-player");
        s3player.style.position = "relative";

        let playButton = document.createElement("img");
        playButton.src = "https://upload.wikimedia.org/wikipedia/commons/9/93/Gnome-media-playback-start.svg";
        playButton.style.position = "absolute";
        playButton.style.left = (s.width/2 - 48/2) + "px";
        playButton.style.top = (s.height/2 - 48/2) + "px";
        playButton.id = "s3playerplay";
        s3player.appendChild(playButton);

        let cursor = document.createElement("div");
        cursor.id = "cursor";
        cursor.style.position = "absolute";
        cursor.style.color = "green";
        cursor.innerHTML = "$";
        cursor.style.zIndex = 2;
        cursor.style.fontWeight = "bold";
        cursor.style.backgroundColor = "white";
        cursor.style.paddingLeft = "12px";
        cursor.style.paddingRight = "12px";
        cursor.style.paddingTop = "6px";
        cursor.style.paddingBottom = "6px";
        cursor.style.borderRadius = "32px";

        s3player.appendChild(cursor);
        let video = document.createElement("video");
        video.style.backgroundColor = "black";
        video.style.width = s.width + "px";
        video.style.height = s.height + "px";
        video.style.visibility = "hidden";
        video.id = "s3playervideo";
        video.setAttribute("controls", true);
        s3player.appendChild(video);
        let img = document.createElement("img");
        img.style.backgroundColor = "black";
        img.style.maxWidth = s.width + "px";
        img.style.maxHeight = s.height + "px";
        img.style.visibility = "hidden";
        img.style.position = "absolute";
        img.style.left = "50%";
        img.style.top = "50%";
        img.id = "s3playerimg";
        img.style.objectFit = "contain";
        img.style.transform = "translate(-50%, -50%)";
        s3player.appendChild(img);

        let footer = document.createElement("div");
        footer.style.color = "white";
        footer.style.backgroundColor = "darkgray";
        footer.style.width = s.width + "px";
        footer.style.position = "absolute";
        footer.style.bottom = "0";
        footer.style.left = "0";
        footer.style.right = "0";
        footer.style.paddingLeft = "8px";
        footer.style.zIndex = 1;
        s3player.appendChild(footer);

        let footerText = document.createElement("a");
        footerText.id = "s3playerfootertext";
        let pathComponents = window.s3media?.[s.index]?.url.split("/");
        let fileName = pathComponents?.[pathComponents.length - 1];
        let gb = (window.s3media?.[s.index]?.bytes ?? 0)/(1024*1024*1024);
        footerText.innerHTML
            = ("S3 Player $" + (gb?.toFixed(2))  + "GB .. " + fileName?.split("?")[0].slice(-36));
        footer.appendChild(footerText);

        let countView = document.createElement("span");
        countView.innerHTML = `${s.index+1} of ${window.s3media.length}`;
        countView.id = "s3playercountview";
        countView.style.position = "absolute";
        countView.style.right = "0";
        countView.style.backgroundColor = "white";
        countView.style.color = "red";
        countView.style.bottom = "0";
        countView.style.padding = "0 12px 0 12px";
        countView.style.borderLeft = "1px solid black";
        footer.style.border = "1px solid black";
        footer.appendChild(countView);

        let uploadDateView = document.createElement("div");
        uploadDateView.id = "s3playeruploaddate";
        uploadDateView.style.position = "absolute";
        uploadDateView.style.bottom = "24px";
        uploadDateView.style.left = "4px";
        uploadDateView.style.color = "white";
        uploadDateView.style.textDecoration = "italic";
        uploadDateView.innerHTML
            = "Uploaded: " + (window.s3media?.[s.index]?.uploadDate || '-') +
            ((window.s3media?.[s.index] || false) ? ` (${s.uplDtFreqMap[window.s3media?.[s.index]?.uploadDate]})` : '-');
        s3player.appendChild(uploadDateView);

        let addButton = document.createElement("div");
        addButton.id = "s3playeraddbutton";
        addButton.style.color = "white";
        addButton.style.backgroundColor = "green";
        addButton.style.position = "absolute";
        addButton.style.left = "0";
        addButton.style.top = s.height + "px";
        addButton.style.width = s.width + "px";
        addButton.style.padding = "8px";
        s3player.appendChild(addButton);

        let addButtonText = document.createElement("a");
        addButtonText.id = "s3playeraddbuttontext";
        addButtonText.innerHTML = "Upload photo or video";
        addButton.appendChild(addButtonText);

        let methodSelect = document.createElement("select");
        methodSelect.innerHTML = "<option value=''></option><option value='CIPH'>CIPH</option><option value='KIPH'>KIPH</option><option value='PSHT'>PSHT</option><option value='CLPX'>CLPX</option><option value='AKSO'>AKSO</option><option value='EVERG'>EVERG</option><option value='SCHL'>SCHL</option>";
        methodSelect.id = "s3playermethodselect";
        methodSelect.style.position = "absolute";
        methodSelect.style.right = "0";
        methodSelect.style.bottom = "0";
        methodSelect.addEventListener("change", (event) => {
            if (null != event.target.value) {
                localStorage.setItem("fj_create_method", event.target.value);
            }
        });
        addButton.appendChild(methodSelect);

        s3player.style.width = s.width + "px";
        s3player.style.backgroundColor = "black";
        s3player.style.height = s.height + "px";
    },

    (s != null && s.currentCursor == null), () => {
        s.currentCursor = document.getElementById("cursor");
        s.currentCursorLoaded = s.currentCursor != null ? 1 : 0;
    },

    (s == null || (s.currentCursor == null && document.getElementById("cursor") == null)), () => {
        s.currentCursorLoaded = 0
    },

    1, () => {
        s.media = window.s3media;
    },

    /*window.s3media.length > 0 &&*/
    !s, () => {
        let s3player = document.getElementById("s3-player");
        let leftArrow = document.createElement("button");
        let rightArrow = document.createElement("button");
        leftArrow.innerHTML = "&lt;";
        rightArrow.innerHTML = "&gt;";
        leftArrow.style.fontWeight = "bold";
        rightArrow.style.fontWeight = "bold";
        leftArrow.style.position = "absolute";
        rightArrow.style.position = "absolute";
        leftArrow.style.left = "2px";
        rightArrow.style.right = "2px";
        leftArrow.style.top = (s.height / 2.0 - 64 / 2.0) + "px";
        rightArrow.style.top = (s.height / 2.0 - 64 / 2.0) + "px";
        //leftArrow.style.padding = "4px 8px 4px 8px";
        leftArrow.style.width  = "64px";
        leftArrow.style.height = "64px";
        //leftArrow.style.borderRadius = "20px";
        leftArrow.style.borderRadius = "50%";
        //rightArrow.style.padding = "4px 8px 4px 8px";
        rightArrow.style.width  = "64px";
        rightArrow.style.height = "64px";
        //rightArrow.style.borderRadius = "20px";
        rightArrow.style.borderRadius = "50%";
        rightArrow.style.backgroundColor = "white";
        leftArrow.style.backgroundColor = "white";
        leftArrow.id = "s3playerleftarrow";
        rightArrow.id = "s3playerrightarrow";
        s3player.appendChild(leftArrow);
        s3player.appendChild(rightArrow);
    }

);

// ARROW UPDATES

commandQuery(

    s.index < s.media.length-1, () => {
        document.getElementById("s3playerrightarrow")
            .style.opacity = "1";
    },

    !(s.index < s.media.length-1), () => {
        document.getElementById("s3playerrightarrow")
            .style.opacity = "0.3";
    },

    s.index > 0, () => {
        document.getElementById("s3playerleftarrow")
            .style.opacity = "1";
    },

    s.index == 0, () => {
        document.getElementById("s3playerleftarrow")
            .style.opacity = "0.3";
    }

);

// ARROW CLICKS

commandQuery(

    (
        s.index < s.media.length-1 && s.mouse.click &&
        rectCheck(s.mouse.x, s.mouse.y, "s3playerrightarrow")
    ), () => {
        s.unlocked = 0;
        s.index += 1;
        document.getElementById("s3playercountview").innerHTML
            = `${s.index+1} of ${window.s3media.length}`;
        document.getElementById("s3playerplay").style.visibility = "visible";
        let pathComponents = s.media[s.index].url.split("/");
        let gb = s.media[s.index].bytes/(1024*1024*1024);
        let fileName = pathComponents[pathComponents.length - 1];
        document.getElementById("s3playerfootertext").innerHTML
            = ("S3 Player $" + (gb.toFixed(2))  + "GB .. " + fileName.split("?")[0].slice(-36));
        document.getElementById("s3playeruploaddate").innerHTML
            = "Uploaded: " + s.media[s.index].uploadDate +
            ` (${s.uplDtFreqMap[s.media[s.index].uploadDate]})`;
    },

    (
        s.index > 0 && s.mouse.click &&
        rectCheck(s.mouse.x, s.mouse.y, "s3playerleftarrow")
    ), () => {
        s.unlocked = 0;
        s.index -= 1;
        document.getElementById("s3playercountview").innerHTML
            = `${s.index+1} of ${window.s3media.length}`;
        document.getElementById("s3playerplay").style.visibility = "visible";
        let pathComponents = s.media[s.index].url.split("/");
        let gb = s.media[s.index].bytes/(1024*1024*1024);
        let fileName = pathComponents[pathComponents.length - 1];
        document.getElementById("s3playerfootertext").innerHTML
            = ("S3 Player $" + (gb.toFixed(2))  + "GB .. " + fileName.split("?")[0].slice(-36));
        document.getElementById("s3playeruploaddate").innerHTML
            = "Uploaded: " + s.media[s.index].uploadDate +
            ` (${s.uplDtFreqMap[s.media[s.index].uploadDate]})`;
    }

);

// CAMERA BLOB UPLOAD
withFrozenExpression((e) => {

    const createMethod = e(() => localStorage.getItem("fj_create_method"));

commandQuery(
    !!s.snap, () => {
        document.getElementById("s3playeraddbuttontext").innerHTML = ". . .";
        var file = window.cameraObj.file;
        s.uploadApi(file.name, file, createMethod())
            .then(result => {
                // result is bool (response.result.ok)
                if (!!s.test)
                    setTimeout(()=>{document.getElementById("s3playeraddbuttontext").innerHTML = "Upload photo or video";}, 3000); // mock an upload
                else
                    document.getElementById("s3playeraddbuttontext").innerHTML = "Upload photo or video";
                console.log("all done:", result);
                document.dispatchEvent(new CustomEvent("cameraupload", {
                    detail: { ok: result },
                    bubbles: true,
                    cancelable: true
                }));
            })
    }
);

});

// UPLOAD CLICK

withFrozenExpression((e) => {


    const selectElement = e(() => document.getElementById("s3playermethodselect"));

    const isMethodSelected = e(() => {
        const el = selectElement();
        const selectedIdx = el.selectedIndex;
        return selectedIdx < 0 ? false : el.options[selectedIdx].value.length > 0;
    });

    const methodNotActive = e(() => document.activeElement !== selectElement());

commandQuery(
    (
        s.mouse.click &&
        methodNotActive() &&
        isMethodSelected() &&
        rectCheck(s.mouse.x, s.mouse.y, "s3playeraddbutton")
    ), () => {
        document.getElementById("s3playeraddbuttontext").innerHTML = ". . .";
        var fi = document.createElement("input"); fi.type = "file";
        fi.multiple = true;
        fi.addEventListener("cancel", () => {
            document.getElementById("s3playeraddbuttontext").innerHTML = "Upload photo or video";
        });
        fi.addEventListener("change", async (e) => {
            const createMethod = selectElement().options[selectElement().selectedIndex].value;
//            console.log(e);
//            console.log(e.value);
            const uploads = Array.from(fi.files).map(file => s.uploadApi(file.name, file, createMethod));
            Promise.all(uploads).then(results => {
                document.getElementById("s3playeraddbuttontext").innerHTML = "Upload photo or video";
                console.log("all done:", results);
            });

/*
            for (var i=0; i < fi.files.length; i++) {
                console.log(fi.files[i].name);
                s.uploadApi(fi.files[i].name, fi.files[i]);
            }
*/
            //console.log(e.target.value);
            //console.log(fi.files);
        });
        fi.click();
        //s.uploadApi() // todo: actually upload a file with a real signedUrl
        //    .then((signedUrl) => {});
    }
);

});


// CURSOR MONEY-COST HINT
commandQuery(

    (
        s.unlocked || (
        s.currentCursorLoaded &&
        !(rectCheck(s.mouse.x, s.mouse.y, "s3-player")))
        //!(s.mouse.x < s.width && s.mouse.y < s.height)
    ), () => {
        s.currentCursor.style.visibility = "hidden";
    },

    (
        !s.unlocked &&
        s.currentCursorLoaded &&
        rectCheck(s.mouse.x, s.mouse.y, "s3-player")
        //s.mouse.x < s.width && s.mouse.y < s.height
    ), () => {
        let cursor = s.currentCursor;
        let playerRect = document.getElementById("s3-player").getBoundingClientRect();
        cursor.innerHTML = "$";
        cursor.style.left = (s.mouse.x + 20 - playerRect.left) + "px";
        cursor.style.top = (s.mouse.y - playerRect.top) + "px";
        s.currentCursor.style.visibility = "visible";
        //console.log(s.mouse.x, s.mouse.y);
    },

);


// PLAYER UPDATES - CALCULATE UNLOCK

commandQuery(

    (
        !s.unlocked && s.mouse.click &&
        rectCheck(s.mouse.x, s.mouse.y, "s3playerplay")
    ), () => {
        s.unlocked = 1;
        document.getElementById("s3playerplay").style.visibility = "hidden";
    }

);

// PLAYER UPDATES - UNLOCK
commandQuery(

    s.unlocked && (s.getMediaType(s.media[s.index].url) == "video") &&
    document.getElementById("s3playervideo")?.src !=
    s.media[s.index].url, () => {
        document.getElementById("s3playervideo").src = s.media[s.index].url;
    },

    s.unlocked && (s.getMediaType(s.media[s.index].url) == "image") &&
    document.getElementById("s3playerimg")?.src !=
    s.media[s.index].url, () => {
        document.getElementById("s3playerimg").src = s.media[s.index].url;
    },

    s.unlocked && (s.getMediaType(s.media[s.index].url) == "video"), () => {
        document.getElementById("s3playervideo").style.visibility = "visible";
        document.getElementById("s3playerimg").style.visibility = "hidden";
    },

    s.unlocked && (s.getMediaType(s.media[s.index].url) == "image"), () => {
        document.getElementById("s3playerimg").style.visibility = "visible";
        document.getElementById("s3playervideo").style.visibility = "hidden";
    },

    !s.unlocked, () => {
        document.getElementById("s3playerimg").style.visibility = "hidden";
        document.getElementById("s3playervideo").style.visibility = "hidden";
    }

);


}})(1);
