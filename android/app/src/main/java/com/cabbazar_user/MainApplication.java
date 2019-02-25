package com.cabbazar_user;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.razorpay.rn.RazorpayPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.razorpay.rn.RazorpayPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGooglePlacesPackage(),
            new RazorpayPackage(),
            new RNFirebasePackage(),
             new RNFirebaseMessagingPackage(),
             new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
