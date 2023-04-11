# Nihility

Docker and Kubernetes: The Complete Guide
---

使用 Kubernetes 构建、测试和部署Docker应用程序。


# 一、介绍

## 为什么使用Docker？

Docker使安装和运行软件变得非常容易，而无需担心设置或依赖关系。

## 什么是Docker？

Docker是一个围绕创建和运行容器的平台或生态系统。

Docker 生态系统(Ecosystem)

- Docker Client
- Docker Server
- Docker Machine
- Docker Images
- Docker Hub
- Docker Compose 

镜像(Image)是包含运行程序所需的所有依赖项和配置的单个文件。

容器(Container)是镜像(Image)的一个实例，是一个程序，它有一组自己的隔离硬件资源、自己的内存空间、网络等。

Docker Client(Docker Cli) 是一个工具，我们将向它发出命令。
Docker Server(Docker Daemon) 负责创建镜像(Image)、运行容器、上传镜像等操作的工具。