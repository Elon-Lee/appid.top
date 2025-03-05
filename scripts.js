document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
        const faqItem = item.parentElement;
        faqItem.classList.toggle('active');
    });
});

// 获取当前日期
function getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// 获取当前年份
function getCurrentYear() {
    return new Date().getFullYear();
}

// 插入日期到标题中
document.getElementById('page-title').innerText = webname +  ' - 最新免费共享账号' +` ${getCurrentDate()}  ` ;
document.getElementById('time').innerText = webname +  ' - 免费共享账号 - ' +` ${getCurrentDate()}  ` ;

// 白名单域名数组
var whitelist = ["A.com", "B.com", "C.com"];

// 目标跳转域名
var targetDomain = "baidu.com";

// 当前页面的域名
var currentDomain = window.location.hostname;

// 检查当前域名是否在白名单中
if (whitelist.indexOf(currentDomain) === -1) {
    // 不在白名单中，进行跳转
    window.location.href = "http://" + targetDomain;
}



// 插入年份到页脚中
document.getElementById('footer').innerText = `© `+webname +` 版权所有 ${getCurrentYear()}`;


// 复制到剪贴板功能
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showCopyAlert();
    }, function(err) {
        alert('复制失败: ', err);
    });
}

// 显示复制成功提示框
function showCopyAlert() {
    const alertBox = document.getElementById('copy-alert');
    alertBox.style.display = 'block';
    alertBox.style.opacity = '1';
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 500);
    }, 1000);
}

// 更新ID卡片的状态和样式
function updateIDCard(idData, statusElementId, countryElementId, timeElementId, usernameButtonId, passwordButtonId) {
    const statusElement = document.getElementById(statusElementId);
    const statusMessage = idData.status === 1 ? idData.msg : '❌ 此ID状态异常，请联系客服';
    statusElement.innerText = statusMessage;
    statusElement.className = idData.status === 1 ? 'status-normal' : 'status-error';
    document.getElementById(countryElementId).innerText = idData.country;
    document.getElementById(timeElementId).innerText = `检测时间：${idData.time}`;
    document.getElementById(usernameButtonId).setAttribute('onclick', `copyToClipboard('${idData.username}')`);
    document.getElementById(passwordButtonId).setAttribute('onclick', `copyToClipboard('${idData.password}')`);

    if (idData.status !== 1) {
        document.getElementById(usernameButtonId).className = 'button button-error';
        document.getElementById(passwordButtonId).className = 'button button-error';
    } else {
        document.getElementById(usernameButtonId).className = 'button button-normal';
        document.getElementById(passwordButtonId).className = 'button button-normal';
    }
}

// 刷新ID卡片的功能，并限定10秒内只能刷新一次
function refreshIDCard(statusElementId, countryElementId, timeElementId, usernameButtonId, passwordButtonId, buttonElement) {
    if (buttonElement.disabled) {
        return;
    }
    buttonElement.disabled = true;
    const url = buttonElement.getAttribute('data-url');
    let countdown = 10;
    buttonElement.innerText = `刷新成功(${countdown})`;
    const interval = setInterval(() => {
        countdown--;
        buttonElement.innerText = `刷新成功(${countdown})`;
        if (countdown === 0) {
            clearInterval(interval);
            buttonElement.innerText = '刷新';
        }
    }, 1000);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const idData = data[0];
            updateIDCard(idData, statusElementId, countryElementId, timeElementId, usernameButtonId, passwordButtonId);
        })
        .catch(error => console.error('Error fetching ID data:', error))
        .finally(() => {
            setTimeout(() => {
                buttonElement.disabled = false;
            }, 10000);
        });
}


