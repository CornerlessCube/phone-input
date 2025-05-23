# Live phone number formatter

This is a utility for formatting phone numbers as you type. It uses 
`libphonenumber-js` for formatting.

So what does this script do?
- It preserves cursor position even when the phone number format changes
- If you delete a formatting character, it will also delete the first
  non-formatting character that comes before it.
- It maintains the raw value of the phone number in a hidden input
- If the hidden input's raw value changes, it will update the formatted input element.
- If the country code of the phone number changes, the raw value of the phone number
  will be formatted according to that country code's format.

## How do I install it?
Just run `npm i @cornerless/phone-input`

## What phone numbers does this support?
It supports precisely the same phone numbers that `libphonenumber-js` supports.
For the list, please head over to their site.

## Example
```js
import {loadPhoneInput, unloadPhoneInput} from "@cornerless/phone-input"

// The input the user sees. This will be formatted.
const formattedInput = document.getElementById("phone");
// A hidden input containing the raw form of the input (synchronised with the one the user sees).
// Use this hidden input to interface with frameworks.
const rawInput = document.getElementById("phone_data");

// This call registers the appropriate event listeners and puts the required custom data onto the elements.
loadPhoneInput(formattedInput, rawInput);

// If you want to unload the input (aka remove event listeners and custom data).
// You only need to pass in the formatted input. The utility figures out the rest.
unloadPhoneInput(formattedInput);

// By default, the utility checks what element you pass to it (to ensure it's an input)
// You may disable this by passing an additional boolean parameter to the methods above.
// Just like this:
loadPhoneInput(formattedInput, rawInput, true);
unloadPhoneInput(formattedInput, true);
```

## How do I run the demo?
Clone the project, then run:
- `npm i` - Installs the necessary dependencies
- `npm run dev` - Runs the project

The URL where the project is available will be written to the console.

> If you want to test this on a mobile device, but run it on a computer,
> run `npm run dev-shared` instead of `npm run dev`. This will make the
> demo available on your local network. I do not advise running this on
> an untrusted network (public networks, coffee shop and such).

---
This project was proudly created by me, CornerlessCube. If you use this utility in
your project, please consider giving me a star on GitHub.