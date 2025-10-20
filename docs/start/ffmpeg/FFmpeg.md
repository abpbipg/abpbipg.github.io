# FFmpeg 超级详细安装与配置教程（Windows 系统）

### 1. 前言

FFmpeg 是一个用于处理**视频、音频等多媒体文件**的开源工具包。它支持几乎所有的多媒体[格式转换](https://so.csdn.net/so/search?q=格式转换&spm=1001.2101.3001.7020)、剪辑和编辑，是开发者和多媒体工作者必备的工具。本文详细讲解如何在 **Windows 系统**上[安装 FFmpeg](https://so.csdn.net/so/search?q=安装 FFmpeg&spm=1001.2101.3001.7020) 并进行基本配置。

### 2. 下载 FFmpeg 安装包

1. 打开 [Dpwnload FFmpeg 官网](https://ffmpeg.org/download.html)，选择安装包`Windows builds from gyan.dev`
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4061620401db452eaa011d804b82d7b5.png)
2. 下滑找到`release bulids`部分，选择`ffmpeg-7.0.2-essentials_build.zip`
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/b09564fbbcad48cf830587e16c00e364.png)
3. 下载完成后，解压缩得到 FFmpeg 文件夹。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/bbc64e10203f4fac9ece82c1543e4ec6.png)

**建议保存路径**：建议将文件解压并保存至`D盘`，以避免占用`C盘`系统盘的空间，从而确保系统运行的稳定性和性能。

------

### 3. 解压文件并检查目录结构

解压后的文件夹中应包含以下目录：

- `bin`：FFmpeg 可执行文件所在的文件夹，运行 FFmpeg 的所有命令都需通过此目录下的文件。
- `doc`：文档资料。
- `presets`：预设的格式和编码方案。

进入 `bin` 目录，可以看到 FFmpeg 的三个核心可执行文件：`ffmpeg.exe`、`ffplay.exe`、`ffprobe.exe`。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9fc33953dc0d4470b91f6545b7d5bb09.png)

------

### 4. 配置环境变量

为了方便在命令行中直接调用 FFmpeg，需要将其添加到系统的环境变量中。

1. 在桌面左下角开始菜单搜索"菜单"，找到"编辑编辑环境变量"，然后点击打开。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/dfb990b4cfee439eae7bb8a12ddf815f.png)
2. 点击“环境变量”按钮。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/3578dbc61da84466a8ec0d54b8e92cd9.png)
3. 找到“系统变量”中的 `Path` 条目并点击“编辑”。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/9fd4b1fe1066478687dd9996dd78ea39.png)
4. 在“编辑环境变量”窗口中，点击“新建”，输入 FFmpeg 的 `bin` 文件夹路径。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/d3b04c2e00c74e0f834d99a1369fa53e.png)
5. 依次点击“确定”以保存设置（三个“确定”缺一不可）。

> **注意**：确保路径准确，以便系统能正确找到 FFmpeg 文件。

------

### 5. 测试安装是否成功

1. 按 `Win + R` 键，输入 `cmd` 打开命令行窗口。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/a982e064206848f4a777e93b2a6624e7.png)

2. 在命令行中输入以下命令查看 FFmpeg 版本：

   ```shell
   ffmpeg -version
   运行本项目shell1
   ```

3. 如果正确显示 FFmpeg 版本号和相关信息，说明安装成功（类似下图）。
   ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f5d2f6f6b88f41858ecaebf073b349e7.png)

------

### 6. 基本使用示例

安装成功后，您可以使用命令行来执行 FFmpeg 的各种操作。以下是常用的命令行格式及其示例：

#### FFmpeg 命令行格式

```shell
ffmpeg [global_options] {[input_file_options] -i input_url} ... {[output_file_options] output_url}
运行本项目shell1
```

#### 示例：将 MP4 文件转换为 TS 格式

假设我们要将一个 MP4 视频文件转换为 TS 文件，命令如下：

```shell
ffmpeg -i "C:\Users\moon.huang\Desktop\video.mp4" -f mpegts -codec:v mpeg1video -b:v 2000k -r 30 -bf 0 -codec:a mp2 -ar 44100 -ac 1 -b:a 128k "C:\Users\moon.huang\Desktop\video.ts"
运行本项目shell1
```

| 参数       | 含义                              |
| ---------- | --------------------------------- |
| `-i`       | 输入文件路径（被转换的 MP4 文件） |
| `-f`       | 输出文件格式设置为 `mpegts`       |
| `-codec:v` | 指定视频编码器为 `mpeg1video`     |
| `-b:v`     | 设置输出视频比特率为 `2000k`      |
| `-r`       | 设置帧速率为 `30`                 |
| `-bf`      | 设置 B 帧数量为 `0`               |
| `-codec:a` | 指定音频编码器为 `mp2`            |
| `-ar`      | 设置音频采样频率为 `44100`        |
| `-ac`      | 设置音频通道数为 `1`              |
| `-b:a`     | 设置音频比特率为 `128k`           |