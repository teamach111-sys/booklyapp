# ============================================================================
# React Native ProGuard / R8 rules
# ============================================================================

# --- Keep React Native runtime classes ---
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.hermes.instrumentation.** { *; }
-keepclassmembers class com.facebook.react.** { *; }

# --- Keep JS bundle entry point ---
-keep class com.booklyapp.** { *; }
-keepclassmembers class com.booklyapp.** { *; }

# --- TurboModules / New Architecture ---
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keep class * implements com.facebook.react.turbomodule.core.TurboModule { *; }

# --- Keep all React native modules referenced via reflection ---
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactPropGroup <methods>;
}

# --- AsyncStorage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# --- react-native-screens ---
-keep class com.swmansion.rnscreens.** { *; }

# --- react-native-safe-area-context ---
-keep class com.th3rdwave.safeareacontext.** { *; }

# --- react-native-svg ---
-keep class com.horcrux.svg.** { *; }

# --- react-native-documents-picker ---
-keep class com.reactnativedocumentspicker.** { *; }

# --- Keep native methods ---
-keepclasseswithmembernames class * {
    native <methods>;
}

# --- Keep enum values (used via reflection in RN) ---
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# --- Kotlin metadata ---
-keepattributes RuntimeVisibleAnnotations,RuntimeVisibleParameterAnnotations,RuntimeVisibleTypeAnnotations
-keepattributes Signature,InnerClasses,EnclosingMethod
-keepattributes *Annotation*

# --- Strip debug symbols from native libs ---
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}
