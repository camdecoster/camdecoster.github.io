---
title: "Getting Calling Features to Work on the Sony XZ1 Compact"
description: "Enable VoLTE and WiFi Calling on the XZ1 Compact on MetroPCS (or other MVNO's)"
pubDate: 2018-12-17
updatedDate: 2024-09-19T22:58:01.714Z
tags: [devblog, backfill, xda, phone, sony, xz1-compact, t-mobile, metropcs, android]
image: "@assets/calling-features-xz1c/images/header.png"
---

![screenshot of ongoing wifi call](@assets/calling-features-xz1c/images/header.png "Ongoing WiFi Call")

*UPDATE 2022/02/25: I originally posted this information on [XDA](https://xdaforums.com/t/volte-and-wifi-calling-working-on-metropcs-and-probably-other-t-mobile-mvnos.3880189/) in 2018, but I was worried that it would get corrupted with future forum upgrades, so I'm capturing it here too. Enjoy.*

*UPDATE 2024/09/12: It's now possible to get this working on Android 9 (Pie). See my new post [here](/posts/calling-features-xz1c-part-2/).*

**DISCLAIMER: This will only work on Android 8.0, and may not work on some versions of 8.0 depending on the security patch date. I'm using firmware version 47.A.1.16.20 with a security patch level of 2018/09/01.**

I figured out how to get VoLTE and WiFi Calling to work on MetroPCS. The XZ1C works on T-Mobile because it recognizes T-Mobile specific SIM cards and loads the appropriate files when it detects one. For whatever reason, MetroPCS has SIM cards that don't provide a sim_config_id that the phone will recognize as being part of T-Mobile. The list of sim_config_id values that are recognized are contained in a file located within the APK /oem/overlay/com.sonymobile.customizationselector-res-305.apk. Within the APK, the file is located at /res/xml/configuration_selectors.xml. The xml contents are listed below:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configurations>
    <configuration config_id="408">
        <sim_config_id>S264.1</sim_config_id>
        <sim_config_id>S264.2</sim_config_id>
        <sim_config_id>S264.3</sim_config_id>
        <sim_config_id>S264.4</sim_config_id>
        <sim_config_id>S264.5</sim_config_id>
        <sim_config_id>S264.6</sim_config_id>
        <sim_config_id>S264.7</sim_config_id>
        <sim_config_id>S264.8</sim_config_id>
        <sim_config_id>S264.9</sim_config_id>
        <sim_config_id>S264.10</sim_config_id>
        <sim_config_id>S264.11</sim_config_id>
        <sim_config_id>S264.12</sim_config_id>
        <sim_config_id>S264.13</sim_config_id>
        <sim_config_id>S264.14</sim_config_id>
        <sim_config_id>S264.15</sim_config_id>
        <sim_config_id>S264.16</sim_config_id>
        <sim_config_id>S264.17</sim_config_id>
        <sim_config_id>S264.18</sim_config_id>
        <sim_config_id>S8663.1</sim_config_id>
    </configuration>
</configurations>
```

In order to get the MetroPCS SIM recognized, you need to add one line to the bottom of the list. This changes the code to the following:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configurations>
    <configuration config_id="408">
        <sim_config_id>S264.1</sim_config_id>
        <sim_config_id>S264.2</sim_config_id>
        <sim_config_id>S264.3</sim_config_id>
        <sim_config_id>S264.4</sim_config_id>
        <sim_config_id>S264.5</sim_config_id>
        <sim_config_id>S264.6</sim_config_id>
        <sim_config_id>S264.7</sim_config_id>
        <sim_config_id>S264.8</sim_config_id>
        <sim_config_id>S264.9</sim_config_id>
        <sim_config_id>S264.10</sim_config_id>
        <sim_config_id>S264.11</sim_config_id>
        <sim_config_id>S264.12</sim_config_id>
        <sim_config_id>S264.13</sim_config_id>
        <sim_config_id>S264.14</sim_config_id>
        <sim_config_id>S264.15</sim_config_id>
        <sim_config_id>S264.16</sim_config_id>
        <sim_config_id>S264.17</sim_config_id>
        <sim_config_id>S264.18</sim_config_id>
        <sim_config_id>S8663.1</sim_config_id>
		<sim_config_id>S8957.1</sim_config_id>
    </configuration>
</configurations>
```

If you're on a different T-Mobile MVNO that supports VoLTE and WiFi Calling, but it's not working on your XZ1C, you can probably still get this to work. You'll need to figure out what sim_config_id to use using the following command:

```
adb shell getprop persist.sys.sim_config_ids
```

This should output a value similar to S8957.1. Use your value in the configuration_selectors.xml file.

You also need to change the overlay priority in the AndroidManifest.xml file. The normal overlay has a priority of 305. I changed mine to 310, but anything over 305 should work.

```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="YOUR.PACKAGE.NAME">
    <overlay android:priority="310" android:targetPackage="com.sonymobile.customizationselector"/>
</manifest>
```

In order to modify this APK, I used [apktool](https://ibotpeaches.github.io/Apktool/) to decompile the original APK and compile the modified APK. I followed [this](https://forum.xda-developers.com/showthread.php?t=2213985) guide.

Once the APK is built and signed, install it with adb:

```
adb install yourapkhere.apk
```

This is an overlay file which works using RRO, so you need to give the file the proper permissions to run. Enter the following command:

```
adb shell cmd overlay enable --user 0 yourapkhere.apk
```

Reboot your phone and the overlay should be active.

Due to the way the phone works, you need to trick the phone into loading the correct modem binary file. It loads a default modem when it doesn't recognize a T-Mobile SIM. But it won't load the T-Mobile modem even if you install the APK. I ended up having to get an unactivated T-Mobile SIM and put that in the phone to trigger the switch. Once you trigger it, you'll get a popup saying that the phone needs to reboot to optimize for your network. After it reboots and loads the proper modem, you can shutdown, put in your MetroPCS SIM card and boot. That should do it.

There's one big caveat: This will only work on Android 8.0. The overlay permission model changed in 8.1+ so this change won't work on those ROM's. The fix is still good, but you'd need to use root to make the change. I'm sure there will be a way around this eventually, but I don't have one at the moment.

For more technical information, I tracked my progress trying to get my X Compact working on MetroPCS with VoLTE and WiFi Calling in [this thread](https://forum.xda-developers.com/x-compact/how-to/trying-to-figure-how-to-enable-volte-t3877692). There's a lot of information regarding the XZ1C in there that might be of interest.

Theoretically, this should work for the XZ1, the XZ Premium (with proper files flashed), and possibly other Sony phones that contain the correct modem binary file.

Here are some screenshots showing the features working on my phone:

|VoLTE Call|WiFi Call|
|:---:|:---:|
|![screenshot of ongoing volte call](@assets/calling-features-xz1c/images/dialer_volte_small.jpg "Ongoing VoLTE Call")|![screenshot of ongoing wifi call](@assets/calling-features-xz1c/images/dialer_wifi_small.jpg "Ongoing WiFi Call")|
