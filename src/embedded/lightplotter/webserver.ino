
ESP8266WebServer server(80);

void getEnv() {
  const size_t capacity = 0x1fff;
  DynamicJsonDocument doc(capacity);

  doc["version"] = VERSION;

  #ifdef ESP8266
  doc["env"] = "esp8266";
  #else
  doc["env"] = "unknown";
  #endif

  #ifdef FSTYPE_LITTLEFS
  doc["fstype"] = "littlefs";
  #else
  doc["fstype"] = "spiffs";
  #endif

  String out;
  serializeJson(doc, out);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", out);
}

void getConfig() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", wifiGetConfig());
}


void setConfig() {
  server.sendHeader("Access-Control-Allow-Origin", "*");

  // Check if body received
  if (server.hasArg("plain") == false) {
    server.send(200, "application/json", JsonErrorResponse("empty request"));
    return;
  }

  server.send(200, "application/json", wifiSetConfig(server.arg("plain")));
}

void sendRoboclawCommand() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", roboclawCommand(server.arg("plain")));
}

bool handleFileRead(String path) {
  path = "/w" + path;

  if (path.endsWith("/")) {
    path += "index.html";
  }

  String pathWithGz = path + ".gz";
  if(FS.exists(pathWithGz) || FS.exists(path)) {
    String contentType = getContentType(path);

    if(FS.exists(pathWithGz)) {
      path += ".gz";
    }

    File file = FS.open(path, "r");
    server.sendHeader("Access-Control-Allow-Origin", "*");
    size_t sent = server.streamFile(file, contentType);
    file.close();
    return true;
  }

  Serial.print(path);
  Serial.println(" - Not Found");
  return false;
}

String getContentType(String filename) {
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".ico")) return "image/x-icon";
  return "text/plain";
}

void webserver_setup() {
  server.on("/wificonfig/get", getConfig);
  server.on("/wificonfig/set", setConfig);
  server.on("/env.json", getEnv);
  server.on("/command", sendRoboclawCommand);

  server.onNotFound([]() {
    if (!handleFileRead(server.uri())) {
      server.sendHeader("Access-Control-Allow-Origin", "*");
      server.send(404, "text/plain", "REKT");
    }
  });
  server.begin();
  Serial.println(F("Server started"));
}

void webserver_loop() {
  server.handleClient();
}
