//import {formatIncompletePhoneNumber, parseIncompletePhoneNumber} from "libphonenumber-js";
import {formatIncompletePhoneNumber, parseIncompletePhoneNumber} from "libphonenumber-js";

const phoneData = document.getElementById("phone_data") as HTMLInputElement;
const phoneInput = document.getElementById("phone") as HTMLInputElement & { oldValue: string };

phoneInput.value = formatIncompletePhoneNumber(phoneData.value);
phoneInput.oldValue = formatIncompletePhoneNumber(phoneData.value);

phoneInput.addEventListener("input", (__e) => {
    const e = __e as InputEvent;
    const raw = parseIncompletePhoneNumber(phoneInput.value);
    const rawChars = raw.split("");
    let from: number = 0;
    let to: number = 0;
    let deleted: string|undefined;
    if(phoneInput.oldValue.length < phoneInput.value.length) {
        // Added
        from = (phoneInput.selectionStart ?? 0) - (e.data?.length ?? 0);
        to = phoneInput.selectionStart ?? 0;
    } else if(phoneInput.oldValue.length > phoneInput.value.length) {
        // Removed
        from = phoneInput.selectionStart ?? 0;
        deleted = phoneInput.oldValue.slice(from, from + phoneInput.oldValue.length - phoneInput.value.length);
        to = (phoneInput.selectionStart ?? 0) + deleted.length;

        // If only format chars have been deleted, the user intended for deleting a non-format char
        let rawIndex = 0;
        let onlyFormatChars = true;
        let lastNonFormatCharIndex = -1;
        const rawOld = parseIncompletePhoneNumber(phoneInput.oldValue);
        // Walk through all chars matching up raw chars until 'to'. If there isn't any non-format char
        // (a char that matches up to the raw counterpart) then the user intended to delete a char
        // before the one he pressed delete on (or selected and deleted).
        for(let i = 0; i < Math.min(to, phoneInput.oldValue.length); i++) {
            if(phoneInput.oldValue[i] === rawOld[rawIndex]) {
                rawIndex++;
                lastNonFormatCharIndex = i;
                if(i >= from) {
                    onlyFormatChars = false;
                    break;
                }
            }
        }
        if(lastNonFormatCharIndex !== -1 && onlyFormatChars) {
            phoneInput.value =
                phoneInput.value.slice(0, lastNonFormatCharIndex) + phoneInput.value.slice(from)

            from = lastNonFormatCharIndex;
            deleted = phoneInput.oldValue.slice(from, from + phoneInput.oldValue.length - phoneInput.value.length);
        }
    }

    let rawFrom = 0;
    const valueChars = phoneInput.value.split("")
    let cursorToRaw = 0;
    let valueIndex = 0;
    for(; valueIndex < Math.min(from, phoneInput.value.length); valueIndex++) {
        if(rawChars[rawFrom] === valueChars[valueIndex]) {
            rawFrom++;
        }
    }

    if(phoneInput.oldValue.length < phoneInput.value.length) {
        let rawTo = rawFrom;
        for(; valueIndex < Math.min(to, phoneInput.value.length); valueIndex++) {
            if(rawChars[rawTo] === valueChars[valueIndex]) {
                rawTo++;
            }
        }
        cursorToRaw = rawTo;
    } else if(phoneInput.oldValue.length > phoneInput.value.length) {
        cursorToRaw = rawFrom;
    }


    phoneInput.value = formatIncompletePhoneNumber(phoneInput.value);

    // Set cursor position
    const rawPart = raw.slice(0, cursorToRaw);
    let rawPartIndex = 0;
    let cursorPosition = 0;
    for(; cursorPosition < phoneInput.value.length; cursorPosition++) {
        if(phoneInput.value[cursorPosition] === rawPart[rawPartIndex]) {
            rawPartIndex++;
        }
        if(rawPartIndex === rawPart.length) {
            break;
        }
    }
    cursorPosition++;

    phoneInput.selectionStart = cursorPosition;
    phoneInput.selectionEnd = cursorPosition;

    phoneInput.oldValue = phoneInput.value;
})
