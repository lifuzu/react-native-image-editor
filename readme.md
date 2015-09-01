Here is an image editor for react native.

###Development steps:
```
$ git clone https://github.com/lifuzu/react-native-image-editor.git
$ cd react-native-image-editor/
$ npm install
$ npm link
$ cd Examples/ReactNativeImageEditor/
$ npm install
$ npm link react-native-image-editor
```

Then open the project `ReactNativeImageEditor.xcodeproj` under the folder: `ReactNativeImageEditor.xcodeproj/Examples/ReactNativeImageEditor/`
![enter image description here](https://lh3.googleusercontent.com/-LQqMlnhx0ik/VeVS3o7neOI/AAAAAAAADic/01MtFMPriaE/s600/Screen+Shot+2015-08-31+at+10.17.28+PM.png "OpenXCodeProject.png")

When you run the project, sometimes you get a red screen on iOS simulator, like: 
![enter image description here](https://lh3.googleusercontent.com/-7HWoxVOeNBI/VeVUuVF2SaI/AAAAAAAADis/USCEBV4PgRY/s600/Screen+Shot+2015-08-31+at+10.43.21+PM.png "ErrorScreenshot.png")
Which should mean your node server console does not yet ready for the development server, like this one:
![enter image description here](https://lh3.googleusercontent.com/-ecvvlcdGbJk/VeVVE2jjDtI/AAAAAAAADi4/JTDGhWXtGlI/s600/Screen+Shot+2015-08-31+at+10.45.50+PM.png "NodeDevelopmentConsole.png")
You have to wait for next printouts, like the following:
```
[11:46:54 PM] <START> fs crawl
[11:47:32 PM] <END>   fs crawl (37615ms)
[11:47:32 PM] <START> Building in-memory fs
[11:48:26 PM] <END>   Building in-memory fs (54233ms)
[11:48:26 PM] <START> Building in-memory fs
[11:49:20 PM] <END>   Building in-memory fs (54080ms)
[11:49:20 PM] <START> Building Haste Map
[11:49:43 PM] <START> Building (deprecated) Asset Map
[11:49:53 PM] <END>   Building (deprecated) Asset Map (10343ms)
[11:49:57 PM] <END>   Building Haste Map (36723ms)
```
Since we have to uninstall `watchman`, a little bit longer time need to be waited.

**NOTE**: Uninstall watchman to workaround the bug of that, the latest version of react native does NOT support symbolic for node modules, which we are using in this project, until we publish the module onto https://www.npmjs.com/package;
**NOTE**: Don't use iojs, use nodejs (it is better to keep v0.12.2). iojs open a lot of files, caused the following error:
```
Error: EMFILE: too many open files
```
**NOTE**: You probably need to enlarge max open files on mac, please refer to this issue: https://github.com/gruntjs/grunt-contrib-copy/issues/21