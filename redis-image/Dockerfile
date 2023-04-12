# 基础镜像
FROM alpine

# 下载和安装依赖
RUN apk add --update redis

# 告诉镜像如何运行并启动一个容器
CMD ["redis-server"]