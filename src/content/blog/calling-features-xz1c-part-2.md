---
title: "Getting calling features to work on the Sony XZ1 Compact, Part 2"
description: "Get VoLTE and WiFi Calling working in Android Pie"
pubDate: 2024-09-19T22:58:01.714Z
tags: [devblog, phone, sony, xz1-compact, t-mobile, metropcs, android]
image: "@assets/calling-features-xz1c-part-2/images/header.png"
---

![a pie with the words volte and wifi calling above, getting calling features working on your xz1 compact](@assets/calling-features-xz1c-part-2/images/header.png "Bake some better calling into Pie!")

Back in 2018, I used a Sony XZ1 Compact phone on MetroPCS. This phone was sold as being compatible with the T-Mobile network, including with VoLTE and WiFi Calling features. MetroPCS runs on the T-Mobile network, but due to using a different SIM identifier, these features wouldn't work. I figured out a [way](/posts/calling-features-xz1c/) to get around this that worked on Android 8 (Oreo), but it didn't work on Android 9 (Pie). I recently needed to get this phone connected again and I decided to figure out a way to get my solution to work on Pie. Thankfully, someone wrote a [guide](https://xdaforums.com/t/xz1-compact-metropcs-volte-latest-pie-fingerprint-wi-fi-calling-step-by-step-guide.4502093/) to do almost this exact thing ([PDF version](@assets/calling-features-xz1c-part-2/guide.pdf), credit to [eparr](https://xdaforums.com/m/eparr.10261803/)).

Essentially, you need to do what I listed in my first post, but now you need to make it permanent using root. There's no vulnerability to get root on Pie, so you have to root the phone on Oreo, use root to install an updated customization selector, then flash to Pie without overwriting your work. To do this, you need to have the following:

- [**Android SDK Platform Tools**](https://developer.android.com/tools/releases/platform-tools#downloads), a set of tools for connecting to Android phones from a computer
- [**Xperifirm**](https://xperifirm.com/), a tool to download firmware for Sony phones
  -  On Linux, this needs to be run with [Mono](https://www.mono-project.com/) as described [here](https://xperifirm.com/tutorial/install-xperifirm-linux/)
- A copy of the most recent Oreo image for the phone (47.1.A.16.20). The guide includes a link to the US version.
- A copy of the latest Pie image for the phone (47.2.A.11.228). This can be downloaded with Xperifirm ☝️.
- [**newflasher**](https://xdaforums.com/t/tool-newflasher-xperia-command-line-flasher.3619426/), a tool for flashing firmware to Sony phones
  - On Linux, make it executable with:
    ```sh
    chmod +x ./newflasher.XXX
    ```
  - Then run it as root
- A copy of the updated customization selector APK. You can use the one from the guide or create your own as described in my original tutorial (this is also described in the guide).
- [**bindershell**](https://xdaforums.com/t/xz1c-xz1-xzp-temp-root-exploit-via-cve-2019-2215-including-magisk-setup-locked-bl.4046641/), a utility to get temporary root access on the phone

If you have everything above, follow the guide below to get things working. **It should be noted that this will erase your phone**.

1. Plug a USB cable into your computer, but keep your phone unplugged
1. Prepare the Oreo firmware:
    1. Download the Oreo firmware
    1. Extract the contents of the zip file into a folder named **OREO**
    1. Delete the files that begin with *persist* (this should only be **persist_X-FLASH-ALL-C93B.sin**)
    1. Delete the file **oem_X-FLASH-CUST-C93B.sin** from OREO
1. Prepare the Pie firmware:
    1. Download the Pie firmware using [Xperifirm](https://xperifirm.com/)
    1. Extract the contents of the zip file into a folder named **PIE**
    1. Delete the files that begin with *persist* (this should only be **persist_X-FLASH-ALL-C93B.sin**)
    1. Copy the file **oem_X-FLASH-CUST-C93B.sin** from PIE into OREO
    1. Delete the file **oem_X-FLASH-CUST-C93B.sin** from PIE
1. Flash the Oreo firmware:
    1. Extract the contents of the [newflasher](https://xdaforums.com/t/tool-newflasher-xperia-command-line-flasher.3619426/) zip file into the Oreo directory
    1. On Windows, you'll need to install the phone drivers. You can do this by running **newflasher** and answering "Y" to the prompt about the GordonGate flash driver and following the directions.
    1. Factory reset your phone. After it reboots to the intial setup wizard, turn the phone off.
    1. Remove the SIM card from the phone
    1. Put the phone into flash mode by holding the volume down button and plugging the phone into your computer USB cable, continuing to hold the button until the LED turns green
    1. Run **newflasher** and answer prompts as follows:
        - "n" to installing the GordonGate flash driver
        - "n" to keeping userdata
        - "a" to reboot mode
        - "n" to dump trim area
    1. The phone will be flashed and boot back into the initial setup wizard
1. Root the phone and install the modified customization selector:
    1. Complete the intial setup wizard
    1. Enable "Developer options"
    1. Enable "USB debugging"
    1. Allow debugging on the phone when prompted. If you don't see the prompt, unplug the phone and plug it back in.
    1. Download and extract the [Android SDK Platform Tools](https://developer.android.com/tools/releases/platform-tools#downloads) for your operating system (or install them from your repo if that's an option)
    1. Copy the customization selector file into your Platform Tools folder
    1. Extract the contents of the [bindershell](https://xdaforums.com/t/xz1c-xz1-xzp-temp-root-exploit-via-cve-2019-2215-including-magisk-setup-locked-bl.4046641/) zip file into your Platform Tools folder
    1. Run the following command and make sure your phone is listed. If it isn't, unplug the phone and plug it back. Allow debugging when prompted.
        ```sh
        adb devices
        ```
    1. Run the following command to copy the customization selector file to your phone:
        ```sh
        adb push com.sonymobile.customizationselector-res-305.apk /data/local/tmp
        ```
    1. Run the following command to copy the exploit over to your phone:
        ```sh
        adb push bindershell /data/local/tmp
        ```
    1. Run the following commands to run the exploit, get root access, install the customization selector, and exit the shell:
        ```sh
        adb shell
        cd /data/local/tmp
        chmod 644 ./com.sonymobile.customizationselector-res-305.apk
        chmod 755 ./bindershell
        ./bindershell
        chown root.root /data/local/tmp/com.sonymobile.customizationselector-res-305.apk
        mount -o rw,remount /oem
        cp -R com.sonymobile.customizationselector-res-305.apk /oem/overlay
        exit
        exit
        ```
    1. Unplug your phone and power it off
1. Flash the Pie firmware:
    1. Extract the contents of the **newflasher** zip file into the Pie directory
    1. Put the phone into flash mode by holding the volume down button and plugging the phone into your computer until the LED turns green
    1. Run **newflasher** and answer prompts as follows:
        - "n" to installing the GordonGate flash driver
        - "n" to keeping userdata
        - "a" to reboot mode
        - "n" to dump trim area
    1. The phone will be flashed and boot back into the initial setup wizard
1. Final steps:
    1. Unplug the phone from the computer
    1. Complete the intial setup wizard
    1. Power the phone off
    1. Insert the SIM card and turn the phone on
    1. The phone will boot up and then display a message that it needs to restart to be optimized for the network
    1. Once it restarts, try making a phone call and note that it connects to LTE+
    1. If you have WiFi calling enabled, try making a phone call and note that it completes a WiFi call

Your phone should now be ready to go. This update will survive if you need to factory reset the phone. It's worth noting that the the US version of the firmware doesn't enable the fingerprint sensor (for dumb legal reasons). If you'd like to get this working, follow the [guide](https://xdaforums.com/t/xz1-compact-metropcs-volte-latest-pie-fingerprint-wi-fi-calling-step-by-step-guide.4502093/) from eparr. It's a bit more complicated, but not by much.