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

- simpleweb

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

- redis-image

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


## 三、构建自定义镜像 (NodeJS Demo)

- visits

### 1. 创建 NodeJS WebApp

- 创建 `simpleweb` 文件夹
- 创建 `package.json` 文件
- 创建 `index.js` 文件

### 2. 创建Dockerfile

### 3. 基于Dockerfile创建镜像

```bash
docker build -t grayjunzi/simpleweb .
```

### 4. 基于镜像运行容器

```bash
# -p 宿主机端口:容器端口
docker run -p:8080:8080 grayjunzi/simpleweb
```

运行容器并进入终端
```bash
docker run -it grayjunzi/simpleweb sh
```


## 四、了解 Docker Compose 的基本使用

- 用于同时启动多个Docker容器。

启动Docker Compose
```bash
docker-compose up 
```

```bash
docker-compose up -d
```

重新构建容器并启动
```bash
docker-compose up --build
```

关闭容器
```bash
docker-compose down
```

查看 Docker Compose 中的容器
```bash
docker-compose ps
```

### 重启策略

- "no" - 默认值，从不尝试重启容器。
- "always" - 如果容器停止或其他原因，总是试图重启容器。
- "on-failure" - 只有在容器停止时出现错误代码才重新启动。
- "unless-stopped" - 除非我们(开发人员)强制停止，否则总是重新启动

## 五、构建自定义镜像 (Nginx + React)

- frontend

### 开发工作流程

Development -> Testing -> Deployment

1. Github 仓库 拉取代码到主分支
2. Travis CI 将自动获取代码、测试、并部署应用到AWS主机中。


开发阶段:
    1. 创建/变更 Features(功能)分支 或 更改代码到非主分支的分支中
    2. 推送到 Github 仓库中
    3. 创建 Pull Request 合并到主分支

测试阶段：
    1. 代码推送到 Travis CI 中
    2. 测试并运行

生产阶段：
    1. 代码推送到 Travis CI 中
    2. 测试并运行
    3. 部署到 AWS Elastic Beanstalk 中

### 创建项目

安装React脚手架工具
```bash
npm install -g create-react-app
```

创建项目
```bash
npx create-react-app frontend
```

仅开发环境运行
```bash
npm run start
```

运行测试
```bash
npm run test
```

构建应用程序的生产版本
```bash
npm run build
```

构建开发版本镜像
```bash
docker build -f Dockerfile.dev .
```

Volumes
```bash
docker run -p 3000:3000 -v /app/node_modules -v  $(pwd):/app <container_id>
docker run -p 3000:3000 -v $(pwd):/app <container_id>
```

## 六、复杂容器项目 (Nginx + React + Express + Redis + Postgres)

 - complex  

# 登录 Docker Hub
```bash
docker login
```

### 七、了解 Kuberneters 的基本使用

- simplek8s

- 什么是Kubernetes？ - 在多台不同机器上运行多个不同容器的系统
- 为什么使用 Kubernetes？ - 当你需要用不同的镜像运行许多不同的容器时

- kubectl - 用于管理节点中的容器
- minicube - 用于管理vm本身

#### 1.Kubernetes 的核心概念

- Pod
- Service
- ReplicaController
- StatefulSet

让多客户端镜像作为容器在本地Kubernetes群集上运行。

Pod是运行单个容器的最小的东西。

#### 2. 对象类型 (Object Types)

- Pods - 运行一个或多个密切相关的容器。
- Services - 在Kubernetes集群中设置网络。
    - ClusterIP
    - NodePort - 对外公开一个容器出来(仅开发环境使用)
    - LoadBalancer
    - Ingress
- Development - 开发环境

```bash
# apply: 修改当前集群配置
# -f : 指定文件
# <filename> : 配置文件的路径
kubectl apply -f <filename>
```

```bash
kubectl apply -f client-pod.yaml
kubectl apply -f client-node-port.yaml
```

查看pods
```bash
kubectl get pods
```

查看services
```bash
kubectl get services
```

开启minikube
```bash
minikube start
```

查看ip
```bash
minikube ip
```

查看具体信息
```bash
kubectl describe <object_type> <object_name>
```

```bash
kubectl describe pod client-pod
```

删除
```bash
kubectl delete -f <config_file>
```

```bash
kubectl delete -f client-pod.yaml
```

```bash
kubectl get pods -o wide
```

```bash
kubectl set image <object_type> / <object_name> <container_name> = <new image to use>
```

```bash
kubectl set image deplyment/client-deployment client=stephengrider/multi-client:v5
```

```bash
minikube docker-env
```

### 八、了解 Kubernetes 配置

#### 将配置合并到单个文件中

在一个`.yaml` 文件中 使用 `---` 将多个配置隔开。如下所示:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      component: web
  template:
    metadata:
      labels:
        component: web
    spec:
      containers:
        - name: client
          image: stephengrider/multi-client
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: server-cluster-ip-service
spec:
  type: ClusterIP
  selector:
    component: server
  ports:
    - port: 5000
      targetPort: 5000
```

#### PVC

`PVC` 是 `Persistent Volume Claim` 的缩写。


```bash
kubectl get pv
```

#### Secrets

创建 Secret
```bash
kubectl create secret generic <secret_name> --from-literal key=value
```

```bash
kubectl create secret generic pgpassword --from-literal PGPASSWORD=postgres  
```

查看 Secret
```bash
kubectl get secrets
```

#### 负载均衡 (Load Balancer)

#### dashboard

```bash
minikube dashboard
```