# Glu App UI Repo

## 1 | Description

The Glu App.

## 2 | Getting Started

### 2.0 Required Tools for Android Emulator

1) Download and install Android Studio from developer.android.com

2) During installation, make sure to select "Android Virtual Device" option

3) Once installed, open Android Studio and go to "Tools" > "SDK Manager"

4) In SDK Platforms, select the Android versions you want to support

5) In SDK Tools, make sure "Android Emulator" is installed

6) Click "Apply" to install selected components
To create an emulator, go to "Tools" > "AVD Manager",

7) Click "Create Virtual Device" and follow the wizard to set up your desired device.

8) Once created, you can launch the emulator from AVD Manager.

### 2.1 Installing

1) Clone project `git clone https://github.com/Gluapplications/glu-app.git`

2) Install dependencies in both `./server` and `./src` and `./nightscout`

```
npm install
```

### 2.2 Running

Run the backend first, then the frontend.

1) In `./server`:

```
dev: npm run dev
prod: npm run start
```

2) In `./src`:

```
npm run start
```

3) Open the expo client to run the React-Native app on the desired mobile emulator.

```
press a | open Android Emulator (Android Studio)
Press w | open web (Web Browser)
Press r | reload app
press s | switch to Expo Go (Android Phone)
```

### 2.3 Building

For build instructions for the client, please see [Expo documentation](https://docs.expo.io/versions/latest/distribution/building-standalone-apps/) for building. This project uses Expo SDK 33. 

Options include:
* `expo build:android` 
* `expo build:ios`
* `expo build:web`

### 2.4 Viewing Logs

- In terminal: Use adb logcat
- In Android Studio: Open "Logcat" tab in the bottom panel
- In VS Code: Use extensions like "Logcat" or "React Native Tools"

## 3 | Structure

### 3.1 Ports

The back-end will be running in localhost:4000, while the front-end will be opened by the expo cli.

### 3.2 Requesting Data

To run the app on Expo for mobile, no proxy is used. Instead, the port is
written in the `fetch` requests

```
fetch('http://localhost:4000/users')
```

### 3.3 Server API

Backend Express REST API routes are found in `.server/routes/`


## 4 | Notes

### Dev Note 4/29/24

React-native + express starter Repo copied from here -> https://github.com/edsonayllon/react-native-web-express-starter

To run your project, navigate to the directory and run one of the following npm commands.

How to Update Expo `npm install expo@latest`

### Other Notes

#### How to Run (Do Not Use)

- npm run start
- npm run web npm run clear
- run Expo app. use Medium Phone emulator and boot.

- npm run android
- npm run ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac

#### Expo CLI Commands

`eas login` - will prompt for username and password 

`eas whoami` - will return your username

Android - build your Expo application with the preview profile inside the Expo dashboard using the following command. 
`eas build -p android --profile preview`

Create your first development build, use the following command:
`eas build --profile development --platform android`

Run app, than load expo go on phone 
`npx expo start --dev-client`

Clear cache 
`npx expo start --clear`

## 5 | Testing

 { username: 'tester2', email: 'tester2@test.com', password: 'abc123' }

 ---
 
email
: 
"tester3@test.com"
username
: 
"tester3"
wallets
: 
[{type: "bitcoin", address: "tb1qrlcc8qkq282dgmz4k9vwdm2cg4ufk362sftuxc",…}]
0
: 
{type: "bitcoin", address: "tb1qrlcc8qkq282dgmz4k9vwdm2cg4ufk362sftuxc",…}
address
: 
"tb1qrlcc8qkq282dgmz4k9vwdm2cg4ufk362sftuxc"
publicKey
: 
"030e8c63c4fe845ab4d3aea0c7c584b015b9a0bbee4cb95186db486f724be98d58"
type
: 
"bitcoin"