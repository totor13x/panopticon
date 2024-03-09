---
title: Синхронизация статусов в Telegram
date: 2024-03-09
tags: [macos, ios, python, telegram, javascript, betterdiscord]
---
В современном мире мессенджеры стали неотъемлемой частью нашей жизни. Они помогают нам оставаться на связи с друзьями, коллегами и близкими. Один из самых популярных мессенджеров - Telegram. Он предлагает множество функций, включая возможность установки пользовательских статусов. В этом посте мы рассмотрим, как автоматизировать процесс смены статусов в Telegram, чтобы вы могли максимально эффективно использовать эту функцию. 

![](https://digital-garden.website.yandexcloud.net/images/stuffs/scripts/telegram-status-sync/ca5e8fda-44ea-4a83-958d-9b6219601e99.gif)

Я пользуюсь телеграмом для общения с друзьями и коллегами. Часто бывает так, что я занят и не могу отвечать на сообщения, с недавних пор была в премиум подписку внедрена возможность установки статусов. Я решил автоматизировать процесс смены статусов, аналогично тому как работает фокусирование в iMessage.

Репозиторий с кодом доступен на [GitHub](https://github.com/totor13x/telegram-sync-emoji).

## Что нам понадобится

Для автоматизации процесса смены статусов в Telegram нам понадобится:
- Python 3
- iOS 12+
- Telegram Premium

В целом iphone не обязателен, но в моем случае я использую его, подвязав изменения статусов к автоматизации фокусирования во время работы.

## Начнем

1. Установите Python 3, если у вас его нет. Вы можете скачать его с [официального сайта](https://www.python.org/downloads/). В случае мака, он уже установлен и вам не нужно ничего делать.
2. Установите библиотеку telethon и dotenv, которая позволит нам взаимодействовать с Telegram API. Для этого выполните команду:
```bash
pip install telethon
pip install python-dotenv
```
3. Создайте новое приложение в [Telegram API](https://my.telegram.org/apps). Вам понадобится API_ID и API_HASH, которые вы получите при создании приложения.
4. Создайте файл `.env` и добавьте в него следующие строки:
```env
API_ID=your_api_id
API_HASH=your_api_hash
ACC_TOKEN=
```
5. Создайте файл `creating_session.py` и добавьте в него следующий код:
```python
import os

from dotenv import load_dotenv

from telethon.sync import TelegramClient
from telethon.sessions import StringSession

load_dotenv('.env')

api_id = os.environ.get('API_ID')
api_hash = os.environ.get('API_HASH')

with TelegramClient(StringSession(), api_id, api_hash) as client:
    print(client.session.save())
```
6. Запустите файл `creating_session.py`. Вам будет предложено ввести номер телефона и код подтверждения. После этого в консоли появится строка. Это наша сессия, по которой будет происходить авторизация. Скопируйте эту строку, и вставьте в файл `.env` в переменную `ACC_TOKEN`.

Сейчас нам требуется определить какие именно эмодзи мы будем использовать в статусах. Сложность здесь заключается в том, что нам надо предварительно подготовить их ID. На текущий момент я не знаю где именно можно взять полный список эмодзи с их ID, но я знаю, что можно взять их текущего статуса. Вот пример как это можно сделать:
1. Откройте телеграм и установите статус с эмодзи.
2. Запустите файл `get_emojis.py`, который я написал для получения ID эмодзи:
```python
import os

from dotenv import load_dotenv

from telethon.sync import TelegramClient
from telethon.sessions import StringSession

load_dotenv('.env')

api_id = os.environ.get('API_ID')
api_hash = os.environ.get('API_HASH')
acc_token = os.environ.get('ACC_TOKEN')

with TelegramClient(StringSession(acc_token), api_id, api_hash) as client:
    print(client.get_me().emoji_status.document_id)
```
3. Вам будет выведен ID эмодзи, который вы установили в статусе. Скопируйте его куда-нибудь, он нам понадобится. Далее можно повторить действия для всех эмодзи, которые вы хотите использовать.

Теперь у нас есть все необходимые данные для автоматизации смены статусов. В целом как именно деплоить это на сервере - это уже вопрос второстепенный, я предоставлю базовый пример как это можно сделать на Flask.

1. Установите `pip install flask` и `pip install nest_asyncio`. Создайте файл `endpoint.py` и добавьте в него следующий код:
```python
from flask import Flask, request
from dotenv import load_dotenv
import os
from telethon.sync import TelegramClient
from telethon.sessions import StringSession
from telethon import functions, types
import nest_asyncio


load_dotenv('.env')

app = Flask(__name__)
nest_asyncio.apply()

api_id = int(os.getenv('API_ID'))
api_hash = os.getenv('API_HASH')
acc_token = os.getenv('ACC_TOKEN')

statuses = {
    "default": 5841403144604487992,
    "work": 5246772116543512028,
    "snooze": 5247100325059370738,
}

@app.route('/set_status', methods=['GET'])
def set_status():
    try:
        set_status = request.args.get('status', default="default")

        if set_status not in statuses:
            return {"error": "Invalid status"}, 400

        with TelegramClient(StringSession(acc_token), api_id, api_hash) as client:
            result = client(functions.account.UpdateEmojiStatusRequest(
                emoji_status=types.EmojiStatus(
                    document_id=statuses[set_status]
                )
            ))
    
            return {"result": result and "ok" or "fail"}
    except BaseException:
        return {"error": "not handled"}, 500

if __name__ == "__main__":
    app.run(debug=True)
```
2. Запустите файл `endpoint.py`. После этого вы сможете отправлять GET запросы на `http://127.0.0.1:5000/set_status?status=work` и ваш статус в телеграме изменится на статус `work`.
```bash
curl --request GET --url 'http://127.0.0.1:5000/set_status?status=work'
```
3. Деплойте этот код на сервер, и вы сможете менять статусы в телеграме из любого места, где есть доступ к интернету.
4. Также можно добавить авторизацию, чтобы не каждый мог менять статусы. Для этого стоит почитать про [Flask-HTTPAuth](https://flask-httpauth.readthedocs.io/en/latest/) или использовать обычную проверку токена в запросе.

Теперь перейдем к настройкам автоматизации фокусирования во время работы. В моем случае я использую iPhone, поэтому я буду рассматривать настройки для него.
1. В первую очередь нужно создать команду. [Моя база](https://www.icloud.com/shortcuts/939f8d2c9168462c9ec65b678f4e4eb5) или скриншот ниже:
![](https://digital-garden.website.yandexcloud.net/images/stuffs/scripts/telegram-status-sync/2fab1c15-7e3d-491a-978c-7b66237081a8.png)
2. Далее нужно создать автоматизацию, я буду создавать для режима "Не беспокоить". В моем случае для скрипта это статус Work.
![](https://digital-garden.website.yandexcloud.net/images/stuffs/scripts/telegram-status-sync/05cb611b-096a-4891-bbd8-854e57c5e75d.jpg)
3. Теперь достаточно будет переключить фокусирование во время работы на режим "Не беспокоить", и статус в телеграме изменится на Work.
![](https://digital-garden.website.yandexcloud.net/images/stuffs/scripts/telegram-status-sync/ca5e8fda-44ea-4a83-958d-9b6219601e99.gif)

## Деплой
Для деплоя можно использовать любой сервер, на котором можно запустить Flask. В случае того, что у вас нет возможности использовать сервер, можно использовать [Heroku](https://www.heroku.com). Он предоставляет бесплатный тариф, который вполне подойдет для наших целей. Для деплоя на Heroku вам понадобится создать файл `Procfile` и добавить в него следующую строку:
```bash
web: python endpoint.py
```
Также вам понадобится создать файл `runtime.txt` и добавить в него версию Python:
```bash
python-3.8.6
```
После этого вам нужно зарегистрироваться на Heroku, создать новое приложение и деплоить ваш код на сервер. После этого вы сможете менять статусы в телеграме из любого места, запуская команду отдельно или дорабатывая автоматизацию под свои нужды.

## Заключение
В этом посте мы рассмотрели, как автоматизировать смену статусов в Telegram. Мы создали сервер на Flask, который позволяет менять статусы в телеграме, отправляя GET запросы. Также мы настроили автоматизацию в iOS, чтобы менять статус в телеграме при включении режима "Не беспокоить". 

В качестве бонуса я оставлю скрипт для смены статуса на эмодзи игры с помощью плагина BetterDiscord:
```javascript
export default class SyncTelegram {
    url = new URL('http://127.0.0.1:5000/status')

    constructor() {
        const status = 'default'

        this.url.searchParams.set('status', status)

    }
    async updateQuery(status = 'default') {
        this.url.searchParams.set('status', status)

        const response = await BdApi.Net.fetch(this.url.href, {
            method: 'POST'
        })

        return response
    }
    
    async changeStatus(e) {
        if (e.games.length > 0) {
            const game = e.games[0]
            if (game.name.includes('dota 2')) {
                this.updateQuery('dota')
            }
        } else {
            this.updateQuery()
        }
    }

    async start() {
        BdApi.findModuleByProps('subscribe', '_subscriptions').subscribe('RUNNING_GAMES_CHANGE', (e) => this.changeStatus(e))
    }
    stop() {
        BdApi.findModuleByProps('subscribe', '_subscriptions').unsubscribe('RUNNING_GAMES_CHANGE', (e) => this.changeStatus(e))

    }
}
```
![](https://digital-garden.website.yandexcloud.net/images/stuffs/scripts/telegram-status-sync/f61bb6a4-3139-4f56-ad54-638ea1e341e0.gif)

## Специфические случаи
- Вообще можно не использовать отдельный сервер на фласке, можно использовать AWS Lambda, Google Cloud Functions, Azure Functions, лично я использую именно AWS Lambda, но это уже совсем другая история.
- По поводу фокусирования "Сон" честно говоря не знаю как его использовать правильно. У данного фокусирования кажется сломана автоматизация, работает только в случае запуска режима сна, другие случаи не работают. Снимаю с себя ответственность за это, возможно это баг в iOS, но я не уверен.
- Для работы с плагином BetterDiscord вам понадобится установить его, а также установить Node.js и npm. Я не знаю как это работает на Windows, да и сам пост не ориентирован на Windows, но в целом должно работать. Возможно нужно будет поменять условия плагина.
- Весь код опубликовал в репозитории [GitHub](https://github.com/totor13x/telegram-sync-emoji), там вы сможете найти более актуальную версию кода, а также примеры для AWS Lambda и Flask. Возможно будет обновляться, возможно не будет.