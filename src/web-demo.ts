import {loadPhoneInput, unloadPhoneInput} from "./phone-formatter.ts";

declare global {
    interface Window {
        loadTest(): void,
        unloadTest(): void,
    }
}

window.loadTest = () => loadPhoneInput(document.getElementById("phone"), document.getElementById("phone_data"));

window.unloadTest = () => unloadPhoneInput(document.getElementById("phone"));

window.loadTest();