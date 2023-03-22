# Introduction to three.js

![Spacemaker three logo](public/spacemakerthree.jpg)

## Getting started

### Prerequisites

You will need the following installed:

- node.js [Installation guide](https://nodejs.org/en/)
- A code editor of your choice (see [Code editor section](#code-editor-tips) for tips to make life easier during the course!)

### Running the code

1. Install node (see above)
2. Install yarn: `sudo npm install --global yarn`
3. Download the repository, either by `git clone https://github.com/spacemakerai/threejs-course.git` or by downloading the ZIP.
4. In a terminal, navigate to the downloaded folder and run `yarn install` or `npm install`
5. To run the code and make it listen to changes, run `yarn dev` or `npm run dev`

Open the URL that is printed to your terminal to open the webpage.
If you're seeing a completely red canvas, you're set to begin!

### Now what?

Navigate to `src/main.ts` and scroll down to "TASK 1" and follow the instructions!

Good luck!

 ## Code editor tips

Different editors have different out-of-the-box support for the libraries we're using in this repository – see different
popular alternatives below.

In general, most editors will help you with auto-completing which parameters you need to pass in to a function – at
least after necessary dependencies [have been installed](#running-the-code). This will be very useful throughout this
course. See the different editor sections for how to see this.

### Visual Studio Code

Visual Studio Code includes TypeScript language support out-of-the-box, so no extensions are needed.

Some useful hotkeys:
| Hotkey  | Windows/Linux  | Mac
|---|---|---|
| See which parameters a class or a function takes in  | Ctrl + Shift + Space  | Shift ⇧ + Cmd ⌘ + Space  |
| Go to definition  | F12 / Ctrl + Click  | F12 / Cmd ⌘ + Click |
| See usages  | F12 / Ctrl + Click  | F12 / Cmd ⌘ + Click |

### IntelliJ / WebStorm

IntelliJ and Webstorm needs the Typescript plugin installed, but by default it comes bundled, so this should work
out of the box.

Some useful hotkeys:
| Hotkey  | Windows/Linux  | Mac
|---|---|---|
| See which parameters a class or a function takes in  | Ctrl + P  | Cmd ⌘ + P  |
| Go to definition  | Ctrl + B / Ctrl + Click  | Cmd + B / Cmd ⌘ + Click |
| See usages  | Ctrl + B / Ctrl + Click  | Cmd + B / Cmd ⌘ + Click |