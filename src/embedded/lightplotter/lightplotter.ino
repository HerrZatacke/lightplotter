#include <Adafruit_NeoPixel.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WiFi.h>
#include "RoboClaw.h"
#include "credentials.h"

ESP8266WiFiMulti wifiMulti;

RoboClaw roboclaw = RoboClaw(&Serial, 10000);

#define ACCEL 10000
#define SPEED 5000
#define DECEL 10000

const char pw[] = WIFI_CREDENTIALS_PASS;
const char ap_name[] = WIFI_CREDENTIALS_AP;

WiFiServer server(80);

String html1 = "<!DOCTYPE html><html><head><title>Control RoboClaw</title><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=yes'></head><body>";
String html2 = "<button onClick=\"call('/motor1_on')\">motor 1 on</button> <code>roboclaw.ForwardM1(0x80, 63)</code><br>";
String html3 = "<button onClick=\"call('/motor1_off')\">motor 1 off</button> <code>roboclaw.ForwardM1(0x80, 0)</code><br>";
String html4 = "<button onClick=\"call('/motor2_on')\">motor 2 on</button> <code>roboclaw.ForwardM2(0x80, 63)</code><br>";
String html5 = "<button onClick=\"call('/motor2_off')\">motor 2 off</button> <code>roboclaw.ForwardM2(0x80, 0)</code><br>";
String html6 = "<button onClick=\"call('/led_on')\">led on</button> <code>setColors(BRIGHT)</code><br>";
String html7 = "<button onClick=\"call('/led_off')\">led off</button> <code>setColors(0)</code><br>";
String html8 = "<button onClick=\"call('/test_1')\">test 2000 2000</button> <code>roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 2000, ACCEL, SPEED, DECEL, 2000, 1)</code><br>";
String html9 = "<button onClick=\"call('/test_2')\">test 2000 4000</button> <code>roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 2000, ACCEL, SPEED, DECEL, 4000, 1)</code><br>";
String html10 = "<button onClick=\"call('/test_3')\">test 4000 4000</button> <code>roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 4000, ACCEL, SPEED, DECEL, 4000, 1)</code><br>";
String html11 = "<button onClick=\"call('/test_4')\">test 4000 2000</button> <code>roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 4000, ACCEL, SPEED, DECEL, 2000, 1)</code><br>";
// String html12 = "<button onClick=\"fetch('/shape').then(updateInfo);\">shape</button><br>";
String html88 = "<pre id='status'></pre><script>const noConn = (err) => {document.querySelector('#status').innerText = err.toString()}; const updateInfo = (res) => res.json().then((info) => document.querySelector('#status').innerText = JSON.stringify(info, null, 2)); const call = (url) => {const controller = new AbortController(); const to = setTimeout(() => controller.abort(), 900); fetch(url, { signal: controller.signal }).then(updateInfo).then(() => {clearTimeout(to)}).catch(noConn);}; setInterval(() => {call('/info')}, 1000);</script>";
String html99 = "</body></html>";
String request = "";

#define PIN 5
#define NUMPIXELS 1
#define DELAYVAL 50
#define BRIGHT 63
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_RGB + NEO_KHZ800);

void setup() {
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(ap_name, pw);

  while (wifiMulti.run() != WL_CONNECTED) {
    delay(250);
  }
  server.begin();
  roboclaw.begin(38400);
  setColors(BRIGHT);
  pixels.begin();
}

byte bright = BRIGHT;
int colors[6];

void setColors(byte b) {
  colors[0] = pixels.Color(b, 0, 0);
  colors[1] = pixels.Color(b / 2, b / 2, 0);
  colors[2] = pixels.Color(0, b, 0);
  colors[3] = pixels.Color(0, b / 2, b / 2);
  colors[4] = pixels.Color(0, 0, b);
  colors[5] = pixels.Color(b / 2, 0, b / 2);
}

byte cIndex = 0;

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

  client.print(",\"led\":");
  client.print(colors[0] == 0 ? "false" : "true");
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

  cIndex = (cIndex + 1) % 6;

  pixels.setPixelColor(0, colors[cIndex]);
  pixels.show();
  delay(DELAYVAL);

  WiFiClient client = server.available();

  if(client) {
    client.flush();

    request = client.readStringUntil('\r');
    if (request.indexOf("info") > 0){ sendInfo(client); return; }

    else if (request.indexOf("test_1") > 0){
      roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 2000, ACCEL, SPEED, DECEL, 2000, 1);
      sendInfo(client); return;
    }

    else if (request.indexOf("test_2") > 0){
      roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 2000, ACCEL, SPEED, DECEL, 4000, 1);
      sendInfo(client); return;
    }

    else if (request.indexOf("test_3") > 0){
      roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 4000, ACCEL, SPEED, DECEL, 4000, 1);
      sendInfo(client); return;
    }

    else if (request.indexOf("test_4") > 0){
      roboclaw.SpeedAccelDeccelPositionM1M2(0x80, ACCEL, SPEED, DECEL, 4000, ACCEL, SPEED, DECEL, 2000, 1);
      sendInfo(client); return;
    }

    // else if (request.indexOf("shape") > 0) { sendInfo(client); return; }

    else if (request.indexOf("motor1_on") > 0){ roboclaw.ForwardM1(0x80, 63); sendInfo(client); return; }
    else if (request.indexOf("motor1_off") > 0){ roboclaw.ForwardM1(0x80, 0); sendInfo(client); return; }
    else if (request.indexOf("motor2_on") > 0){ roboclaw.ForwardM2(0x80, 63); sendInfo(client); return; }
    else if (request.indexOf("motor2_off") > 0){ roboclaw.ForwardM2(0x80, 0); sendInfo(client); return; }
    else if (request.indexOf("led_on") > 0){ setColors(BRIGHT); sendInfo(client); return; }
    else if (request.indexOf("led_off") > 0){ setColors(0); sendInfo(client); return; }

    client.print(html1);
    client.print(html2);
    client.print(html3);
    client.print(html4);
    client.print(html5);
    client.print(html6);
    client.print(html7);
    client.print(html8);
    client.print(html9);
    client.print(html10);
    client.print(html11);
    // client.print(html12);

    client.print(html88);
    client.print(html99);
  }
}
