var template = document.getElementById('template');
var container = document.getElementById('container');

var menuIdsCounter = 0;

function addRow(value)
{
    var newRow = template.firstElementChild.cloneNode(true);
    container.appendChild(newRow); 
    
    if (value) {
        newRow.querySelector('textarea').value = value;
    }
}

function removeRow()
{
    var row = this.parentNode;
    if (row.previousElementSibling == null) {
        return;  // Do not remove first element
    }
    row.remove();
}

function save()
{
    var textareaList = container.querySelectorAll('textarea');
    var dataList = [];
    var currentID;

    for (var key in textareaList) {
        if (textareaList[key] instanceof HTMLTextAreaElement) {
            currentID = 'menuID_' + (++menuIdsCounter);

            dataList.push({
                'id'   : currentID,
                'title': textareaList[key].value
            });
        }
    }   

    var jsonData = JSON.stringify(dataList);

    chrome.runtime.lastError = undefined;
    chrome.storage.sync.set({'texts': jsonData});
}

//Window Onload 
(function() {

    chrome.storage.sync.get('texts', function (data) {
        if (data && data.hasOwnProperty('texts') && data.texts) {
            var dataList = JSON.parse(data.texts);

            if (dataList.length) {
                dataList.forEach(function(menuItem) {
                    addRow(menuItem.title);
                });

                return;
            }
        }

        addRow();
    });

})();


var targets = {
    'i.plus.action': addRow,
    'i.minus.action': removeRow,
    'button#save': save
};

// Delegate Events
document.addEventListener('click', function(event) {
    var target = event.target;
    
    for (; target != document && target; target = target.parentNode) {
        for (var selector in targets) {
            if (targets.hasOwnProperty(selector)) {
                if (target.webkitMatchesSelector(selector)) {
                    targets[selector].call(target);
                    break;
                }
            }
        }
    }
}, true);