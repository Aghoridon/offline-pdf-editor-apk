package com.apmbs.offlinepdfeditor;
import android.content.*; import android.net.Uri; import android.os.*; import android.provider.MediaStore;
import android.speech.tts.TextToSpeech; import android.util.Base64; import android.webkit.*; import android.widget.Toast;
import androidx.core.content.FileProvider; import com.getcapacitor.BridgeActivity;
import java.io.*; import java.util.Locale;

public class MainActivity extends BridgeActivity implements TextToSpeech.OnInitListener {
  private TextToSpeech tts; private boolean ttsReady = false;
  @Override protected void onCreate(Bundle b) {
    super.onCreate(b); tts = new TextToSpeech(this, this);
    WebView w = getBridge().getWebView();
    if (w != null) { w.addJavascriptInterface(new Bridge(), "AndroidBlobDownloader"); w.addJavascriptInterface(new Bridge(), "AndroidNativeBridge"); }
  }
  @Override public void onInit(int s) { if (s == TextToSpeech.SUCCESS) ttsReady = true; }
  @Override public void onDestroy() { if (tts != null) { tts.stop(); tts.shutdown(); } super.onDestroy(); }
  public class Bridge {
    @JavascriptInterface public void saveBase64File(String d, String n, String m) { saveBase64File(d, n, m, "APMBS_Offline_PDFs"); }
    @JavascriptInterface public void saveBase64File(String d, String n, String m, String sub) {
      try {
        byte[] bytes = Base64.decode(d, Base64.DEFAULT);
        if (Build.VERSION.SDK_INT >= 29) {
          ContentValues v = new ContentValues();
          v.put(MediaStore.Downloads.DISPLAY_NAME, n); v.put(MediaStore.Downloads.MIME_TYPE, m);
          v.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/" + sub);
          Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
          if (u != null) try (OutputStream o = getContentResolver().openOutputStream(u)) { if (o != null) o.write(bytes); }
        } else {
          File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), sub);
          if (!dir.exists()) dir.mkdirs();
          try (FileOutputStream f = new FileOutputStream(new File(dir, n))) { f.write(bytes); }
        }
        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Saved: Downloads/" + sub + "/" + n, Toast.LENGTH_SHORT).show());
      } catch (Exception e) { runOnUiThread(() -> Toast.makeText(MainActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_LONG).show()); }
    }
    @JavascriptInterface public void textToAudioFile(String txt, String lang, float rate, String n) {
      try {
        if (!ttsReady || tts == null) { runOnUiThread(() -> Toast.makeText(MainActivity.this, "TTS Not Ready", Toast.LENGTH_SHORT).show()); return; }
        tts.setLanguage(Locale.forLanguageTag(lang)); tts.setSpeechRate(rate);
        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "APMBS_Converted");
        if (!dir.exists()) dir.mkdirs();
        tts.synthesizeToFile(txt, new Bundle(), new File(dir, n), "tts_" + System.currentTimeMillis());
        runOnUiThread(() -> Toast.makeText(MainActivity.this, "Audio Saved: Downloads/APMBS_Converted/" + n, Toast.LENGTH_LONG).show());
      } catch (Exception e) { runOnUiThread(() -> Toast.makeText(MainActivity.this, "TTS Error: " + e.getMessage(), Toast.LENGTH_LONG).show()); }
    }
    @JavascriptInterface public void sendFeedbackWithScreenshot(String to, String sub, String body, String b64) {
      try {
        Intent i = new Intent(Intent.ACTION_SEND); i.setType("image/png");
        i.putExtra(Intent.EXTRA_EMAIL, new String[]{to}); i.putExtra(Intent.EXTRA_SUBJECT, sub); i.putExtra(Intent.EXTRA_TEXT, body);
        if (b64 != null && !b64.isEmpty()) {
          File cd = new File(getCacheDir(), "shared_screenshots"); if (!cd.exists()) cd.mkdirs();
          File sh = new File(cd, "feedback.png");
          try (FileOutputStream f = new FileOutputStream(sh)) { f.write(Base64.decode(b64, Base64.DEFAULT)); }
          Uri u = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fileprovider", sh);
          i.putExtra(Intent.EXTRA_STREAM, u); i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
        startActivity(Intent.createChooser(i, "Send Feedback"));
      } catch (Exception e) { runOnUiThread(() -> Toast.makeText(MainActivity.this, "Email Error: " + e.getMessage(), Toast.LENGTH_LONG).show()); }
    }
  }
}
