import {formatIncompletePhoneNumber, parseIncompletePhoneNumber} from "libphonenumber-js";

enum EditType {
    Add,
    Remove
}

export type FormattedHTMLInputElement = HTMLInputElement & { oldValue: string, rawInputElement: HTMLInputElement };
export type RawHTMLInputElement = HTMLInputElement & { formattedInputElement: HTMLInputElement };

export function loadPhoneInput(__inputElement: HTMLElement | null, __rawInputElement: HTMLElement | null) {
    if(
        !__inputElement ||
        !__rawInputElement ||
        __inputElement.tagName !== "INPUT" ||
        __rawInputElement.tagName !== "INPUT"
    ) {
        console.warn("Could not load phone input. One of the provided elements is null or not an input element");
        return;
    }

    const inputElement = __inputElement as FormattedHTMLInputElement;
    const rawInputElement = __rawInputElement as RawHTMLInputElement;
    const formatted = formatIncompletePhoneNumber(rawInputElement.value);
    inputElement.value = formatted;
    inputElement.oldValue = formatted;
    inputElement.rawInputElement = rawInputElement;

    rawInputElement.formattedInputElement = inputElement;

    inputElement.addEventListener("input", handleInputFromFormatted)
    inputElement.rawInputElement.addEventListener("input", handleInputFromRaw)
}

export function unloadPhoneInput(__inputElement: HTMLElement | null) {
    if(!__inputElement || __inputElement.tagName !== "INPUT") {
        console.warn("Could not unload phone input. The provided element is null or not an input element");
        return;
    }

    const inputElement = __inputElement as FormattedHTMLInputElement;
    inputElement.removeEventListener("input", handleInputFromFormatted)
    inputElement.rawInputElement.removeEventListener("input", handleInputFromRaw)
}

function handleInputFromRaw(__e: Event) {
    const inputElement = __e.target as RawHTMLInputElement;
    inputElement.formattedInputElement.value = formatIncompletePhoneNumber(inputElement.value);
}

const handleInputFromFormatted = (__e: Event) => {
    const e = __e as InputEvent;
    const phoneInput = __e.target as FormattedHTMLInputElement;
    const phoneData = phoneInput.rawInputElement;
    const cursor = phoneInput.selectionStart ?? 0;

    // "from" and "to" represent the part of the string edited in the EDITED string.
    // Since the "to" value is undefined if deletion occurs, it is not used in that case.
    // Additionally, when deleting, the "from" value is the same for the string before editing
    // and the edited string.
    let from: number = 0;
    let to: number = 0;
    let editType: EditType;

    if(phoneInput.oldValue.length < phoneInput.value.length) editType = EditType.Add;
    else if(phoneInput.oldValue.length > phoneInput.value.length) editType = EditType.Remove;
    else return;

    if(editType === EditType.Add) {
        // Added
        from = cursor - (e.data?.length ?? 0);
        to = cursor;
    } else {
        // Removed
        from = cursor;
        //deleted = phoneInput.oldValue.slice(from, from + phoneInput.oldValue.length - phoneInput.value.length);
        //to = (phoneInput.selectionStart ?? 0) + deleted.length;
        const toOld = cursor + phoneInput.oldValue.length - phoneInput.value.length

        // If only format chars have been deleted, the user intended for deleting a non-format char
        let rawIndex = 0;
        let onlyFormatChars = true;
        let lastNonFormatCharIndex = -1;
        const rawOld = parseIncompletePhoneNumber(phoneInput.oldValue);

        // Walk through all chars matching up raw chars until 'to'. If there isn't any non-format char
        // (a char that matches up to the raw counterpart) then the user intended to delete a char
        // before the one he pressed delete on (or selected and deleted).
        for(let i = 0; i < Math.min(toOld, phoneInput.oldValue.length); i++) {
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
        }
    }

    const raw = parseIncompletePhoneNumber(phoneInput.value);
    const rawChars = raw.split("");

    let rawFrom = 0;
    const valueChars = phoneInput.value.split("")
    let newCursorRaw;

    // Calculate what index would point to if the phone number was unformatted
    // So: the "from" variable points to a non-formatting char of the formatted phone number.
    // If we strip the formatting chars, the phone number stays the same, but the indexes don't.
    // We are looking to find the same character "from" points to, but in a string
    // with no formatting. The index of the char in the non-formatted string will be "rawFrom".
    let valueIndex = 0;
    for(; valueIndex < from; valueIndex++) {
        if(rawChars[rawFrom] === valueChars[valueIndex]) {
            rawFrom++;
        }
    }

    if(editType === EditType.Add) {
        // If we added to the string, we'd like the cursor to the end of the addition.
        // Since we know "rawFrom" and valueIndex conveniently equals "from", we can skip
        // looking at the chars in our string that come before the modified area
        let rawTo = rawFrom;
        for(; valueIndex < to; valueIndex++) {
            if(rawChars[rawTo] === valueChars[valueIndex]) {
                rawTo++;
            }
        }
        newCursorRaw = rawTo;
    } else {
        newCursorRaw = rawFrom;
    }

    phoneData.value = parseIncompletePhoneNumber(phoneInput.value);
    // This event will also update the phoneInput element
    phoneData.dispatchEvent(new Event("input"))

    //phoneInput.value = formatIncompletePhoneNumber(phoneInput.value);

    // Since we know where the cursor should be in the unformatted string, we just need to
    // find the same place in the formatted string.
    let newCursor = 0;
    if(newCursorRaw === 0) {
        newCursor = newCursorRaw;
    } else {
        const rawPart = raw.slice(0, newCursorRaw);
        let rawIndex = 0;
        for(; newCursor < phoneInput.value.length; newCursor++) {
            if(phoneInput.value[newCursor] === rawPart[rawIndex]) {
                rawIndex++;
            }
            if(rawIndex === rawPart.length) {
                break;
            }
        }
        // We want the cursor AFTER the last edited character
        newCursor++;
    }


    phoneInput.selectionStart = newCursor;
    phoneInput.selectionEnd = newCursor;

    phoneInput.oldValue = phoneInput.value;
}