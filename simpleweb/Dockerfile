# 指定基础镜像
FROM node:alpine

# 进入工作目录
WORKDIR /usr/app

# 复制文件到镜像中
COPY ./package.json ./

# 安装依赖
RUN npm install --registry=https://registry.npm.taobao.org

# 复制文件到镜像中
COPY ./ ./

# 执行命令
CMD ["npm", "start"]