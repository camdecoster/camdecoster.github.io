---
pubDate: 2021-11-05T13:40:19-06:00
title: "Add Windows Keyboard Shortcuts With AutoHotKey"
description: "Learn how to make multiple Windows desktops easier to use with AutoHotKey"
tags: [devblog, windows, multiple-desktops, autohotkey]
image: "@assets/add-windows-keyboard-shortcuts-with-autohotkey/images/ahk_logo.png"
---

![autohotkey logo](@assets/add-windows-keyboard-shortcuts-with-autohotkey/images/ahk_logo.png "AutoHotKey Logo")

My preferred developing OS is Debian Linux, but that's not an option at my day job. One of the reasons I prefer Debian is the use of the Gnome desktop environment, which handles multiple desktops (or workspaces) really well. You can create as many as you need and easily move windows between them using the keyboard. I have to use Windows 10 at work, so I decided to figure out how to approximate this experience on that OS. Microsoft added some native shortcuts, but it's not enough for me. Below is a guide on how to add some more using AutoHotKey.

## Why use AutoHotKey?

AutoHotKey (AHK) is a way to add functionality to Windows using a simple scripting language. This includes adding keyboard shortcuts or creating "hotstrings" (ie. text expansion). There are many other ways to use this software, and you can read about them [here](https://www.autohotkey.com/). It's also worth mentioning, it's free and open source.

## Installation

I suggest downloading the portable version without an installer (found [here](https://www.autohotkey.com/download/ahk.zip)) and extracting the files to a local folder, such as:

```
C:\Programs (Manual Install)\AutoHotKey
```

There are other downloads available [here](https://www.autohotkey.com/download/), including a version with an installer. Using the installer version will let you double-click script files to run them, run the executable from any directory on the command line, and some other items. However, the portable version won't cause issues with security software and it's easy to remove.

## Building a Script

A good starting point is the [tutorial](https://www.autohotkey.com/docs/Tutorial.htm) to get an understanding of the basics, but we'll also build a [hotstring](https://www.autohotkey.com/docs/Hotstrings.htm) script.

Create a directory to store your script files, such as:

```
C:\Users\{YOUR_USER_NAME}\Documents\AutoHotKey Scripts
```

Now open your favorite text editor and save a file in this directory:

```
Hotstrings.ahk
```

AHK script files have the extension .ahk and there's an extension for VS Code that will recognize these files and provide suggestions when writing a script.

Let's add a hotstring shortcut to the script:

```autohotkey
; Shortcut for work email
::emi::
  SendInput your.name@example.com
  TrayTip, , Text 'emi' Expanded, 2
Return
```

When run, this script will look for the keyboard entry of emi, replace it with your.name@example.com, and finally send a tray notification stating "Text 'emi' Expanded" for 2 seconds. The command is enclosed in double colons (::). When it's typed in, the following commands will be run until getting to Return. Lines preceded by a semicolon (;) are comments. You can add multiple hotstrings in one script.

## Executing a Script

If you've installed AHK using the installer, it's as simple as double-clicking the script. If you've used the portable version, you need to execute it from the command line in the form of {path to executable} {path to script}. Using the directories above, this becomes:

```
"C:\Programs (Manual Install)\AutoHotKey\AutoHotkeyU64.exe" "C:\Users\{YOUR_USER_NAME}\Documents\AutoHotKey Scripts\Hostrings.ahk"
```

This will start the script and keep the terminal window open while it's running. An icon will show up in the notification area representing that script. You can manage the script by right-clicking on the icon. Once it's running, your hotstring should now work while you're typing.

If you want to run the script automatically, get rid of the terminal, or run more than one script, it's best to use a batch file with a shortcut in the Startup folder. Let's start with the batch file.

Save a file in your scripts folder:

```
C:\Users\{YOUR_USER_NAME}\Documents\AutoHotKey Scripts\Launch AutoHotKey Scripts.bat
```

And add the following commands:

```
start "" "C:\Programs (Manual Install)\AutoHotKey\AutoHotkeyU64.exe" "C:\Users\{YOUR_USER_NAME}\Documents\AutoHotKey Scripts\Hotstrings.ahk"
start "" "C:\Programs (Manual Install)\AutoHotKey\AutoHotkeyU64.exe" "C:\Users\{YOUR_USER_NAME}\Documents\AutoHotKey Scripts\Other Script.ahk"
```

Using the start command in this way will execute the command in the terminal window, then close the window after the commands have been run.

Now all you need to do is create a shortcut to this batch file and place it in your Startup folder:

1. Right-click the batch file and select 'Create shortcut'. This will create a shortcut in the scripts folder.
1. Copy the shortcut to the following directory:

    ```
    C:\Users\{YOUR_USER_NAME}\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
    ```

When Windows starts, the batch file will run and execute your AHK scripts.

## Window Manipulation Keyboard Shortcuts Script

The following script will provide shortcuts to manipulate windows when using multiple desktops in Windows. Just save the text to a new script file and add it to your batch file to be executed. The key combinations are:

- Minimize window: Win+Alt+H
- Switch desktop (in addition to existing shortcut, Win+Ctrl+(Left or Right):
    - Switch to left desktop: Win+Alt+Left
    - Switch to right desktop: Win+Alt+Right
- Move window to desktop:
    - Move to left: Win+Shift+Left
    - Move to right: Win+Shift+Right
- Show windows on current desktop (this is a Windows shortcut, not in AHK but useful to know)
    - Show task view: Win+Tab

```autohotkey
#SingleInstance, force
; Minimize window
!#H::
  WinMinimize, A
Return

; Switch Desktops (in addition to normal shortcuts)
^!Left::
  Send {LWinDown}{CtrlDown}{Left}{CtrlUp}{LWinUp}
Return

^!Right::
  Send {LWinDown}{CtrlDown}{Right}{CtrlUp}{LWinUp}
Return

; Commands to send window to desktop left or right
; These don't work on modern Windows apps

; Move active window to left
+#Left::
  ; Get active window title
  WinGetTitle, Title, A
  ; Hide active window
  WinHide %Title%
  ; Switch to desktop to the left
  Send {LWin down}{Ctrl down}{Left}{Ctrl up}{LWin up}
  ; Pause for 50ms
  sleep, 50
  ; Unhide previously hidden window
  WinShow %Title%
  ; Activate the unhidden window
  WinActivate, %Title%
Return

; Move active window to right
+#Right::
  ; Get active window title
  WinGetTitle, Title, A
  ; Hide active window
  WinHide %Title%
  ; Switch to desktop to the right
  Send {LWin down}{Ctrl down}{Right}{Ctrl up}{LWin up}
  ; Pause for 50ms
  sleep, 50
  ; Unhide previously hidden window
  WinShow %Title%
  ; Activate the unhidden window
  WinActivate, %Title%
Return
```