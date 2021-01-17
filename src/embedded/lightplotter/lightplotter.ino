#include "lightplotter.h"
#define VERSION "0.0.1"

#define REEL_SPEED 25
#define HOME_SPEED 1200
#define ACCEL 1000
#define SPEED 12000
#define DECEL 1000

#define POS_THRESHOLD 120

// Variables used across multiple files, so they need to be defined here
String mdnsName = DEFAULT_MDNS_NAME;
String accesPointSSID = DEFAULT_AP_SSID;
String accesPointPassword = DEFAULT_AP_PSK;
bool hasNetworkSettings = false;
byte bright = BRIGHT;
byte circle = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n\n\n");

  fs_setup();

  neopixels_setup();

  WiFi.disconnect();
  delay(1000);

  fs_info();
  setupWifi();
  mdns_setup();
  webserver_setup();
  roboclaw_setup();
}


void loop() {
  webserver_loop();
  mdns_loop();
  roboclaw_loop();
}
