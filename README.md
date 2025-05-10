# Live phone number formatter

This is a demo of the live formatter script I wrote. It uses
`libphonenumber-js` for formatting.

So what does this script do?
- It preserves cursor position even when the phone number format changes
- If you delete a formatting character, it will also delete the first
  non-formatting character that comes before it.
- It maintains the raw value of the phone number in a hidden input
- If the hidden input's raw value changes, it will update the formatted input element.
- If the country code of the phone number changes, the raw value of the phone number
  will be formatted according to that country code's format.

## What phone numbers does this support?
It supports precisely the same phone numbers that `libphonenumber-js` supports.
For the list, please head over to their site.

## How do I run the demo?
Clone the project, then run:
- `npm i` - Installs the necessary dependencies
- `npm run dev` - Runs the project

The URL where the project is available will be written to the console.

> If you want to test this on a mobile device, but run it on a computer,
> run `npm run dev-shared` instead of `npm run dev`. This will make the
> demo available on your local network. I do not advise running this on
> an untrusted network (public networks, coffee shop and the like).