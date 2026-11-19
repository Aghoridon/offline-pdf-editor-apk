package com.apmbs.offlinepdfeditor;
import android.content.ClipData;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends BridgeActivity {
  @Override
  public void onStart() {
    super.onStart();
    if (this.bridge != null && this.bridge.getWebView() != null) {
      this.bridge.getWebView().addJavascriptInterface(new ApmbsBridge(), "AndroidBridge");
    }
  }
  public class ApmbsBridge {
    @JavascriptInterface
    public String saveFile(String b64, String fileName, String mime) {
      try {
        byte[] data = Base64.decode(b64, Base64.DEFAULT);
        String safeMime = (mime != null && !mime.isEmpty()) ? mime : "application/octet-stream";
        if (Build.VERSION.SDK_INT >= 29) {
          ContentValues cv = new ContentValues();
          cv.put(MediaStore.MediaColumns.DISPLAY_NAME, fileName);
          cv.put(MediaStore.MediaColumns.MIME_TYPE, safeMime);
          cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/APMBS_Notes");
          Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
          if (uri != null) {
            try (OutputStream os = getContentResolver().openOutputStream(uri)) { if (os != null) os.write(data); }
            return "Download/APMBS_Notes/" + fileName;
          }
        }
        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "APMBS_Notes");
        if (!dir.exists()) dir.mkdirs();
        File f = new File(dir, fileName);
        try (FileOutputStream fos = new FileOutputStream(f)) { fos.write(data); }
        return "Download/APMBS_Notes/" + fileName;
      } catch (Exception e) { return "Error: " + e.getMessage(); }
    }
    @JavascriptInterface
    public String shareFile(String b64, String fileName, String mime) {
      try {
        String saved = saveFile(b64, fileName, mime);
        byte[] data = Base64.decode(b64, Base64.DEFAULT);
        File cacheF = new File(getCacheDir(), fileName);
        try (FileOutputStream fos = new FileOutputStream(cacheF)) { fos.write(data); }
        final Uri uri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fileprovider", cacheF);
        final String safeMime = (mime != null && !mime.isEmpty()) ? mime : "*/*";
        runOnUiThread(() -> {
          Intent i = new Intent(Intent.ACTION_SEND);
          i.setType(safeMime);
          i.putExtra(Intent.EXTRA_STREAM, uri);
          i.setClipData(ClipData.newRawUri(fileName, uri));
          i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
          Intent ch = Intent.createChooser(i, "Share " + fileName);
          ch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
          startActivity(ch);
        });
        return "✅ सेव (" + saved + ") व शेयर खुला!";
      } catch (Exception e) { return "Share Error: " + e.getMessage(); }
    }
  }
}