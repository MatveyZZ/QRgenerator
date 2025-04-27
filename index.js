const download = document.querySelector(".download");
// Находим элемент с классом "download" (кнопка загрузки)

const dark = document.querySelector(".dark");
// Находим элемент с классом "dark" (поле выбора темного цвета)

const light = document.querySelector(".light");
// Находим элемент с классом "light" (поле выбора светлого цвета)

const qrContainer = document.querySelector("#qr-code");
// Находим контейнер для отображения QR-кода по его ID

const qrText = document.querySelector(".qr-text");
// Находим поле ввода текста для генерации QR-кода

const shareBtn = document.querySelector(".share-btn");
// Находим кнопку для совместного использования QR-кода

const sizes = document.querySelector(".sizes");
// Находим выпадающий список для выбора размера QR-кода

const defaultUrl = "https://github.com/MatveyZZ";
// Устанавливаем URL по умолчанию для QR-кода

let colorLight = "#fff",
// Переменная для хранения светлого цвета QR-кода
    colorDark = "#000",
// Переменная для хранения темного цвета QR-кода
    text = defaultUrl,
// Переменная для хранения текста, который будет закодирован в QR-код
    size = 300; 
// Переменная для хранения размера QR-кода

// Добавляем обработчики событий для различных элементов
dark.addEventListener("input", handleDarkColor);
// При изменении цвета темной части QR-кода вызываем функцию handleDarkColor

light.addEventListener("input", handleLightColor);
// При изменении цвета светлой части QR-кода вызываем функцию handleLightColor

qrText.addEventListener("input", handleQRText);
// При изменении текста в поле ввода вызываем функцию handleQRText

sizes.addEventListener("change", handleSize);
// При изменении размера QR-кода вызываем функцию handleSize

shareBtn.addEventListener("click", handleShare);
// При нажатии на кнопку "Share" вызываем функцию handleShare

async function generateQRCode() {
    // Асинхронная функция для генерации QR-кода
    qrContainer.innerHTML = "";
    // Очищаем контейнер для QR-кода
    new QRCode("qr-code", {
        // Создаем новый QR-код
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    download.href = await resolveDataUrl();
    // Устанавливаем ссылку для загрузки QR-кода, получая URL изображения
}

function handleDarkColor(e) {
    // Функция для обработки изменения темного цвета
    colorDark = e.target.value;
    // Обновляем переменную colorDark значением из поля выбора
    generateQRCode();
    // Генерируем новый QR-код с обновленным цветом
}

function handleLightColor(e) {
    // Функция для обработки изменения светлого цвета
    colorLight = e.target.value;
    // Обновляем переменную colorLight значением из поля выбора
    generateQRCode();
    // Генерируем новый QR-код с обновленным цветом
}

function handleQRText(e) {
    // Функция для обработки изменения текста QR-кода
    const value = e.target.value;
    // Получаем текущее значение из поля ввода
    text = value;
    // Обновляем переменную text значением из поля ввода
    if (!value) {
        // Если поле ввода пустое
        text = defaultUrl; 
        // Устанавливаем текст по умолчанию
    }
    generateQRCode();
    // Генерируем новый QR-код с обновленным текстом
}

async function handleShare() {
    // Асинхронная функция для обработки совместного использования QR-кода
    setTimeout(async () => {
        // Устанавливаем таймаут для выполнения кода
        try {
            const base64url = await resolveDataUrl();
            // Получаем URL изображения QR-кода в формате base64
            const blob = await (await fetch(base64url)).blob();
            // Получаем Blob-объект из URL изображения
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            // Создаем новый файл с именем "QRCode.png" и типом из Blob
            await navigator.share({
                // Используем API для совместного использования
                files: [file],
                title: text,
            });
            // Передаем файл и заголовок для совместного использования
        } catch (error) {
            alert("Your browser doesn't support sharing.");
            // Если произошла ошибка, выводим сообщение о том, что браузер не поддерживает совместное использование
        }
    }, 100);
}

function handleSize(e) {
    // Функция для обработки изменения размера QR-кода
    size = e.target.value;
    // Обновляем переменную size значением из выпадающего списка
    generateQRCode();
    // Генерируем новый QR-код с обновленным размером
}

function resolveDataUrl() {
    // Функция для получения URL изображения QR-кода в формате base64
    return new Promise((resolve, reject) => {
        // Возвращаем новый промис
        setTimeout(() => {
            // Устанавливаем таймаут для выполнения кода
            const img = document.querySelector("#qr-code img");
            // Находим изображение QR-кода в контейнере
            if (img.currentSrc) {
                // Если у изображения есть текущий источник
                resolve(img.currentSrc);
                // Разрешаем промис с текущим источником изображения
                return;
            }
            const canvas = document.querySelector("canvas");
            // Находим элемент canvas на странице
            resolve(canvas.toDataURL());
            // Разрешаем промис с URL изображения в формате base64 из canvas
        }, 50);
    });
}

// Вызываем функцию для генерации QR-кода при загрузке страницы
generateQRCode();