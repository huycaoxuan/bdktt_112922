radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 10) {
        pins.digitalWritePin(DigitalPin.P12, 1)
    } else if (receivedNumber == 11) {
        pins.digitalWritePin(DigitalPin.P12, 0)
    }
})
function warning () {
    pins.digitalWritePin(DigitalPin.P8, 1)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P8, 0)
    basic.pause(100)
}
function UpData () {
    ESP8266ThingSpeak.connectThingSpeak(
    "api.thingspeak.com",
    "IBUNGIC5TDVJ75DV",
    pins.analogReadPin(AnalogPin.P0),
    pins.analogReadPin(AnalogPin.P1),
    pins.analogReadPin(AnalogPin.P2),
    0,
    0,
    0,
    0,
    0
    )
}
radio.setGroup(1)
let so = 101
let trialNum = 4
// SSID: Tenda_02C492
// PW: 12765597
while (trialNum > 0 && !(ESP8266ThingSpeak.isWifiConnected())) {
    basic.showNumber(trialNum)
    ESP8266ThingSpeak.connectWifi(
    SerialPin.P15,
    SerialPin.P14,
    BaudRate.BaudRate115200,
    "Tenda_02C492",
    "12765597"
    )
    trialNum += -1
    basic.pause(2000)
}
if (ESP8266ThingSpeak.isWifiConnected()) {
    for (let index = 0; index < 4; index++) {
        basic.showIcon(IconNames.Heart)
        basic.pause(100)
        basic.showIcon(IconNames.SmallHeart)
        basic.pause(100)
    }
} else {
    basic.showString("Wifi fail!")
}
let countNumber = 0
let delayTime = 2 * 1000 / 10
basic.forever(function () {
    // Chu y: Thay doi thong so nguong cua cam biem
    if (pins.analogReadPin(AnalogPin.P0) <= 100) {
        if (so == 100) {
            radio.sendNumber(1)
        }
        UpData()
        basic.showNumber(1)
        warning()
    } else if (pins.analogReadPin(AnalogPin.P1) <= 100) {
        if (so == 100) {
            radio.sendNumber(2)
        }
        UpData()
        basic.showNumber(2)
        warning()
    } else if (pins.analogReadPin(AnalogPin.P2) <= 100) {
        if (so == 100) {
            radio.sendNumber(3)
        }
        UpData()
        basic.showNumber(3)
        warning()
    } else {
        if (countNumber == delayTime) {
            UpData()
            basic.pause(10)
            countNumber = 0
        } else if (countNumber < delayTime) {
            countNumber += 1
            basic.pause(10)
        }
        basic.showIcon(IconNames.Yes)
    }
})
basic.forever(function () {
    if (pins.digitalReadPin(DigitalPin.P13) == 0) {
        if (so > 100) {
            so = 100
            radio.sendNumber(so)
            basic.showString("A")
            basic.pause(500)
        } else {
            so = 101
            radio.sendNumber(so)
            basic.showString("M")
            basic.pause(500)
        }
    }
})
