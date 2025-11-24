// START OF LITERATE PROGRAM FILE
// Wik-mode can be used in emacs to expand/collapse sections.

import { and, not, commandQuery, commandQueryConfig } from '../../orc.js';
import { rectCheck } from './rect-check.js';

((strict) => {commandQueryConfig.strictMode = strict; window.s3player = function(s) {


// INITIALIZE
commandQuery(
    !s, () => {
        s = {
            mouse: { x: -1, y: -1, click: 0 },
            width: 380,
            height: 400,
            index: 0,
            unlocked: 0
        };
        window.s3playerData = s; 

        let s3player = document.getElementById("s3-player");
        s3player.style.position = "relative";

        let playButton = document.createElement("img");
        playButton.src = "https://upload.wikimedia.org/wikipedia/commons/9/93/Gnome-media-playback-start.svg";
        playButton.style.position = "absolute";
        playButton.style.left = (s.width/2 - 48/2) + "px";
        playButton.style.top = (s.width/2 - 48/2) + "px";
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
        img.style.transform = "translate(-50%, -50%)";
        s3player.appendChild(img);

        let footer = document.createElement("div");
        footer.innerHTML = "$ S3 Player";
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

    window.s3media.length > 0 &&
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
        leftArrow.style.top = (s.height / 2) + "px";
        rightArrow.style.top = (s.height / 2) + "px";
        leftArrow.style.padding = "4px 8px 4px 8px";
        leftArrow.style.borderRadius = "20px";
        rightArrow.style.padding = "4px 8px 4px 8px";
        rightArrow.style.borderRadius = "20px";
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
    }

);

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

    s.unlocked && s.media[s.index].url.endsWith("webm") &&
    document.getElementById("s3playervideo")?.src !=
    s.media[s.index].url, () => {
        document.getElementById("s3playervideo").src = s.media[s.index].url;
    },

    s.unlocked && s.media[s.index].url.endsWith("jpg") &&
    document.getElementById("s3playerimg")?.src !=
    s.media[s.index].url, () => {
        document.getElementById("s3playerimg").src = s.media[s.index].url;
    },

    s.unlocked && s.media[s.index].url.endsWith("webm"), () => {
        document.getElementById("s3playervideo").style.visibility = "visible";
        document.getElementById("s3playerimg").style.visibility = "hidden";
    },

    s.unlocked && s.media[s.index].url.endsWith("jpg"), () => {
        document.getElementById("s3playerimg").style.visibility = "visible";
        document.getElementById("s3playervideo").style.visibility = "hidden";
    },

    !s.unlocked, () => {
        document.getElementById("s3playerimg").style.visibility = "hidden";
        document.getElementById("s3playervideo").style.visibility = "hidden";
    }

);


}})(1);
