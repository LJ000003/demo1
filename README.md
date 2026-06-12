# 照片管理系统

一个前后端分离的全栈应用，提供照片上传、浏览、编辑和删除功能。

## 技术栈

- **后端**: Java 17 + Spring Boot 3.3 + JPA + H2 数据库
- **前端**: JavaScript + Vite
- **文件存储**: 本地文件系统

## 项目结构

```
├── backend/              # Spring Boot 后端服务
│   ├── src/main/java/    # 源代码
│   │   └── com/example/demo/
│   │       ├── DemoApplication.java     # 应用入口
│   │       ├── PhotoController.java     # REST API 控制器
│   │       ├── PhotoService.java        # 业务逻辑层
│   │       ├── PhotoRepository.java     # 数据访问层
│   │       └── Photo.java               # 数据实体
│   ├── src/main/resources/
│   │   ├── application.properties       # 配置文件
│   │   └── static/                      # 静态资源
│   ├── uploads/                         # 上传的图片存储目录
│   └── pom.xml                          # Maven 配置
│
└── frontend/             # Vite + JavaScript 前端
    ├── src/
    │   ├── main.js       # 应用入口、事件处理
    │   ├── style.css     # 样式
    │   └── index.html    # HTML 模板
    ├── package.json      # NPM 配置
    └── vite.config.js    # Vite 配置
```

## API 接口

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/api/photos` | 获取所有照片列表 |
| GET | `/api/photos/{id}` | 获取照片元数据 |
| GET | `/api/photos/{id}/file` | 下载照片文件 |
| POST | `/api/photos` | 上传新照片 |
| PUT | `/api/photos/{id}` | 更新照片信息（名称/描述） |
| DELETE | `/api/photos/{id}` | 删除照片 |

## 快速开始

### 前置条件

- Java 17+
- Node.js 16+
- Maven 3.6+

### 运行后端

```bash
cd backend
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

- REST API: `http://localhost:8080/api/photos`
- H2 控制台: `http://localhost:8080/h2-console`

### 运行前端

```bash
cd frontend
npm install
npm run dev
```

按 Vite 提示打开浏览器访问前端应用

## 功能特性

✅ 照片上传（支持文件预览）  
✅ 照片浏览（网格布局展示）  
✅ 照片编辑（修改名称和描述）  
✅ 照片删除  
✅ 文件下载  
✅ 数据持久化（H2 数据库）  
✅ 限制上传文件大小（10MB）  

## 配置说明

后端配置文件：`backend/src/main/resources/application.properties`

```properties
server.port=8080                          # 服务器端口
spring.datasource.url=jdbc:h2:...         # H2 数据库连接
spring.servlet.multipart.max-file-size=10MB  # 最大文件大小
photo.upload-dir=uploads                  # 图片存储目录
```

## 开发和构建

### 构建前端生产版本

```bash
cd frontend
npm run build
```

### 构建后端 JAR 包

```bash
cd backend
mvn clean package
```

生成的 JAR 包位于 `backend/target/demo-backend-0.0.1-SNAPSHOT.jar`