# Описание проекта
Этот проект включает фронтенд на React и бэкэнд на .NET, которые взаимодействуют через REST API. В этом руководстве описано, как объединить эти две части и развернуть их на IIS.

## Предварительные требования
1. Установленный IIS
2. Установленный Node.js и npm
3. Скомпилированный бэкэнд
4. MSSQL сервер для базы данных

### Настройка базы данных
1. Создайте базу данных для вашего приложения.

**Используйте следующий скрипт для создания необходимых таблиц:**

```
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    Patronymic NVARCHAR(100),
    BirthDate DATE,
    Job NVARCHAR(100)
);

CREATE TABLE Cards (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Number NVARCHAR(20),
    FullName NVARCHAR(100),
    ExpDate NVARCHAR(5),
    CVC INT,
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);
```

### Настройка и сборка фронтенда
1. Создайте React проект:
npx create-react-app Name_Project
2. Перейдите в директорию вашего React проекта.
cd Name_Project
3. Установите зависимости и выполните сборку проекта.
npm install axios react-router-dom
npm run build

#### Переместите содержимое папки build в директорию, предназначенную для вашего веб-приложения на IIS.

### Настройка IIS
1. Создание сайта в IIS
- Откройте диспетчер IIS.
- Щелкните правой кнопкой мыши на "Сайты" и выберите "Добавить веб-сайт".
- Укажите имя сайта, путь к директории build и порт (например, 81).

2. Настройка проверки подлинности
- В диспетчере IIS выберите ваш сайт.
- Перейдите в раздел "Проверка подлинности" и отключите "Анонимная проверка подлинности".
- Включите "Проверка подлинности Windows" или другую необходимую проверку подлинности.

3. Настройка файла web.config
Создайте файл web.config в корневой папке build и вставьте в него следующее содержание:

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Правило для маршрутизации всех запросов, не являющихся файлами, в приложение React -->
        <rule name="React Routes" stopProcessing="true">
          <!-- Совпадение с любым URL -->
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <!-- Условие: URL не является файлом -->
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <!-- Условие: URL не является директорией -->
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <!-- Действие: Переписать URL на корневой путь приложения -->
          <action type="Rewrite" url="/" />
        </rule>
        <!-- Правило для проксирования API-запросов на бэкэнд -->
        <rule name="API Proxy" stopProcessing="true">
          <!-- Совпадение с URL, начинающимся с "api/" -->
          <match url="^(api/.*)$" />
          <!-- Действие: Переписать URL на соответствующий URL бэкэнда -->
          <action type="Rewrite" url="http://localhost:80/{R:1}" />
        </rule>
      </rules>
    </rewrite>
    <staticContent>
      <!-- Настройка MIME-типа для JSON файлов -->
      <mimeMap fileExtension=".json" mimeType="application/json" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <!-- Разрешение кросс-доменных запросов от любого источника -->
        <add name="Access-Control-Allow-Origin" value="*" />
        <!-- Разрешение следующих методов HTTP: GET, POST, PUT, DELETE, OPTIONS -->
        <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS" />
        <!-- Разрешение заголовка Content-Type в кросс-доменных запросах -->
        <add name="Access-Control-Allow-Headers" value="Content-Type" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

#### Описание:
React Routes Rule (Правило для маршрутизации в React)
match url=".*": Совпадение с любым URL.
conditions: Условия, которые должны быть выполнены для применения правила.
action type="Rewrite" url="/": Переписать URL на корневой путь приложения (/), чтобы все запросы обрабатывались React приложением.
API Proxy Rule (Правило для проксирования API-запросов)

match url="^(api/.*)$": Совпадение с URL, начинающимся с api/.
action type="Rewrite" url="http://localhost:80/{R:1}": Переписать URL на соответствующий URL бэкэнда, запуская его на http://localhost:80/. {R:1} используется для передачи остальной части URL после api/.
Static Content (Статическое содержимое)

mimeMap fileExtension=".json" mimeType="application/json": Установка MIME-типа для файлов с расширением .json как application/json.

HTTP Protocol (HTTP Протокол)
customHeaders: Настройка пользовательских заголовков HTTP.
Access-Control-Allow-Origin: Разрешить кросс-доменные запросы от любого источника (*).
Access-Control-Allow-Methods: Разрешить методы HTTP: GET, POST, PUT, DELETE, OPTIONS.
Access-Control-Allow-Headers: Разрешить заголовок Content-Type в кросс-доменных запросах.
Эти правила обеспечивают правильную маршрутизацию всех запросов в React приложение и проксирование API-запросов на бэкэнд.

### Настройка прав доступа
1. Щелкните правой кнопкой мыши на директорию вашего сайта в проводнике Windows и выберите "Свойства".
2. Перейдите на вкладку "Безопасность" и добавьте учетную запись, под которой работает пул приложений IIS (например, IIS_IUSRS), с правами чтения.

### Перезагрузка IIS
Перезагрузите IIS, чтобы изменения вступили в силу.

### Запуск бэкэнда
1. Разместите скомпилированный бэкэнд на вашем сервере.
2. Убедитесь, что бэкэнд настроен для прослушивания на порту 80 или другом порту, указанном в web.config для проксирования запросов.

### Проверка работоспособности
1. Откройте браузер и перейдите на http://localhost:81.
2. Убедитесь, что фронтенд загружается и все маршруты работают корректно.
3. Проверьте, что API запросы проксируются на бэкэнд и возвращают ожидаемые результаты.