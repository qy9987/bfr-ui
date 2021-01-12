FROM node:10 as build-stage

# 注释
LABEL maintainer = "xiaoqingyu <xiaoqingyu@buffalo-robot.com>"

RUN mkdir -p /home/bfr-ui/

COPY package.json /home/bfr-ui/

WORKDIR /home/bfr-ui


RUN yarn config set registry https://registry.npm.taobao.org \
  && yarn install 


COPY . /home/bfr-ui



RUN yarn website-build 


FROM nginx:1.13.7 as production-stage



COPY  --from=build-stage /home/bfr-ui/website-dist /home/bfr-ui/

COPY ./nginx/conf/* /etc/nginx/

WORKDIR /


ENV TZ=Asia/Shanghai

RUN mkdir -p /home/brisServerJS/uploads/mp4 \
  && chmod +x /usr/local/bin/entrypoint.sh \
  && mkdir -p /home/logs/ \
  && ls -a /usr/local/bin/ \
  && echo 'Asia/Shanghai' >/etc/timezone 

# CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80

CMD ["nginx","-c","/etc/nginx/nginx.conf","-g","daemon off;"]

