# Glu App UI Repo

## 1 | Description

Bump BTC Wallet

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

1) Clone project `git clone ...`

2) Install dependencies in both `./server` and `./src`

```
npm install
```

### 2.2 Running

Run the backend first, then the frontend.

1) In `./server`:

```
npm run start
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

### Dev Note 8/17/24
#### Steps needed to make NFC work with your Expo-based React Native app:

Install the necessary package:

Copyexpo install react-native-nfc-manager

Update your app.json file to include NFC permissions for Android:

Updated app.json for NFC supportClick to open code

Ensure that the NFCPayScreen.js file is updated as we discussed earlier.
To make the NFC work with the app and phone, you'll need to build a development client or create a standalone app. Expo Go doesn't support custom native modules like react-native-nfc-manager. Here's how to do it:

a. Install the EAS CLI if you haven't already:
Copynpm install -g eas-cli

b. Log in to your Expo account:
Copyeas login

c. Configure your project for building:
Copyeas build:configure

d. Build a development client:
Copyeas build --profile development --platform android

This will create an APK file that you can install on your Android device for testing.

Once you have the development build installed on your Android device, you can test the NFC functionality using the NFCPayScreen we implemented earlier.

For production, you'll need to build a standalone app:
Copyeas build --platform android


Remember that NFC functionality will only work on Android devices with NFC hardware. The iOS version won't have NFC payment capabilities, as we've already handled that case in the NFCPayScreen.js component.
To test the NFC functionality:

Install the development build on an NFC-capable Android device.

Enable NFC on the device in the system settings.

Open your app and navigate to the NFCPayScreen.

Use another NFC-enabled device or an NFC tag to simulate a payment terminal.

Tap your device to the NFC tag or the other device to test the payment process.

If you encounter any issues, make sure that:

NFC is enabled on your Android device.

You're using a physical device, not an emulator (emulators typically don't support NFC).

The NFC tag or simulated payment terminal is properly formatted with the expected payment information.

By following these steps, you should be able to get NFC working with your Expo-based React Native app on Android devices.

To test the NFC functionality, you'll need to use a physical Android device with NFC capabilities. Here are some steps to test:

Install the app on an NFC-enabled Android device.
Ensure NFC is enabled in the device settings.
Prepare an NFC tag with payment information. You can use an NFC writing app to write a JSON payload to an NFC tag. The payload should look like this:

jsonCopy{
  "amount": 17.25,
  "address": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
  "currency": "bitcoin"
}

Open the app and navigate to the NFC Pay screen.

Tap the Android device to the NFC tag.

The app should detect the NFC tag and process the payment.

For simulating the backend API calls, you can use a tool like Postman or 
cURL. Here's an example cURL command to simulate the sendTransaction API call:

curl -X POST \
  http://your-api-url/wallet/send-bitcoin \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_AUTH_TOKEN' \
  -d '{
    "toAddress": "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    "amount": 17.25
}'

Replace http://your-api-url with your actual API URL and YOUR_AUTH_TOKEN with a valid authentication token.
Remember to thoroughly test the NFC functionality in various scenarios, including:

Different cryptocurrencies (Bitcoin, Lightning, Litecoin)

Various amount values

Error cases (e.g., insufficient balance, network errors)

Cancelling the NFC operation mid-way

### Other Notes

#### How to Run

- npm run start
- npm run web
- run Expo app. use Medium Phone emulator and boot.

- npm run android
- npm run ios # you need to use macOS to build the iOS project - use the Expo app if you need to do iOS development without a Mac

#### Additional Commands

`eas login` - will prompt for username and password 

`eas whoami` - will return your username

How to Update Expo `npm install expo@latest`

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

 {
    "message": "bitcoin wallet created successfully",
    "wallet": {
        "type": "bitcoin",
        "address": "tb1qjtkk5rrzpyl7p9qlzqazh5zmlwwynzq0l0yv49",
        "publicKey": "02b65d8c1ee46ba4f21100fc058d2f708eb6122cf921de682208f73e395a49615d",
        "privateKey": "819bf7b908ccf2e5258a4e182de03930e598a851c02f54066244a555810fae59",
        "mnemonic": "say control pioneer dawn wire ketchup street broom answer segment ice fault",
        "isActive": true
    }
}


---

curl -X POST http://localhost:5000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{"username":"test2424","email":"test2424@test.com","password":"123"}'

curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username":"test2424","password":"123"}'

curl -X GET http://localhost:5000/api/wallet/info \
-H "Authorization: Bearer YOUR_TOKEN_HERE"

c0ae9a74e76ee990a517a4ac7795b202ac857ede8a87cd891cf390c6efc4e27c

---

---

8.28
{
    "message": "User created successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmNmYTA3YzI0M2QzNTk5ZWUyOTk5YjEiLCJpYXQiOjE3MjQ4ODMwNjgsImV4cCI6MTcyNTQ4Nzg2OH0.37fUa102uYAzc7v5Bhw71HSTyZ2EZKYkBdPtgYCaI8U",
    "user": {
        "wallets": [
            {
                "type": "bitcoin",
                "address": "tb1qqlxnfcunuvz8khngz96v94xkng2rlxymr4g99h",
                "balance": 0
            }
        ]
    }
}

 testgaff | gaFFNEY311@outlook.com | 123

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

### Lightning 

#### Testnet

LN Testnet Faucets:
1. HTLC.me Testnet Faucet: https://htlc.me/
2. Lightning Polar Testnet Faucet: https://faucet.lightning.community/
3. Bitcoin Testnet Faucet (for on-chain funds): https://testnet-faucet.mempool.co/

Free Public Testnet LN node:

1. ACINQ's testnet node:
   02df5ffe895c778e10f7742a6c5b8a0cefbe9465df58b92fadeb883752c8107c8f@3.33.236.230:9735

2. Blockstream's testnet node:
   0270685ca81a8e4d4d01beec5781f4cc924684072ae52c507f8ebe9daf0caaab7b@159.203.125.125:9735

3. LND testnet node:
   03ce09c8922b1aca0a43c869af2db821a9e12a3ca2c9eebc76e4d1e5e4c4c3d840@34.250.234.192:9735

4. c-lightning testnet node:
   0225ff2ae6a3d9722b625072503c2f64f6eddb78d739379d2ee55a16b3b0ed0a17@52.50.244.44:9735