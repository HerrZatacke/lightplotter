RoboClaw roboclaw = RoboClaw(&Serial, 10000);

void roboclaw_setup() {
  // Initialize roboclaw
  roboclaw.begin(38400);
}

void roboclaw_loop() {
  if (shapeIndex < SHAPE_SIZE) {

    uint32_t nextCoordinatesL = shape[shapeIndex][0];
    uint32_t nextCoordinatesR = shape[shapeIndex][1];

    uint32_t currentPosL;
    uint32_t currentPosR;

    roboclaw.ReadEncoders(ROBOCLAW_ADDRESS, currentPosL, currentPosR);

    if (
      (abs(nextCoordinatesL - currentPosL) < POS_THRESHOLD) &&
      (abs(nextCoordinatesR - currentPosR) < POS_THRESHOLD)
    ) {
      shapeIndex += 1;
      roboclaw.SpeedAccelDeccelPositionM1(ROBOCLAW_ADDRESS, ACCEL, SPEED, DECEL, shape[shapeIndex][0], 1);
      roboclaw.SpeedAccelDeccelPositionM2(ROBOCLAW_ADDRESS, ACCEL, SPEED, DECEL, shape[shapeIndex][1], 1);
      setPixels(shape[shapeIndex][2]);
    }

  } else if (shapeIndex == SHAPE_SIZE) {
    shapeIndex += 1;
    setPixels(0);

    roboclaw.SpeedAccelDeccelPositionM1(ROBOCLAW_ADDRESS, ACCEL, HOME_SPEED, DECEL, 0, 1);
    roboclaw.SpeedAccelDeccelPositionM2(ROBOCLAW_ADDRESS, ACCEL, HOME_SPEED, DECEL, 0, 1);
  }
}

void getBuffers(uint8_t *buffers) {
  uint8_t depth1 = 0;
  uint8_t depth2 = 0;
  buffers[2] = 0;
  bool ok = roboclaw.ReadBuffers(ROBOCLAW_ADDRESS, depth1, depth2);
  buffers[0] = depth1;
  buffers[1] = depth2;
  if (ok) {
    buffers[2] = 1;
  }
}

String roboclawInfo() {

  StaticJsonDocument<1023> info;

  info["encoder_1"] = (long)roboclaw.ReadEncM1(ROBOCLAW_ADDRESS);
  info["encoder_2"] = (long)roboclaw.ReadEncM2(ROBOCLAW_ADDRESS);
  info["speed_1"] = (long)roboclaw.ReadSpeedM1(ROBOCLAW_ADDRESS);
  info["speed_2"] = (long)roboclaw.ReadSpeedM2(ROBOCLAW_ADDRESS);

  uint8_t buffers[] = {0, 0, 0};
  getBuffers(buffers);
  info["buffer_1"] = buffers[0];
  info["buffer_2"] = buffers[1];
  info["buffer_ok"] = buffers[2] != 0;

  info["voltage"] = (float)roboclaw.ReadMainBatteryVoltage(ROBOCLAW_ADDRESS)/10;

  info["shapeIndex"] = shapeIndex;
  info["circle"] = circle;

  String output;
  serializeJson(info, output);
  info.clear();
  return output;
}

String roboclawCommand(String body) {
  StaticJsonDocument<1023> commandRequest;
  DeserializationError error = deserializeJson(commandRequest, body);

  if (error) {
    return JsonErrorResponse("cannot parse request body");
  }

  if (commandRequest.containsKey("command")) {
    String command = String(commandRequest["command"].as<String>());


    if (command == "motor1_reel_in") {
      roboclaw.ForwardM1(ROBOCLAW_ADDRESS, REEL_SPEED);
    } else if (command == "motor1_unreel") {
      roboclaw.BackwardM1(ROBOCLAW_ADDRESS, REEL_SPEED);
    } else if (command == "motor2_reel_in") {
      roboclaw.ForwardM2(ROBOCLAW_ADDRESS, REEL_SPEED);
    } else if (command == "motor2_unreel") {
      roboclaw.BackwardM2(ROBOCLAW_ADDRESS, REEL_SPEED);
    } else if (command == "motors_stop") {
      shapeIndex = 1 + SHAPE_SIZE;
      roboclaw.ForwardM1(ROBOCLAW_ADDRESS, 0); roboclaw.ForwardM2(ROBOCLAW_ADDRESS, 0);
    } else if (command == "reset_enc") {
      shapeIndex = 1 + SHAPE_SIZE;
      roboclaw.ResetEncoders(ROBOCLAW_ADDRESS);
    } else if (command == "home_custom") { // Move to 1000:1000 instantly
      shapeIndex = 1 + SHAPE_SIZE;
      roboclaw.SpeedAccelDeccelPositionM1(ROBOCLAW_ADDRESS, ACCEL, HOME_SPEED, DECEL, 1800, 1);
      roboclaw.SpeedAccelDeccelPositionM2(ROBOCLAW_ADDRESS, ACCEL, HOME_SPEED, DECEL, 4550, 1);
    } else if (command == "home_00") { // Move home instantly
      shapeIndex = 1 + SHAPE_SIZE;
      roboclaw.SpeedAccelDeccelPositionM1(ROBOCLAW_ADDRESS, ACCEL, HOME_SPEED, DECEL, 0, 1);
      roboclaw.SpeedAccelDeccelPositionM2(ROBOCLAW_ADDRESS, ACCEL, HOME_SPEED, DECEL, 0, 1);
    } else if (command == "shape") {
      shapeIndex = 0;
      setPixels(0);
      // initiate moving to first position
      roboclaw.SpeedAccelDeccelPositionM1(ROBOCLAW_ADDRESS, ACCEL, SPEED, DECEL, shape[shapeIndex][0], 1);
      roboclaw.SpeedAccelDeccelPositionM2(ROBOCLAW_ADDRESS, ACCEL, SPEED, DECEL, shape[shapeIndex][1], 1);
    } else if (command == "led_on") {
      setPixels(pixels.Color(0, BRIGHT, 0));
    } else if (command == "led_off") {
      setPixels(0);
    } else if (command == "circle_0") {
      circle = 0;
      setPixels(0);
    } else if (command == "circle_1") {
      circle = 1;
      setPixels(0);
    } else if (command == "circle_2") {
      circle = 2;
      setPixels(0);
    } else if (command == "hold") {
      shapeIndex = 1 + SHAPE_SIZE;
      uint32_t currentPosL;
      uint32_t currentPosR;
      roboclaw.ReadEncoders(ROBOCLAW_ADDRESS, currentPosL, currentPosR);

      // Move to current pos and hold instantly
      roboclaw.SpeedAccelDeccelPositionM1(ROBOCLAW_ADDRESS, 0, HOME_SPEED, 0, currentPosL, 1);
      roboclaw.SpeedAccelDeccelPositionM2(ROBOCLAW_ADDRESS, 0, HOME_SPEED, 0, currentPosR, 1);
    }
  }

  commandRequest.clear();
  return roboclawInfo();
}
