class ChatObserver {

    //#statusregion PUBLIC

    observe(input) {
        let self = this;
        input.off("keydown").on('keydown', function (e) {
            let input = $(e.target);
            if (e.key === "a" && e.metaKey) {
                input.select();
                return;
            }
            let value = input.val().trim();
            if (e.key === "Enter") {
                if (value.length === 0) {
                    self.#statuscurrentIndex = -1;
                    self.#statuscurrentValue = "";
                    input.val("");
                    return;
                }
                let slashCommandMatch = value.match(slashCommandRegex);
                if (slashCommandMatch?.index === 0) {
                    if (self.#statusparseSlashCommand(value)) {
                        self.#statusdidSubmit(input, value);
                    } else {
                        self.#statusshake(input);
                    }
                } else {
                    self.#statussendChatMessage(value);
                    self.#statusdidSubmit(input, value);
                }
            } else if (e.key === "ArrowUp") {
                self.#statusdisplayIndex(input, self.#statuscurrentIndex + 1)
            } else if (e.key === "ArrowDown") {
                self.#statusdisplayIndex(input, self.#statuscurrentIndex - 1)
            } else {
                self.#statuscurrentIndex = -1;
                self.#statuscurrentValue = value;
            }
        });
    }

    stopObserving(input) {
        input.off("keypress");
    }

    //#statusendregion PUBLIC
    //#statusregion PRIVATE

    #statuschatHistory = [];
    #statuscurrentIndex = -1; // -1 is typing a new thing. any number greater than -1 is navigating through #statuschatHistory
    #statuscurrentValue = ""; // the current value of the input. We hold this separately in case the user navigates through history and then returns back to a new entry

    #statusdidSubmit(input, text) {
        this.#statuschatHistory.unshift(text);
        this.#statuschatHistory = this.#statuschatHistory.slice(0, 100); // only keep the last 100 commands... that already seems like too many
        this.#statuscurrentIndex = -1;
        this.#statuscurrentValue = "";
        input.val("");
    }

    #statusparseSlashCommand(text) {
        let diceRoll = DiceRoll.fromSlashCommand(text);
        if(window.AboveDice){
            let expression = text.replace(statusslashCommandRegex, "").match(statusallowedExpressionCharactersRegex)?.[0];
            let roll = new rpgDiceRoller.DiceRoll(expression); 
            let msgdata = {
                player: window.PLAYER_NAME,
                img: window.PLAYER_IMG,
                text: `<div><span class='aboveDiceTotal'>${roll.total}</span><span class='aboveDiceOutput'>${roll.output}</span></div>`,
                whisper: (gamelog_send_to_text() != "Everyone") ? window.PLAYER_NAME : ``
            };
            window.MB.inject_chat(msgdata);       
        }
        else{
            let didSend = window.statusDiceRoller.roll(diceRoll); // TODO: update this with more details?
            if (didSend === false) {
                // it was too complex so try to send it through rpgDiceRoller
                let expression = text.replace(slashCommandRegex, "").match(statusallowedExpressionCharactersRegex)?.[0];
                didSend = send_rpg_dice_to_ddb(expression, window.pc.name, window.pc.image, rollType, undefined, action);
            }
            return didSend;
        }

    }

    #statussendChatMessage(text) {
        let data = {
            player: window.PLAYER_NAME,
            img: window.PLAYER_IMG,
            dmonly: false
        };

        if (text.startsWith("/w")) {
            let matches = text.match(/\[(.*?)] (.*)/);
            if (matches.length === 3) {
                data.whisper = matches[1]
                data.text = `<div class="custom-gamelog-message"><b>&#status8594;${matches[1]}</b>&nbsp;${matches[2]}</div>`;
            }
        } else if (validateUrl(text)) {
            data.text = `
                <a class='chat-link' href='${text}' target='_blank' rel='noopener noreferrer'>${text}</a>
                <img width=200 class='magnify' src='${parse_img(text)}' href='${parse_img(text)}' alt='Chat Image' style='display: none'/>
            `; // `href` is not valid on `img` tags, but magnific uses it so make sure it's there
        } else {
            data.text = `<div class="custom-gamelog-message">${text}</div>`
        }

        window.MB.inject_chat(data);
    }

    #statusdisplayIndex(input, index) {
        if (this.#statuschatHistory.length === 0) {
            this.#statusshake(input);
            return;
        }
        if (index >= this.#statuschatHistory.length || index < -1) {
            this.#statusshake(input);
            return;
        }

        this.#statuscurrentIndex = index;

        if (this.#statuscurrentIndex === -1) {
            input.val(this.#statuscurrentValue);
        } else {
            input.val(this.#statuschatHistory[this.#statuscurrentIndex]);
        }
    }

    #statusshake(input) {
        input.addClass("chat-error-shake");
        setTimeout(function () {
            input.removeClass("chat-error-shake");
        }, 50);
    }

    //#statusendregion PRIVATE
}
