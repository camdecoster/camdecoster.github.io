---
title: "Going from GNOME Shell to macOS"
description: "TLDR: I would rather keep using Fedora"
pubDate: 2024-08-30T10:23:34.849Z
tags: [devblog, gnome, linux, macos]
image: "@assets/going-from-gnome-shell-to-mac-os/images/header.png"
---

![gnome logo greater than apple logo greater than windows logo](@assets/going-from-gnome-shell-to-mac-os/images/header.png "How I would rank these OSs")

I recently started a new job and have to use a Macbook for development. This is the first time I've used a Mac for any extended period of time and I've been writing some notes about my experience going from Fedora Linux with GNOME Shell to macOS Sonoma. TLDR: I would rather use Fedora, but macOS is better than Windows.

There are shortcomings in macOS, but Apple doesn't see it that way. The result is that you have to just deal with it or install a number of utility programs to provide that functionality. Lots of these are free and open source, but there's a small industry in creating these utilities and charging for them. Microsoft has its own similar industry with Windows, but I think that Apple's belief that they do things the "right" way leads to a worse situation. I'm not getting rid of my ThinkPad any time soon. Anyway, here are my notes with some workarounds.

NOTE: Unless otherwise specified, I used [brew](https://brew.sh/) to install any application mentioned.

### Keyboard

I think the <kbd>Cmd</kbd> and <kbd>Ctrl</kbd> keys are redundant and lead to unnecessary complexity. I admit that this gripe is mostly due to my growing up in the Windows computer world and being used to those keyboard shortcuts. But it's ridiculous that I have to use <kbd>Cmd</kbd>+<kbd>C</kbd> in VS Code to copy, but <kbd>Ctrl</kbd>+<kbd>Tab</kbd> to switch tabs. Similar switching between <kbd>Cmd</kbd>/<kbd>Ctrl</kbd> happens in other programs too (like Firefox and Chrome). Here are a couple changes to mitigate this:

- You can [swap](https://support.apple.com/guide/mac-help/change-the-behavior-of-the-modifier-keys-mchlp1011/mac) the <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> keys on an external keyboard. You can avoid having to change your muscle memory this way.
- You can [show](https://support.apple.com/guide/mac-help/use-the-keyboard-viewer-on-mac-mchlp1015/mac) the keyboard viewer in the menu bar. This can be helpful if your keyboard doesn't have all of the Mac keys.
- There's no <kbd>Alt</kbd>+<kbd>Tab</kbd> on macOS. The closest equivalent is <kbd>Cmd</kbd>+<kbd>Tab</kbd>, but it doesn't show you the window you're switching to. Once you're in the application you want to use, you can switch through app windows using <kbd>Cmd</kbd>+<kbd>`</kbd>. I installed [AltTab](https://alt-tab-macos.netlify.app/) to provide a better experience. This app switches through all open windows.
- The <kbd>Home</kbd> and <kbd>End</kbd> keys go to the beginning and end of a document (top/bottom) 🤦. Use <kbd>Cmd</kbd>+<kbd>Left</kbd> and <kbd>Cmd</kbd>+<kbd>Right</kbd> to get to start and end of a line. I ended up remapping the <kbd>Home</kbd> and <kbd>End</kbd> keys as described [here](https://www.maketecheasier.com/fix-home-end-button-for-external-keyboard-mac/) to work around this. There's more info [here](https://apple.stackexchange.com/questions/16135/remap-home-and-end-to-beginning-and-end-of-line).
  - It doesn't work quite right in Slack. I'm sure there's a fix, but I haven't looked into it yet.
  - This fix didn't work in the Terminal app, so I had to add custom shortcuts as described [here](https://jeffmikels.org/posts/how-to-fix-home-and-end-keys-in-the-mac-terminal/)
- Lock the computer with <kbd>Ctrl</kbd>+<kbd>Cmd</kbd>+<kbd>Q</kbd>
- Launch Spotlight search using <kbd>Cmd</kbd>+<kbd>Space</kbd>. This is the equivalent of using search from the activities overview in GNOME.
- The [Mission Control](https://support.apple.com/en-az/guide/mac-help/mh35798/mac) view can be triggered with <kbd>Ctrl</kbd>+<kbd>Up</kbd> (or a three fingered swipe up on a touchpad). This is the equivalent of the activities overview in GNOME.
- Mission Control and Spotlight should be in the same view like in GNOME. I don't like having to remember two shortcuts.
- There's a program called [Karabiner Elements](https://karabiner-elements.pqrs.org/) that allows one to customize the keyboard on macOS. I haven't used it, but it sounds like it could handle the <kbd>Home</kbd>/<kbd>End</kbd> situation described above. It also might be able to get the calculator button working on my external keyboard.
- Use <kbd>Cmd</kbd>+<kbd>Up</kbd> to [move to the parent directory](https://mkyong.com/mac/go-to-the-parent-folder-on-macos/) in Finder
- Use <kbd>Alt</kbd>+<kbd>Delete</kbd> to delete the previous word. I'm used to <kbd>Ctrl</kbd>+<kbd>Backspace</kbd> on Linux, but this isn't too big of a change. It does get confusing when switching between laptops though.

### Window management

- Add [multiple desktops](https://support.apple.com/guide/mac-help/work-in-multiple-spaces-mh14112/mac) for handy multitasking
- Switch between desktops with <kbd>Ctrl</kbd>+<kbd>Left</kbd> and <kbd>Ctrl</kbd>+<kbd>Right</kbd>
- Putting an app into full screen creates a new desktop which contains only that app. Zoom does this when someone starts screensharing, but you can turn that [off](https://community.zoom.com/t5/Zoom-Meetings/How-do-I-disable-full-screen-mode-when-I-start-sharing-my-screen/m-p/37859/highlight/true#M18734).
- The native method of showing two apps side by side ([Split View](https://support.apple.com/guide/mac-help/use-apps-in-split-view-mchl4fbe2921/mac)) sucks, because it creates a new desktop. There's an app called [Rectangle](https://github.com/rxhanson/Rectangle) that adds a number of helpful shortcuts to place windows on a desktop (without adding a new desktop).
- To [maximize](https://support.apple.com/guide/mac-help/work-with-app-windows-mchlp2469/mac) (called Zoom) a window, you need to hold <kbd>Alt</kbd> and click the green plus button in the title bar. You can also maximize by double clicking the title bar if you change your [settings](https://support.apple.com/guide/mac-help/change-desktop-dock-settings-mchlp1119/14.0/mac/14.0).
- Windows can be minimized with <kbd>Cmd</kbd>+<kbd>M</kbd>, but then they don't show up in Mission Control. This is so dumb. It's even dumber that there's no way to enable this via a setting.
- Windows can be hidden with <kbd>Cmd</kbd>+<kbd>H</kbd>, but this hides all windows for that app. Dumb.
- The default setting on Sonoma is to only show scrollbars when you start scrolling. They don't appear on hover.
- You can't click-through unfocused applications. This means that you have to click to focus a window before you can interact with it. You can't change this in any OS settings. There's a [program](https://synappser.github.io/apps/autofocus/) that will focus whatever program you're hovering over, but I'm not sure that's the right solution.

### Display

- My Lenovo [USB-C dock](https://support.lenovo.com/us/en/solutions/pd500519-thinkpad-universal-usb-c-dock-overview-and-service-parts) didn't work with this Macbook. Only one monitor would work even if I had two plugged in. The reason for this is that Apple is dumb and hasn't [implemented](https://sebvance.medium.com/everything-you-need-to-know-about-macbook-pros-and-their-lack-of-displayport-mst-multi-stream-98ce33d64af4) DisplayPort completely, so only one screen can be connected via DisplayPort over USB-C. There's a program from Synaptics to enable multiple monitors for docks that use [DisplayLink](https://www.synaptics.com/products/displaylink-graphics/downloads/macos), but it didn't work for my dock.
- I ended up buying a new dock that works with Macs (the [CalDigit TS3](https://www.caldigit.com/ts3-plus/)), but it was expensive and I resent that I had to get it

### Changing the default shell

- I like using the [Fish](https://fishshell.com/) shell, so I wanted to use that instead of the default Z shell
- I followed [these](https://atlassc.net/2022/10/24/fish-on-macos) directions to switch my default shell
- I had to update the path to get some apps to work. I opted to do some of this via app specific Fish config files (fnm.fish, postgres.fish) in **conf.d**.
- The delete word shortcut (<kbd>Alt</kbd>+<kbd>Delete</kbd>) didn't work at first in Fish. [This](https://github.com/fish-shell/fish-shell/issues/2407) setting change helped get it working.

### Adding Node, Ruby version managers

- I installed [fnm](https://github.com/Schniz/fnm) as my Node version manager
- This required mucking about in Fish to get the paths right. See [this](https://github.com/Schniz/fnm/blob/d6c132adfd1c29c48acb0b9de42538146e23cf18/.ci/install.sh#L174) section of the install script.
- I installed [rbenv](https://formulae.brew.sh/formula/rbenv#default) as my Ruby version manager
- When installing rbenv, I had to update the Fish config per the [  instructions listed](https://github.com/rbenv/rbenv?tab=readme-ov-file#how-rbenv-hooks-into-your-shell) with the command `rbenv init`.
- The output was:
  ```sh
  # Load rbenv automatically by appending
  # the following to ~/.config/fish/config.fish:

  status --is-interactive; and rbenv init - fish | source
  ```

### File management

- To get hidden files/folders to show up in Finder permanently, enter the following command:
  ```sh
  defaults write com.apple.finder AppleShowAllFiles -boolean true; killall Finder;
  ```
- To get a Finder window to show these hidden items, use the shortcut <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>.</kbd>
- There's no cut/paste for files in macOS. Instead, there's [copy/move](https://www.howtogeek.com/735756/how-to-cut-and-paste-files-on-mac/). But you won't see that action by default. To see it, you have to do one of the following:
  - Copy with <kbd>Cmd</kbd>+<kbd>C</kbd>, then move with <kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd>
  - Copy with <kbd>Cmd</kbd>+<kbd>C</kbd>, then open the Edit menu while holding <kbd>Alt</kbd> and select Move

### Miscellaneous

- "[Reactions](https://support.apple.com/en-us/105117)" is a (dumb) feature where macOS recognizes hand gestures on video and adds effects. This can be turned off in the video button via the menu bar when a camera is being used.
- I originally set up **Edit** menu shortcuts as described [here](https://superuser.com/a/363355) to match what I'm used to, but I disabled them after discovering it was too finicky. These shortcuts replace the existing menu shortcuts. Also, the name of the shortcut has to match what's listed in the menu for it to work.
- The native screenshot application does a good job and can be opened with <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd>. My only nit is that, when using the retangular select tool, you can't start selecting a new area; you have to move the existing area. For this reason I've started using a tool called [Flameshot](https://flameshot.org/) that DOES let me select a new area (plus lots of other features).
- I use a Brother HL-L2380DW printer/scanner at home. macOS automatically installed a driver for the printer, but the scanner wouldn't work. I had to install the Brother scanner [driver](https://support.brother.com/g/b/downloadlist.aspx?c=us&lang=en&prod=hll2380dw_us_as&os=10080) to get scanning working. I uninstalled the macOS driver, then installed the Brother drivers and the scanner started working.
- There's no native support for accessing files on an Android phone over USB, so I installed an app to help with that called [OpenMTP](https://openmtp.ganeshrvel.com/). It allowed me to access the files on my phone with a pretty intuitive interface. I've read that another option is [Android File Transfer](https://www.android.com/filetransfer/) from Google, but I couldn't get that to work.
- I'm used to having a dedicated mic mute shortcut in GNOME, but macOS doesn't have that. Luckily, there's a utility called [micSwitch](https://github.com/dstd/micSwitch/releases) that can do this. It provides an icon in the menu bar showing you the current mute status. You can set it to run via a keypress (I used F10).
- To get shared calendars to show up in the Calendar app on macOS, follow [this](https://www.hanselman.com/blog/how-to-make-shared-google-calendars-show-up-on-your-iphone-and-ipad-calendar) guide.
Basically, go to [this](https://www.google.com/calendar/syncselect) GCal page, select the calendars you want to sync, and click 'Save'.
- iTerm2 default paste is too fast for the Rails console in my application. Adjust the paste speed as described [here](https://gitlab.com/gnachman/iterm2/-/issues/3160).