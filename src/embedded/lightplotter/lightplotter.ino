#include <Adafruit_NeoPixel.h> // remove this line to work without neopixels
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

String html1 = "<!DOCTYPE html><html lang=\"en\"><head><title>Control RoboClaw</title><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=yes'></head><body>";
String html2 = "<button onMouseDown=\"call('/motor1_reel_in')\" onMouseUp=\"call('/motors_stop')\">Reel in Motor 1</button><br>";
String html3 = "<button onMouseDown=\"call('/motor1_unreel')\" onMouseUp=\"call('/motors_stop')\">Unreel Motor 1</button><br>";
String html4 = "<button onMouseDown=\"call('/motor2_reel_in')\" onMouseUp=\"call('/motors_stop')\">Reel in Motor 2</button><br>";
String html5 = "<button onMouseDown=\"call('/motor2_unreel')\" onMouseUp=\"call('/motors_stop')\">Unreel Motor 2</button><br>";
String html6 = "<button onMouseDown=\"call('/motors_stop')\">Motors off</button><br>";
#ifdef ADAFRUIT_NEOPIXEL_H
String html7 = "<button onMouseDown=\"call('/led_on')\">LED blink on</button> <code>setColors(BRIGHT)</code><br>";
String html8 = "<button onMouseDown=\"call('/led_off')\">LED off</button> <code>setColors(0)</code><br>";
#else
String html7 = "<button onMouseDown=\"call('/led_on')\">LED on</button> <code>digitalWrite(LED, LOW)</code><br>";
String html8 = "<button onMouseDown=\"call('/led_off')\">LED off</button> <code>digitalWrite(LED, HIGH)</code><br>";
#endif
String html9 = "<button onMouseDown=\"call('/test_1')\">test 2000 2000</button> <code>roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 2000, 0); roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 2000, 0);</code><br>";
String html10 = "<button onMouseDown=\"call('/test_2')\">test 2000 4000</button> <code>roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 2000, 0); roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 4000, 0);</code><br>";
String html11 = "<button onMouseDown=\"call('/test_3')\">test 4000 4000</button> <code>roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 4000, 0); roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 4000, 0);</code><br>";
String html12 = "<button onMouseDown=\"call('/test_4')\">test 4000 2000</button> <code>roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 4000, 0); roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 2000, 0);</code><br>";
// String html13 = "<button onMouseDown=\"fetch('/shape').then(updateInfo);\">shape</button><br>";
// String html14 = "<button onMouseDown=\"fetch('/flush').then(updateInfo);\">What does flush do?</button><br>";
String html15 = "<button onMouseDown=\"fetch('/reset_enc').then(updateInfo);\">Reset Encoders</button><br>";
String html88 = "<pre id='status'>wait</pre><script>const stat = document.querySelector('#status'); const noConn = (err) => {stat.innerText = err.toString()}; const updateInfo = (res) => res.json().then((info) => { stat.style.background='#eee'; stat.innerText = JSON.stringify(info, null, 2); }); const call = (url) => {stat.style.background='#ccc'; const controller = new AbortController(); const to = setTimeout(() => controller.abort(), 900); fetch(url, { signal: controller.signal }).then(updateInfo).then(() => {clearTimeout(to)}).catch(noConn);}; setInterval(() => {call('/info')}, 1000);</script>";
String html99 = "</body></html>";
String request = "";

#ifdef ADAFRUIT_NEOPIXEL_H
#define PIN 5
#define NUMPIXELS 1
#define DELAYVAL 100
#define BRIGHT 63
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_RGB + NEO_KHZ800);
unsigned long blink_nextMillis = 0;
byte cIndex = 0;
byte bright = BRIGHT;
int colors[12];
#else
#define LED 2
#endif

void setup() {
  WiFi.mode(WIFI_STA);
  wifiMulti.addAP(ap_name, pw);

  while (wifiMulti.run() != WL_CONNECTED) {
    delay(250);
  }
  server.begin();
  roboclaw.begin(38400);

#ifdef ADAFRUIT_NEOPIXEL_H
  blink_nextMillis = millis() + DELAYVAL;
  setColors(BRIGHT);
  pixels.begin();
#else
  pinMode(LED, OUTPUT);
  digitalWrite(LED, HIGH);
#endif
}

#ifdef ADAFRUIT_NEOPIXEL_H
void setColors(byte b) {
  colors[0] = pixels.Color(b, 0, 0);
  colors[1] = pixels.Color(0, 0, 0);
  colors[2] = pixels.Color(b, b, 0);
  colors[3] = pixels.Color(0, 0, 0);
  colors[4] = pixels.Color(0, b, 0);
  colors[5] = pixels.Color(0, 0, 0);
  colors[6] = pixels.Color(0, b, b);
  colors[7] = pixels.Color(0, 0, 0);
  colors[8] = pixels.Color(0, 0, b);
  colors[9] = pixels.Color(0, 0, 0);
  colors[10] = pixels.Color(b, 0, b);
  colors[11] = pixels.Color(0, 0, 0);
}
#endif

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

#ifdef ADAFRUIT_NEOPIXEL_H
  client.print(",\"led\":");
  client.print(colors[0] == 0 ? "false" : "true");
#endif
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

#ifdef ADAFRUIT_NEOPIXEL_H
  unsigned long currentMillis = millis();
  if (currentMillis >= blink_nextMillis) {
    blink_nextMillis = currentMillis + DELAYVAL;
    cIndex = (cIndex + 1) % 12;
    pixels.setPixelColor(0, colors[cIndex]);
    pixels.show();
  }
#endif

  WiFiClient client = server.available();

  if(client) {
    client.flush();

    request = client.readStringUntil('\r');
    if (request.indexOf("info") > 0){ sendInfo(client); return; }
    //if (request.indexOf("flush") > 0){ roboclaw.flush(); sendInfo(client); return; }

    else if (request.indexOf("test_1") > 0){
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 2000, 0);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 2000, 0);
      sendInfo(client); return;
    }

    else if (request.indexOf("test_2") > 0){
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 2000, 0);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 4000, 0);
      sendInfo(client); return;
    }

    else if (request.indexOf("test_3") > 0){
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 4000, 0);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 4000, 0);
      sendInfo(client); return;
    }

    else if (request.indexOf("test_4") > 0){
      roboclaw.SpeedAccelDeccelPositionM1(0x80, ACCEL, SPEED, DECEL, 4000, 0);
      roboclaw.SpeedAccelDeccelPositionM2(0x80, ACCEL, SPEED, DECEL, 2000, 0);
      sendInfo(client); return;
    }

    // else if (request.indexOf("shape") > 0) { sendInfo(client); return; }

#define REEL_SPEED 15

    else if (request.indexOf("motor1_reel_in") > 0){ roboclaw.ForwardM1(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motor1_unreel") > 0){ roboclaw.BackwardM1(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motor2_reel_in") > 0){ roboclaw.ForwardM2(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motor2_unreel") > 0){ roboclaw.BackwardM2(0x80, REEL_SPEED); sendInfo(client); return; }
    else if (request.indexOf("motors_stop") > 0){ roboclaw.ForwardM1(0x80, 0); roboclaw.ForwardM2(0x80, 0); sendInfo(client); return; }
    else if (request.indexOf("reset_enc") > 0){ roboclaw.ResetEncoders(0x80); sendInfo(client); return; }

#ifdef ADAFRUIT_NEOPIXEL_H
    else if (request.indexOf("led_on") > 0){ setColors(BRIGHT); sendInfo(client); return; }
    else if (request.indexOf("led_off") > 0){ setColors(0); sendInfo(client); return; }
#else
    else if (request.indexOf("led_on") > 0){ digitalWrite(LED, LOW); sendInfo(client); return; }
    else if (request.indexOf("led_off") > 0){ digitalWrite(LED, HIGH); sendInfo(client); return;}
#endif

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
    // client.println(html13);
    // client.println(html14);
    client.println(html15);

    client.println(html88);
    client.println(html99);
  }
}
