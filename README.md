# 照片管理器

前后端分离的全栈应用，提供照片上传、浏览、编辑和删除功能。前端采用暗黑玻璃态设计风格，集成丰富的交互动画。

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Java 17 + Spring Boot 3.3 + JPA + MySQL |
| 数据库迁移 | Flyway |
| 前端 | Vue 3 (Composition API) + Vite |
| 动画 | anime.js v4 |
| 文件存储 | 本地文件系统（路径存储于 MySQL） |

## 项目结构

```
├── backend/                    # Spring Boot 后端
│   ├── src/main/java/com/example/demo/
│   │   ├── DemoApplication.java
│   │   ├── PhotoController.java      # REST API
│   │   ├── PhotoService.java         # 业务逻辑
│   │   ├── PhotoRepository.java      # 数据访问
│   │   └── Photo.java                # 实体
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── application-dev.yml
│   │   ├── application-prod.yml
│   │   ├── db/migration/             # Flyway 脚本
│   │   └── static/                   # 前端构建产物（部署用）
│   ├── uploads/
│   └── pom.xml
│
└── frontend/                   # Vue 3 + Vite 前端
    ├── src/
    │   ├── main.js                  # Vue 入口
    │   ├── App.vue                  # 根组件 + 全局特效
    │   ├── style.css                # 全局样式（暗黑玻璃态）
    │   └── components/
    │       ├── AppHeader.vue        # 渐变标题
    │       ├── UploadCard.vue       # 上传表单
    │       ├── PhotoGallery.vue     # 照片网格
    │       ├── PhotoCard.vue        # 照片卡片（3D 倾斜）
    │       ├── ViewModal.vue        # 查看大图弹窗
    │       └── EditModal.vue        # 编辑信息弹窗
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## API 接口

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/photos` | 获取所有照片列表 |
| GET | `/api/photos/{id}/file` | 下载照片文件 |
| POST | `/api/photos` | 上传新照片 |
| PUT | `/api/photos/{id}` | 更新名称/描述 |
| DELETE | `/api/photos/{id}` | 删除照片 |

## 快速开始

### 前置条件

- Java 17+
- Node.js 18+
- Maven 3.6+
- MySQL 8.0+

### 1. 创建数据库

```sql
CREATE DATABASE IF NOT EXISTS photodb CHARACTER SET utf8mb4;
```

### 2. 配置数据库

修改 `backend/src/main/resources/application-dev.yml` 中的用户名和密码。

### 3. 启动后端

```bash
cd backend
# cmd / bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
# PowerShell 需要用引号包裹
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

后端启动于 `http://localhost:8080`，Flyway 首次启动自动建表。

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

浏览器打开 Vite 提示的地址即可。

## 功能特性

- 照片上传（文件预览 + 缩放弹出动画）
- 照片网格浏览（卡片交错入场、3D 倾斜跟随鼠标）
- 照片查看（弹窗缩放动画）
- 照片编辑（名称和描述）
- 照片删除（卡片模糊消散动画）
- 上传成功脉冲发光反馈
- 暗黑玻璃态 UI（backdrop-filter 磨砂效果）
- 背景浮动光球 + 光标拖尾粒子
- 按钮点击波纹扩散
- 渐变文字 + 霓虹发光边框
- 数据持久化（MySQL + 本地文件系统）
- 数据库版本管理（Flyway）
- 多环境配置（dev / prod）

## 构建与部署

采用前后端分离部署：Nginx 托管前端静态文件，Java 运行后端服务。

### 构建

```bash
# 前端
cd frontend && npm run build          # 产出 dist/

# 后端
cd backend && mvn clean package -DskipTests   # 产出 target/demo-*.jar
```

### 上传到服务器

```bash
scp -r frontend/dist/* root@服务器IP:/opt/app/static/
scp backend/target/demo-*.jar  root@服务器IP:/opt/app/
```

### Nginx 配置

```nginx
server {
    listen 80;
    root /opt/app/static;
    index index.html;

    location /api {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 启动后端

```bash
ssh root@服务器IP "nohup java -jar /opt/app/demo-*.jar --spring.profiles.active=prod > /opt/app/app.log 2>&1 &"
```

## Spring Profile

| 文件 | 用途 |
|------|------|
| `application.properties` | 公共配置 |
| `application-dev.yml` | 开发环境 |
| `application-prod.yml` | 生产环境 |

```bash
# 开发
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 生产
java -jar demo-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

## 数据库迁移

表结构变更由 Flyway 管理：

1. 在 `backend/src/main/resources/db/migration/` 下创建新脚本（如 `V2__add_tags.sql`）
2. 重启应用，Flyway 自动执行未跑过的脚本

> 已执行过的迁移脚本不可修改，否则 Flyway 会因 checksum 不匹配拒绝启动。
