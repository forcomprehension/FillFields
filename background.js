/**
 * @param {Object} info
 * @param {tabs.Tab} tab
 */
var onClickHandler = function(info, tab)
{
    var menuTitle = getItemTitleByID(contextMenus, info.menuItemId);

    var messagePass = {
        editable: info.editable,
        title: menuTitle
    };

    chrome.tabs.sendMessage(tab.id, messagePass);
};

var contextMenus = [
  /*  {
        "id": "first",
        "title": "blah-blah",
        "nextLevel": [
            {
                "id": "first_child",
                "title": "first Child"
            }
        ]
    },
    {
        "id": "second",
        "title": "blah-blah 2"
    }*/
];

/**
 * Building context menu from plain object
 *
 * @param {object}           menuLevel
 * @param {String|undefined} parentID
 *
 * @return undefined
 */
var buildContextMenu = function (menuLevel, parentID)
{
    menuLevel.forEach(function(element) {
        var nextLevel;

        element.contexts = ["editable"];

        var passingObject = {
            'id': element.id,
            'title': element.title,
            'contexts': ['editable']
        };


        if (parentID != undefined) {
            passingObject.parentId = parentID;
        }

        chrome.contextMenus.create(passingObject);

        if (element.hasOwnProperty("nextLevel") && element.nextLevel.length) {
            buildContextMenu(element.nextLevel, element.id);
        }
    });
};

/**
 * Get context menu title by menuItemID
 *
 * @param {object} menuLevel
 * @param {string} needle
 *
 * @return string
 */
var getItemTitleByID = function (menuLevel, needle)
{
    var len = menuLevel.length;
    var element;

    for (var i = 0; i < len; i++) {
        element = menuLevel[i];

        if (element.id == needle) {
            return element.title;
        }

        if (element.hasOwnProperty("nextLevel") && element.nextLevel.length) {
            var result = getItemTitleByID(element.nextLevel, needle);

            if (result) {
                return result;
            }
        }
    }
};

/**
 * Sets contextMenus value
 *
 * @param {JSON} data
 */
function setContextMenus(data)
{
    contextMenus = JSON.parse(data);

    buildContextMenu(contextMenus);
}

chrome.storage.sync.get('texts', function(data) {
    if (data.hasOwnProperty('texts')) {
        setContextMenus(data.texts);
    }
});

chrome.storage.onChanged.addListener(function(data) {
    if (data.hasOwnProperty('texts')) {
        chrome.contextMenus.removeAll();
        setContextMenus(data.texts.newValue);
    }
});

chrome.contextMenus.onClicked.addListener(onClickHandler);

