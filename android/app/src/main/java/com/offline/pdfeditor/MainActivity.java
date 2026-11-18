package com.offline.pdfeditor;
import android.content.ContentValues;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
public class MainActivity extends BridgeActivity {
  @Override public void onCreate(Bundle s) {
    super.onCreate(s);
    bridge.getWebView().addJavascriptInterface(new BlobDownloader(), "AndroidBlobDownloader");
    bridge.getWebView().setDownloadListener((url, ua, cd, mt, cl) -> {
      if (url.startsWith("blob:")) {
        bridge.getWebView().evaluateJavascript("javascript:(function(){fetch('"+url+"').then(r=>r.blob()).then(b=>{var r=new FileReader();r.onloadend=function(){AndroidBlobDownloader.saveBase64(r.result,window.__lastPdfName||'Edited.pdf');};r.readAsDataURL(b);});})()", null);
      }
    });
  }
  class BlobDownloader {
    @JavascriptInterface public void saveBase64(String b64, String fn) {
      try {
        byte[] d = Base64.decode(b64.substring(b64.indexOf(",") + 1), Base64.DEFAULT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          ContentValues v = new ContentValues();
          v.put(MediaStore.Downloads.DISPLAY_NAME, fn);
          v.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
          v.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
          Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
          if (u != null) try (OutputStream o = getContentResolver().openOutputStream(u)) { o.write(d); }
        } else {
          File f = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), fn);
          try (FileOutputStream o = new FileOutputStream(f)) { o.write(d); }
        }
        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Saved: " + fn, Toast.LENGTH_LONG).show());
      } catch (Exception e) {
        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Err: " + e.getMessage(), Toast.LENGTH_LONG).show());
      }
    }
  }
}
