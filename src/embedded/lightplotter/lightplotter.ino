#include <Adafruit_NeoPixel.h> // remove this line to work without neopixels
#include <ESP8266WiFiMulti.h>
#include <ESP8266WiFi.h>
#include "RoboClaw.h"
#include "credentials.h"
#include "shape.h"

ESP8266WiFiMulti wifiMulti;

RoboClaw roboclaw = RoboClaw(&Serial, 10000);

#define REEL_SPEED 25
#define HOME_SPEED 1200
#define ACCEL 1000
#define SPEED 12000
#define DECEL 1000

#define POS_THRESHOLD 120

const char pw[] = WIFI_CREDENTIALS_PASS;
const char ap_name[] = WIFI_CREDENTIALS_AP;

WiFiServer server(80);

String html1 = "<!DOCTYPE html><html lang=\"en\"><head><title>Control RoboClaw</title><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=yes'></head><body>";
String html2 = "<style>pre {padding: 6px;} body {background: black; color:#fff; width: 200px; padding-left: calc(100vw - 220px);} button { width: 100%; margin-bottom: 10px; padding: 10px; background: #204; color:#fff; border: 2px solid currentColor; border-radius: 5px;} button:hover {background: #406;}</style>";
String html3 = "<button onMouseDown=\"call('/motor1_reel_in')\" onMouseUp=\"call('/motors_stop')\">Reel in Motor 1</button><br>";
String html4 = "<button onMouseDown=\"call('/motor1_unreel')\" onMouseUp=\"call('/motors_stop')\">Unreel Motor 1</button><br>";
String html5 = "<button onMouseDown=\"call('/motor2_reel_in')\" onMouseUp=\"call('/motors_stop')\">Reel in Motor 2</button><br>";
String html6 = "<button onMouseDown=\"call('/motor2_unreel')\" onMouseUp=\"call('/motors_stop')\">Unreel Motor 2</button><br>";
String html7 = "<button onMouseDown=\"call('/motors_stop')\">Motors off</button><br>";
String html8 = "<button onMouseDown=\"call('/led_on')\">LEDs green</button><br>";
String html9 = "<button onMouseDown=\"call('/led_off')\">LEDs off</button><br>";
String html10 = "<button onMouseDown=\"call('/circle_0')\">Circle 0</button><br>";
String html11 = "<button onMouseDown=\"call('/circle_1')\">Circle 1</button><br>";
String html12 = "<button onMouseDown=\"call('/circle_2')\">Circle 2</button><br>";
String html13 = "<button onMouseDown=\"call('/home_custom')\">Move 1800:4550</button><br>";
String html14 = "<button onMouseDown=\"call('/home_00')\">Home 0:0</button><br>";
String html15 = "<button onMouseDown=\"fetch('/reset_enc').then(updateInfo);\">Reset Encoders</button><br>";
String html16 = "<button onMouseDown=\"fetch('/hold').then(updateInfo);\">Hold Current position</button><br>";
String html17 = "<button onMouseDown=\"fetch('/shape').then(updateInfo);\">Internal Shape</button><br>";
String html88 = "<pre id='status'>wait</pre><script>const stat = document.querySelector('#status'); const noConn = (err) => {stat.innerText = err.toString()}; const updateInfo = (res) => res.json().then((info) => { stat.style.background='#111'; stat.innerText = JSON.stringify(info, null, 2); }); const call = (url) => {stat.style.background='#444'; const controller = new AbortController(); const to = setTimeout(() => controller.abort(), 900); fetch(url, { signal: controller.signal }).then(updateInfo).then(() => {clearTimeout(to)}).catch(noConn);}; setInterval(() => {call('/info')}, 1000);</script>";
String html99 = "</body></html>";
String request = "";

#define PIN 2
#define NUMPIXELS 11
#define DELAYVAL 100
#define BRIGHT 191
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_RGB + NEO_KHZ800);
unsigned long blink_nextMillis = 0;
byte bright = BRIGHT;
byte circle = 0;

void setup() {
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(ap_name, pw);

  while (wifiMulti.run() != WL_CONNECTED) {
    delay(250);
  }
  server.begin();
  roboclaw.begin(38400);

  blink_nextMillis = millis() + DELAYVAL;
  pixels.begin();
  setPixels(pixels.Color(0, 0, BRIGHT));

}

void setPixels(uint32_t color) {

  // Unused pixel for signal propagation in long wire :)
  pixels.setPixelColor(0, 0);

  for (byte i = 0; i < NUMPIXELS; i++) {
    if (
      (circle == 0 && i > 0) ||
      (circle > 0 && i == 0) ||
      (circle == 1 && i > 3)
    ) {
      pixels.setPixelColor(i + 1, 0);
    } else {
      pixels.setPixelColor(i + 1, color);
    }
  }
  pixels.show();
}

void sendInfo(WiFiClient client) {

  client.print("{\"encoder_1\":");
  client.print((long)roboclaw.ReadEncM1(0x80));
  client.print(",\"encoder_2\":");
  client.print((long)roboclaw.ReadEncM2(0x80));

  client.print(",\"speed_1\":");
  client.print((long)roboclaw.ReadSpeedM1(0x80));
  client.print(",\"speed_2\":");
  client.print((long)roboclaw.ReadSpeedM2(0x80));


  uint8_t buffers[] = {0, 0, 0};
  getBuffers(buffers);

  client.print(",\"buffer_1\":");
  client.print(buffers[0]);
  client.print(",\"buffer_2\":");
  client.print(buffers[1]);
  client.print(",\"buffer_ok\":");
  client.print(buffers[2] == 0 ? "false" : "true");

  client.print(",\"voltage\":");
  client.print((float)roboclaw.ReadMainBatteryVoltage(0x80)/10);

  client.print(",\"shapeIndex\":");
  client.print(shapeIndex);

  client.print(",\"circle\":");
  client.print(circle);

  client.print("}");
}

void getBuffers(uint8_t *buffers) {
  uint8_t depth1 = 0;
  uint8_t depth2 = 0;
  buffers[2] = 0;
  bool ok = roboclaw.ReadBuffers(0x80, depth1, depth2);
  buffers[0] = depth1;
  buffers[1] = depth2;
  if (ok) {
    buffers[2] = 1;
  }
}

void loop() {

  // need to keep moving
  if (shapeIndex < SHAPE_SIZE) {

    uint32_t nextCoordinatesL = shape[shapeIndex][0];
    uint32_t nextCoordinatesR = shape[shapeIndex][1];

    uint32_t currentPosL;
    uint32_t currentPosR;

    roboclaw.ReadEncoders(0x80, currentPosL, currentPosR);

    if (
      (abs(nextCoordinatesL - currentPosL) < POS_THRESHOLD) &&
      (abs(nextCoordinatesR - currentPosR) < POS_THRESHOLD)
    ) {
      shapeIndex += 1;
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, shape[shapeIndex][0], 1);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, shape[shapeIndex][1], 1);
      setPixels(shape[shapeIndex][2]);
    }

  } else if (shapeIndex == SHAPE_SIZE) {
    shapeIndex += 1;
    setPixels(0);

    roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, HOME_SPEED, DECEL, 0, 1);
    roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, HOME_SPEED, DECEL, 0, 1);
  }

//  unsigned long currentMillis = millis();
//  if (currentMillis >= blink_nextMillis) {
//    blink_nextMillis = currentMillis + DELAYVAL;
//  }

  WiFiClient client = server.available();

  if(client) {
    client.flush();

    request = client.readStringUntil('\r');
    if (request.indexOf("info") > 0){ sendInfo(client); return; }
    //if (request.indexOf("flush") > 0){ roboclaw.flush(); sendInfo(client); return; }

    else if (request.indexOf("home_custom") > 0){
      // Move to 1000:1000 instantly
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, HOME_SPEED, DECEL, 1800, 1);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, HOME_SPEED, DECEL, 4550, 1);
      sendInfo(client); return;
    }

    else if (request.indexOf("home_00") > 0){
      // Move home instantly
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, HOME_SPEED, DECEL, 0, 1);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, HOME_SPEED, DECEL, 0, 1);
      sendInfo(client); return;
    }

    else if (request.indexOf("shape") > 0) {
      shapeIndex = 0;
      setPixels(0);

      // initiate moving to first position
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, shape[shapeIndex][0], 1);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, shape[shapeIndex][1], 1);

      sendInfo(client);
      return;
    }

    else if (request.indexOf("motor1_reel_in") > 0){ roboclaw.ForwardM1(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motor1_unreel") > 0){ roboclaw.BackwardM1(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motor2_reel_in") > 0){ roboclaw.ForwardM2(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motor2_unreel") > 0){ roboclaw.BackwardM2(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motors_stop") > 0){ roboclaw.ForwardM1(0x80, 0); roboclaw.ForwardM2(0x80, 0); sendInfo(client); return; }
    else if (request.indexOf("reset_enc") > 0){ roboclaw.ResetEncoders(0x80); sendInfo(client); return; }
    else if (request.indexOf("hold") > 0) {

      uint32_t currentPosL;
      uint32_t currentPosR;
      roboclaw.ReadEncoders(0x80, currentPosL, currentPosR);

      // Move to current pos and hold instantly
      roboclaw.SpeedAccelDeccelPositionM1(0x80, 0, HOME_SPEED, 0, currentPosL, 1);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, 0, HOME_SPEED, 0, currentPosR, 1);

      sendInfo(client);
      return;
    }



    else if (request.indexOf("led_on") > 0){
      setPixels(pixels.Color(0, BRIGHT, 0));
      sendInfo(client);
      return;
    }
    else if (request.indexOf("led_off") > 0){
      setPixels(0);
      sendInfo(client);
      return;
    }
    else if (request.indexOf("circle_0") > 0){
      circle = 0;
      setPixels(0);
      sendInfo(client);
      return;
    }
    else if (request.indexOf("circle_1") > 0){
      circle = 1;
      setPixels(0);
      sendInfo(client);
      return;
    }
    else if (request.indexOf("circle_2") > 0){
      circle = 2;
      setPixels(0);
      sendInfo(client);
      return;
    }

    client.println(html1);
    client.println(html2);
    client.println(html3);
    client.println(html4);
    client.println(html5);
    client.println(html6);
    client.println(html7);
    client.println(html8);
    client.println(html9);
    client.println(html10);
    client.println(html11);
    client.println(html12);
    client.println(html13);
    client.println(html14);
    client.println(html15);
    client.println(html16);
    client.println(html17);

    client.println(html88);
    client.println(html99);
  }
}
