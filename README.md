# Nihility

Docker and Kubernetes: The Complete Guide
---

使用 Kubernetes 构建、测试和部署Docker应用程序。


## 一、介绍

### 为什么使用Docker？

Docker使安装和运行软件变得非常容易，而无需担心设置或依赖关系。

### 什么是Docker？

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

## 二、了解 Docker Client 的基本使用

### 1.基本命令

查看 docker 版本
```bash
docker version
```

运行 hell-world 容器
```bash
docker run hello-world
```

> `docker run` = `docker create` + `docker start`

覆盖默认命令
```bash
docker run busybox echo hi there
docker run busybox ls
docker run busybox ping bing.com
```

查看正在运行的容器
```bash
docker ps 
```

查看所有容器
```bash
docker ps --all
docker ps -a
```

创建容器
```bash
docker create hello-world
```

运行容器
```bash
docker start <container_id>
```

移除所有停止的容器
```bash
docker system prune 
```

查看容器日志
```bash
docker logs <container_id> 
```

停止运行中的容器
```bash
docker stop <container_id>
docker kill <container_id>
```

运行 redis 容器
```bash
docker run redis
```

进入容器
```bash
docker exec -it <container_id> redis-cli
```

进入容器终端
```bash
docker exec -it <container_id> sh
```

### 2.创建镜像(Image)

- 创建一个 Dockerfile
- 指定基础镜像
- 运行一些命令安装额外程序
- 指定命令去启动一个容器

> 创建 `redis-image` 文件夹并创建 `Dockerfile` 文件。

构建镜像
```bash
docker build .
```
构建镜像并标记
```bash
docker build -t <docker_id>/<project_name>:<version> .
```
例如
```bash
docker build -t stephengrider/redis:latest .
```

在容器中执行命令
```bash
docker commit -c 'CMD ["redis-server"]' <docker_id>
```


# 三、构建自定义镜像 (NodeJS Demo)

## 1. 创建 NodeJS WebApp

- 创建 `simpleweb` 文件夹
- 创建 `package.json` 文件
- 创建 `index.js` 文件

## 2. 创建Dockerfile

## 3. 基于Dockerfile创建镜像

```bash
docker build -t grayjunzi/simpleweb .
```

## 4. 基于镜像运行容器

```bash
# -p 宿主机端口:容器端口
docker run -p:8080:8080 grayjunzi/simpleweb
```

运行容器并进入终端
```bash
docker run -it grayjunzi/simpleweb sh
```


## 5. 工作目录

