var selectors = [
    'textarea',
    'input[type=password]',
    'input[type=text]',
    'input[type=name]',
    'input[type=email]',
    'input[type=tel]',
    'input[type=url]',
    'input[type=number]',
    'input[type=search]'
].join(', ');

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    var activeElement = document.activeElement;

    if (activeElement && activeElement.webkitMatchesSelector(selectors) || activeElement.type === 'text') {
        activeElement.value = message.title;
    }
});