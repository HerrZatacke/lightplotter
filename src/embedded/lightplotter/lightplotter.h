#include "config.h"
#include "RoboClaw.h"
#include "shape.h"
#include <FS.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <uri/UriBraces.h>

// WiFi defaults
#ifndef DEFAULT_AP_SSID
#define DEFAULT_AP_SSID "lightplotter"
#endif
#ifndef DEFAULT_AP_PSK
#define DEFAULT_AP_PSK "lightplotter"
#endif
#ifndef DEFAULT_MDNS_NAME
#define DEFAULT_MDNS_NAME "lightplotter"
#endif
#ifndef WIFI_CONNECT_TIMEOUT
#define WIFI_CONNECT_TIMEOUT 10000

// LED Defaults
#endif
#ifndef LED_PIN
#define LED_PIN 2
#endif
#ifndef NUMPIXELS
#define NUMPIXELS 11
#endif
#ifndef DELAYVAL
#define DELAYVAL 100
#endif
#ifndef BRIGHT
#define BRIGHT 191
#endif

// Filesystem
#ifdef FSTYPE_LITTLEFS
#include <LittleFS.h>
#define FS LittleFS
#else
#define FS SPIFFS
#endif

// RoboClaw
#define ROBOCLAW_ADDRESS 0x80
