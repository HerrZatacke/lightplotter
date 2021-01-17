
void fs_setup() {
  FS.begin();

  // clean a little harder
  Serial.println("Cleaning FS");
  for (int i = 0; i < 100; i++) {
    if (i % 10 == 0) {
      Serial.print(".");
    }
    FS.gc();
  }
  Serial.println(" done");
}

void fs_info() {
  FSInfo fs_info;
  FS.info(fs_info);
  Serial.print("FILESYSTEM total: ");
  Serial.print(fs_info.totalBytes);
  Serial.print(" | used: ");
  Serial.println(fs_info.usedBytes);
}
