/**供网站使用，对浏览器的要求较低
 *
 */
$.showLoading = function () {
    $.hideTooltip();
    var loadingDom = '<div class="loadingDiv"><div class="loadingImg"><img style="vertical-align: middle" src="/corePub/loading.gif" width="30px" height="30px"/></div></div>';
    $('html,body').append(loadingDom);
    $('.loadingDiv').show();
    $('html,body').css('overflow', 'hidden');
}
$.hideLoading = function () {
    $('.loadingDiv').fadeOut("");
    $(" .loadingDiv").remove();
    $('html,body').css('overflow', 'visible');
}

$.initCore3Tree = function (domObj) {
    var activeNodeVal = $(domObj.domId).attr("activeNode");
    var openedNodeVal = JSON.parse($(domObj.domId).attr("openedNode"));

    $(domObj.domId + ' .open > table > tbody > tr').each(function (index, obj) {
        openedNodeVal[$(obj).attr("treeId")] = true;
    });

    $(domObj.domId + ' li:has(ol)').find(' > ol > li').hide('slow');
    $(domObj.domId + " .corePli > table > tbody > tr > .col1 > i").addClass('glyphicon glyphicon-triangle-right');

    var node = $(domObj.domId + ' li:has(ol) > table > tbody > tr > .col1 > i');
    node.removeClass('glyphicon-triangle-right').addClass('glyphicon-plus');
    node.unbind("click").bind("click", function (e) {
        var children = $(e.target).parent().parent().parent().parent().parent().find(' >ol > li');
        if (children.is(":visible")) {
            children.hide('slow');
            $(e.target).removeClass('glyphicon-minus').addClass('glyphicon-plus');
        } else {
            children.show('slow');
            $(e.target).removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
        openedNodeVal = {};
        $(domObj.domId + ' .glyphicon-minus').each(function (index, openedObj) {
            openedNodeVal[$(openedObj).parent().parent().attr("treeId")] = true;
        });
        $(domObj.domId).attr("openedNode", JSON.stringify(openedNodeVal));
        e.stopPropagation();
    });
    $(domObj.domId + ' .corePli > table').unbind('click').bind('click', function (e) {
        $(domObj.domId + ' .corePli > table').removeClass("active");
        $(e.target).parents("table").addClass("active");
        $(domObj.domId).attr("activeNode", $(e.target).parents("table").find(' tr').attr("treeId"));
    });

    for (var aaaaa in openedNodeVal) {
        var openNode = $(domObj.domId + ' tr[treeId=' + aaaaa + '] ');
        var children = openNode.parent().parent().parent().find(' >ol > li');
        children.show('slow');
        openNode.find(" .col1 > i").removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
    $(domObj.domId + ' .corePli > table').removeClass("active");
    if (activeNodeVal != "") {
        var activeNode = $(domObj.domId + ' tr[treeId=' + activeNodeVal + '] ');
        $(activeNode).parents("table").addClass("active");
        $(domObj.domId + ' .active').parents('li').show('slow');
        $(domObj.domId + ' .active').parents('li > table').addClass('active');
    }
};

$.showTooltip = function (ifSucess, coreHelpDom, targetDom, errMsg) {
    $.hideTooltip();
    var addHtml = '';
    var cls = "coreHelpTooltipS";
    if (!ifSucess) {
        cls = "coreHelpTooltipE";
    }
    addHtml += '<div class="' + cls + ' tooltip fade ' + $(coreHelpDom).attr("data-placement") + ' in coreHelpTooltip" role="tooltip"  style="display: block;">';
    addHtml += '    <div class="arrow tooltip-arrow" style="left: 10px;"></div>';
    addHtml += '    <div class="content tooltip-inner">' + errMsg + '</div>';
    addHtml += '</div>';
    $(targetDom).after(addHtml);
}

$.hideTooltip = function () {
    $(" .coreHelpTooltip").remove();
}

$.setInitDoObjP = function (domObj, key, value) {
    var initDoObjP = jQuery.parseJSON($(domObj.domId).attr("initDoObjP"));
    initDoObjP[key] = value;
    $(domObj.domId).attr("initDoObjP", JSON.stringify(initDoObjP));
    domObj.doObj.p[key] = value;
};

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

$.getGuid = function () {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


function Core3Workflow(domId) {
    this.domId = "#" + domId;
    this.forms = {};
    this.doObj = {
        "DO_TYPE": "",
        "d": {},
        "p": {},
        "w3": {
            "bus": {}
        }
    };
    this.helpDimTreeSel = {};
    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.load = load;
    function load() {
        var Res = {};
        // t.doObj.DO_TYPE = "wGetSta";
        // $.ajax({
        //     type: "post",
        //     url: '/corePub/w3.jsp',
        //     dataType: "json",
        //     async: false,
        //     data: {
        //         "doObj": JSON.stringify(t.doObj)
        //     },
        //     success: function (data) {
        //         var wk = t.doObj.w3.wk;
        //         if (data.s) {
        //             for (var wkKey in wk) {
        //                 wk[wkKey]["sta"]["crtPiId"] = "";
        //                 wk[wkKey]["sta"]["crtTaskId"] = "";
        //                 for (var i = 0; i < data.r.length; i++) {
        //                     if (wkKey == data.r[i]["WK_KEY"]) {
        //                         wk[wkKey]["sta"]["crtPiId"] = data.r[i]["WK_PIID"]
        //                         wk[wkKey]["sta"]["crtTaskId"] = data.r[i]["WK_TASKID"]
        //                         break;
        //                     }
        //                 }
        //             }
        t.doObj.DO_TYPE = "wGetNext";
        $.ajax({
            type: "post",
            url: '/corePub/w3.jsp',
            dataType: "json",
            timeout: 1000000,
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data.s) {
                    $(t.domId + " .coreDataDic").html(data.d);
                    $(t.domId + " .coreDataDic .wkSubMitBtn").unbind("click").bind("click", function (e) {
                        $(t).trigger("click", [JSON.parse($(e.target).attr("wk")), $(e.target).attr("formDomsCls")]);
                    });
                    //重新初始化下面所有的form
                    $(t.domId + " .Core3Form").each(function () {
                        t.forms[$(this).attr("id")] = new Core3Form($(this).attr("id"));
                        t.forms[$(this).attr("id")].init();
                    });
                    //重新初始化一下下拉选项：
                    $(t.domId + " .coreTree").each(function (index, allObj) {
                        t.helpDimTreeSel[$(allObj).attr("id")] = new HelpDimTreeSel($(allObj).attr("id"));
                        /* $(t.helpDimTreeSel[$(allObj).attr("id")]).bind("change", function (event, data) {
                         });*/
                        t.helpDimTreeSel[$(allObj).attr("id")].init();
                    });
                    $(t).trigger("loadS", []);
                } else {
                    $(t).trigger("loadF", []);
                }
            },
            error: function () {
                $(t).trigger("loadF", []);
            }
        });
        //         } else {
        //
        //         }
        //     },
        //     error: function () {
        //         //alert("error");
        //     }
        // });
        return Res;
    }

    this.set = set;
    function set(defaultVal) {
    }

    this.init = init;
    function init(wkJsonObj) {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        t.doObj.w3 = wkJsonObj;
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();
    }

    this.get = get;
    function get(formDomsCls) {
        var Res = {
            "crtDo": {
                "submitType": "",
                "crtNodeId": "",
                "crtLineId": "",
                "nextNodeId": "",
                "nextNodeUserId": {
                    "dicVal": {}
                },
                "a": false,
                "b": false
            }
        };

        var wk = JSON.parse($(t.domId + " .coreDataDic .wkSubMitBtn[formDomsCls='" + formDomsCls + "']").attr("wk"));
        Res.crtDo = wk;
        var dicVal = {"dicVal": {}};
        Res.doObj = t.doObj;
        Res.d = {};
        if (wk["formId"] != undefined) {
            if (wk["formId"] in t.forms) {
                Res.d = t.forms[wk["formId"]].get();
            }
            if (t.helpDimTreeSel["coreTree_" + wk["formId"]] != undefined) {
                dicVal = t.helpDimTreeSel["coreTree_" + wk["formId"]].get();
            }
        }
        Res.crtDo.nextNodeUserId = dicVal;
        return Res;
    }

    this.validate = validate;
    function validate() {
        var theRet = true;
        return theRet;
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        // t.doObj = {
        //     "DO_TYPE": "",
        //     "YC_ID": "",
        //     "d": {},
        //     "p": {}
        // };
        // var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        // for (var key in initDoObjP) {
        //     t.doObj.p[key] = initDoObjP[key];
        // }

        setBusinessSta(0);
        var business = {
            "InfoId": "",
            "InfoName": "",                          //订单名称（订单机构下产品等）  如果为信息，此内容为信息名称，将出现在待办表中；
            "InfoTable": ""             //主要在待办已办中使用，用来表单页地址或者模态框的远程FORM地址
        };
        setBusiness(business);
        //清空crtDo
    }

    this.setBusiness = setBusiness;
    function setBusiness(doObj) {
        var Res = {};
        if (t.doObj.w3.bus == undefined) {
            t.doObj.w3.bus = {};
        }
        for (var key in doObj) {
            t.doObj.w3.bus[key] = doObj[key];
        }
        return Res;
    }

    this.setBusinessSta = setBusinessSta;
    function setBusinessSta(businessSta) {
        var Res = true;
        t.doObj.busSta = businessSta;
        try {
            t.doObj.w3.busSta = businessSta;
        } catch (e) {
        }
        return Res;
    }

    this.setLoginUser = setLoginUser;
    function setLoginUser(UserId) {
        if (t.doObj.w3.session == undefined) {
            t.doObj.w3.session = {
                "loginUserId": "kermit"
            }
        } else {
            t.doObj.w3.session = {
                "loginUserId": UserId
            };
        }
        return t.doObj.w3.session;
    }

    this.goNext = goNext;
    function goNext(doObj) {
        var Res = {};
        Res['s'] = false;
        var ifContinue = true;
        Res['Step'] = "submitB";
        if (ifContinue && doObj.crtDo.b) {
            doObj.DO_TYPE = "submitB";
            $.ajax({
                type: "Post",
                url: $(t.domId).attr("ajaxUrl"),
                dataType: "json",
                async: false,
                data: {
                    "doObj": JSON.stringify(doObj)
                },
                success: function (data) {
                    Res = data;
                    if (data.s) {
                        ifContinue = true;
                        $(t).trigger("submitBS", [data, doObj]);
                        if ("business" in data) {
                            setBusiness(data["business"]);
                        }
                    } else {
                        ifContinue = false;
                        $(t).trigger("submitBF", [data, doObj]);
                    }
                }
            });
        }
        if (ifContinue) {
            Res['Step'] = "wGoNext";
            doObj.DO_TYPE = "wGoNext";
            ifContinue = true;
            $.ajax({
                type: "Post",
                url: "/corePub/w3.jsp",
                dataType: "json",
                timeout: 60000,
                async: false,
                data: {
                    "doObj": JSON.stringify(doObj)
                },
                success: function (data) {
                    Res = data;
                    if (data.s) {
                        ifContinue = true;
                        $(t).trigger("wGoNextS", ["wGoNext", data]);
                    } else {
                        ifContinue = false;
                        $(t).trigger("wGoNextF", ["wGoNext", data]);
                    }
                }
            });
        }
        if (ifContinue && doObj.crtDo.a) {
            Res['Step'] = "submitA";
            doObj.DO_TYPE = "submitA";
            $.ajax({
                type: "Post",
                url: $(t.domId).attr("ajaxUrl"),
                dataType: "json",
                timeout: 60000,
                async: false,
                data: {
                    "doObj": JSON.stringify(doObj)
                },
                success: function (data) {
                    Res = data;
                    if (data.s) {
                        ifContinue = true;
                        $(t).trigger("submitAS", ["submitA", data]);
                    } else {
                        ifContinue = false;
                        $(t).trigger("submitAF", ["submitA", data]);
                    }
                }
            });

        }
        Res['doType'] = doObj.DO_TYPE;
        Res['s'] = ifContinue;
        return Res;
    }
}
function Core3Form(dicDomId) {
    this.domId = "#" + dicDomId;
    this.formDoms = {};
    this.doObj = {
        "DO_TYPE": "",
        "YC_ID": "",
        "d": {},
        "p": {}
    };
    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.submit = submit;
    function submit(doType, doObj) {
        var Res = {};
        Res['s'] = false;
        t.doObj.d = get();
        t.doObj.DO_TYPE = doType;
        for (var key in doObj) {
            t.doObj[key] = doObj[key];
        }
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                Res = data;
                Res['doType'] = doType;
                if (data.s) {
                    $(t).trigger("submitS", [doType, data]);
                } else {
                    $(t).trigger("submitF", [doType, data]);
                }
            }
        });
        return Res;
    }

    this.load = load;
    function load(doObj) {
        var Res = {};
        Res['s'] = false;
        t.doObj.DO_TYPE = "detail";
        for (var key in doObj) {
            t.doObj[key] = doObj[key];
        }
        resetFormDom();
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                Res = data;
                if (data.s) {
                    if (data.d.YC_JSON != undefined) {
                        set(data.d.YC_JSON);
                    }
                    $(t).trigger("loadS", [data]);
                } else {
                    $(t).trigger("loadF", [data]);
                }
            }
        });
        t.doObj.DO_TYPE = "";
        return Res;
    }

    this.set = set;
    function set(defaultVal) {
        for (var dbKeyName in defaultVal) {
            if (t.formDoms[dbKeyName] != undefined) {
                t.formDoms[dbKeyName].set(defaultVal[dbKeyName]);
            }
        }
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        reset();
        t.formDoms = {};
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        $(t.domId + " ." + $(t.domId).attr("myDomsCls")).each(function (index, obj) {
            if ($(obj).attr("id") == undefined) {
                $(obj).attr("id", $.getGuid());
            }
            var coreHelpType = $(obj).attr("coreHelpType");
            var formDomName = $(obj).attr("name");

            var formDomId = $(obj).attr("id");
            if ("Core3Input" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Input(formDomId);
            } else if ("Core3TextArea" == coreHelpType) {
                t.formDoms[formDomName] = new Core3TextArea(formDomId);
            } else if ("Core3TreeSelect" == coreHelpType) {
                t.formDoms[formDomName] = new Core3TreeSelect(formDomId);
            }else if ("Core3TreeSelectInput" == coreHelpType) {
              t.formDoms[formDomName] = new Core3TreeSelectInput(formDomId);
            } else if ("Core3Check" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Check(formDomId);
            }  else if ("Core3CheckBox" == coreHelpType) {
                t.formDoms[formDomName] = new Core3CheckBox(formDomId);
            } else if ("Core3Img" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Img(formDomId);
            } else if ("Core3Radio" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Radio(formDomId);
            } else if ("Core3DataTime" == coreHelpType) {
                t.formDoms[formDomName] = new Core3DataTime(formDomId);
            } else if ("Core3TreeCheck" == coreHelpType) {
                t.formDoms[formDomName] = new Core3TreeCheck(formDomId);
            } else if ("Core3Tree" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Tree(formDomId);
            } else if ("Core3ListBootstrapTable" == coreHelpType) {
                t.formDoms[formDomName] = new Core3ListBootstrapTable(formDomId);
            } else if ("Core3Ue" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Ue(formDomId);
            } else if ("Core3List" == coreHelpType) {
                t.formDoms[formDomName] = new Core3List(formDomId);
            }
            t.formDoms[formDomName].init();

            $(t.formDoms[formDomName]).bind("validateF", function (event, data) {
                $(t).trigger("validateF", []);
            });
            $(t.formDoms[formDomName]).bind("validateS", function (event, data) {
                if (validate()) {
                    $(t).trigger("validateS", []);
                } else {
                    $(t).trigger("validateF", []);
                }
            });
            if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
            if ($(t.domId).attr("core3Disabled") == "true") disable();
            if ($(t.domId).attr("core3Hiddened") == "true") hide();
        });
    }

    this.get = get;
    function get() {
        var Res = {
            "s": false,
            "b": {},
            "d": {}
        };
        if (validate()) {
            Res.s = true;
            for (var formDomName in t.formDoms) {
                Res['d'][formDomName] = t.formDoms[formDomName].get();
                var dbFieldName = t.formDoms[formDomName].getDbFieldName();
                if (dbFieldName != "") {
                    Res['b'][formDomName] = dbFieldName;
                }
            }
        }
        return Res;
    }

    this.validate = validate;
    function validate() {
        var theRet;
        var validateS = true;
        for (var formDomName in t.formDoms) {
            if (!t.formDoms[formDomName].localValidate()) {
                validateS = false;
                break;
            }
        }
        if (validateS) {
            $(t).trigger("validateS", []);
        } else {
            $(t).trigger("validateF", []);
        }

        theRet = validateS;
        return theRet;
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {

    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.resetFormDom = resetFormDom;
    function resetFormDom() {
        for (var formDomName in t.formDoms) {
            t.formDoms[formDomName].reset();
        }
    }

    this.reset = reset;
    function reset() {
        t.doObj = {
            "DO_TYPE": "",
            "YC_ID": "",
            "d": {},
            "p": {}
        };
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        for (var formDomName in t.formDoms) {
            t.formDoms[formDomName].reset();
        }

        $(t).trigger("resetS", ["resetS"]);
    }
}
function Core3Alert(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "d": {},
        "p": {}
    };

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();
        hide();
    }

    this.set = set;
    function set(data) {
        $(t.domId).hide("slow");
        $(t.domId).find(" > div").removeClass();
        $(t.domId).find(" > div").addClass("alert alert-" + data['msgTpye']);
        $(t.domId).find(" > div strong").html(data.msg);
        $(t.domId).find(" > div span").html(data.msgMore);
        $(t.domId).find(" > div").show("slow");
        $(t.domId).show("slow");
    }

    this.get = get;
    function get() {
        return "";
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        return true;
    }

    this.validate = validate;
    function validate() {
        return true;
    }


    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
        $(t.domId + ' input').removeAttr("disabled");
    }

    this.disable = disable;
    function disable() {
        $(t.domId).attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId).hide();
    }
}
function Core3Input(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");
    this.defaultVal = $(this.domId + ' input').val();

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();
        $(t.domId + ' input').unbind(t.validateOn).bind(t.validateOn, function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
                $(t).trigger("validateS", []);

            } else {
                $(t).trigger("validateF", []);
            }
        })
    }

    this.set = set;
    function set(defaultVal) {
        $(t.domId + ' input').val(defaultVal);
        localValidate();
    }

    this.get = get;
    function get() {
        return $(t.domId + ' input').val();
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        if (t.coreRegExp == undefined) {
            return true;
        }
        var crtErrMsg = t.errMsg;
        var localValidate = t.coreRegExp.test(get());
        ret = localValidate;
        if (ret) {
            $(t.domId + ' input').removeClass("coreErr");
        } else {
            if (!$($(t.domId + ' input')).hasClass("coreErr")) {
                $($(t.domId + ' input')).addClass("coreErr");
            }
        }
        return ret;
    }

    this.validate = validate;
    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        if (localValidate()) {
            if (t.validateAjaxUrl != "") {
                t.doObj.d["val"] = get();
                $.ajax({
                    type: "Post",
                    url: t.validateAjaxUrl,
                    async: false,
                    dataType: "json",
                    data: {
                        "doObj": JSON.stringify(t.doObj)
                    },
                    success: function (data) {
                        if (data["s"]) {
                            ret = true;
                        } else {
                            crtErrMsg = data.msg + ":" + data.msgMore;
                        }
                    }
                });
            } else {
                ret = true;
            }
        }
        if (ret) {
            $(t.domId + ' input').removeClass("coreErr");
            $.hideTooltip();

        } else {
            $.showTooltip(false, $(t.domId), $(t.domId + ' input'), crtErrMsg);
            if (!$($(t.domId + ' input')).hasClass("coreErr")) {
                $($(t.domId + ' input')).addClass("coreErr");
            }

        }
        return ret;
    }


    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + ' input').attr("readonly", true);
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + ' input').removeAttr("readonly");
    }

    this.enable = enable;
    function enable() {
        $(t.domId + ' input').removeAttr("disabled");

    }

    this.disable = disable;
    function disable() {
        $(t.domId + ' input').attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + ' input').val(t.defaultVal);
    }
}
function Core3Ue(dicDomId) {
    this.domId = "#" + dicDomId;
    this.tableId = $(this.domId + " .coreDataDic > div").attr("id");
    this.doObj = {
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");
    this.ueditor = '';


    var t = this;

    this.init = init;
    function init() {
        // if (formDomObj != undefined) {
        //     t.formDomObj = formDomObj;
        // }
        $.showLoading();
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        UE.delEditor(t.tableId);
        t.ueditor = UE.getEditor(t.tableId);

        t.ueditor.addListener("ready", function () {
            $.hideLoading();
        });

        t.ueditor.addListener(t.validateOn, function () {
            if (validate()) {
                $(t).trigger("change", [get()]);
                $(t).trigger("validateS", []);
            } else {
                $(t).trigger("validateF", []);
            }
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();
    }

    this.validate = validate;
    function validate() {
        var ret = true;
        return ret;
    }

    this.get = get;
    function get() {
        //return $(t.domId + ' input').val();
        return t.ueditor.getContent();
    }

    this.set = set;
    function set(defaultVal) {
        t.ueditor.ready(function () {
            t.ueditor.setContent(defaultVal);
        });
        localValidate();

    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.validate = validate;
    function validate() {
        var ret = true;
        return ret;
    }


    this.readOnly = readOnly;
    function readOnly() {
        t.ueditor.ready(function () {
            t.ueditor.setDisabled();
        });

    }

    this.writeAble = writeAble;
    function writeAble() {
        //$(t.domId + ' input').removeAttr("readonly");
    }

    this.enable = enable;
    function enable() {
        t.ueditor.ready(function () {
            t.ueditor.setEnabled();
        });
    }

    this.disable = disable;
    function disable() {
        t.ueditor.ready(function () {
            t.ueditor.setDisabled();
        });
    }

    this.hide = hide;
    function hide() {
        t.ueditor.ready(function () {
            t.ueditor.setHide();
        });
    }

    this.show = show;
    function show() {
        t.ueditor.ready(function () {
            t.ueditor.setShow();
        });
    }

    this.reset = reset;
    function reset() {
        t.ueditor.ready(function () {
            // t.ueditor.reset();
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes();
            //t.ueditor.setContent("<p style=\"margin-bottom: 16px;white-space: normal;text-align: center\"><strong>标题</strong><br></p><p style=\"margin-bottom: 16px;white-space: normal;text-align: center\"><br></p><hr><p style=\"white-space: normal; text-align: center;\"><span style=\"font-size: 14px;\">发布时间："+currentdate+"</span></p>");
            t.ueditor.setContent("");

        });
    }

}
function Core3TextArea(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        $(t.domId + ' textarea').unbind(t.validateOn).bind(t.validateOn, function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
                $(t).trigger("validateS", []);
            } else {
                $(t).trigger("validateF", []);
            }
        })
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.set = set;
    function set(defaultVal) {
        $(t.domId + ' textarea').val(defaultVal);
        localValidate();
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.get = get;
    function get() {
        return $(t.domId + ' textarea').val();
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        if (t.coreRegExp == undefined) {
            return true;
        }
        var crtErrMsg = t.errMsg;
        var localValidate = t.coreRegExp.test(get().replace(/<\/?.+?>/g, "").replace(/[\r\n]/g, ""));
        ret = localValidate;
        if (ret) {
            $(t.domId + ' textarea').removeClass("coreErr");
        } else {
            if (!$($(t.domId + ' textarea')).hasClass("coreErr")) {
                $($(t.domId + ' textarea')).addClass("coreErr");
            }
        }
        return ret;
    }

    this.validate = validate;
    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        if (localValidate()) {
            if (t.validateAjaxUrl != "") {
                t.doObj.d["val"] = get();
                $.ajax({
                    type: "Post",
                    url: t.validateAjaxUrl,
                    async: false,
                    dataType: "json",
                    data: {
                        "doObj": JSON.stringify(t.doObj)
                    },
                    success: function (data) {
                        if (data["s"]) {
                            ret = true;
                        } else {
                            crtErrMsg = data.msg + ":" + data.msgMore;
                        }
                    }
                });
            } else {
                ret = true;
            }
        }
        if (ret) {
            $(t.domId + ' textarea').removeClass("coreErr");
            $.hideTooltip();


        } else {
            $.showTooltip(false, $(t.domId), $(t.domId + ' textarea'), crtErrMsg);
            if (!$($(t.domId + ' textarea')).hasClass("coreErr")) {
                $($(t.domId + ' textarea')).addClass("coreErr");
            }

        }
        return ret;
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + ' textarea').attr("readonly", true);
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + ' textarea').removeAttr("readonly");
    }

    this.enable = enable;
    function enable() {
        $(t.domId + ' textarea').removeAttr("disabled");
    }

    this.disable = disable;
    function disable() {
        $(t.domId + ' textarea').attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + ' textarea').val('');
    }
}
function Core3ListBootstrapTable(dicDomId) {
    this.domId = "#" + dicDomId;
    this.tableId = "#" + $(this.domId + " .coreDataDic > table").attr("id");
    this.doObj = {
        "d": {},
        "p": {}
    };
    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    function detailFormatterDemo(index, row) {
        var html = [];
        $.each(row, function (key, value) {
            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
        });
        return html.join('');
    }

    this.submit = submit;
    function submit(doType, doObj) {
        var Res = {};
        Res['s'] = false;
        t.doObj.d = getSelections();
        t.doObj.DO_TYPE = doType;
        for (var key in doObj) {
            t.doObj[key] = doObj[key];
        }
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                Res = data;
                Res['doType'] = doType;
                if (data.s) {
                    $(t).trigger("submitS", [doType, data]);
                } else {
                    $(t).trigger("submitF", [doType, data]);
                }
            }
        });
        return Res;
    }

    this.rowStyle = rowStyle;
    function rowStyle(row, index) {
        return {
            classes: 'text-nowrap another-class',
            css: {"cursor": "pointer;"}
        };
    }

    function responseHandlerDemo(res) {
        $.each(res.rows, function (i, row) {
            row.STA = "<button>aaaaa</button>";
        });
        return res;
    }

    function getQueryParams(params) {
        t.doObj.p['desc'] = params.order;
        t.doObj.p['orderBy'] = params.sort;
        t.doObj.p['theRecordIndex'] = params.offset;
        t.doObj.p['pageSize'] = params.limit;
        t.doObj.p['search'] = params.search;
        return {"doObj": JSON.stringify(t.doObj)};
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var obj = $(t.domId);
        var onlyLeaf = $(obj).attr("onlyLeaf");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        var timer = null;
        $(t.tableId).bootstrapTable({
            onRefresh: function (params) {
                $(t.tableId).bootstrapTable("refreshOptions", {
                    url: $(t.domId).attr("ajaxUrl"),
                    queryParams: getQueryParams
                });
            },
            onClickRow: function (row, $element, field) {
                timer && clearTimeout(timer);
                timer = setTimeout(function () {
                    $(t).trigger("click", [$(row), $(field)]);
                }, 300);
            },
            onDblClickRow: function (row, $element, field) {
                timer && clearTimeout(timer);
                $(t).trigger("dblclick", [$(row), $(field)]);
            }
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.load = load;
    function load() {
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        t.doObj.DO_TYPE = "list";
        $(t.tableId).bootstrapTable("refresh", {silent: true});
    }

    this.set = set;
    function set(defaultVal) {
        load();
    }

    this.getSelections = getSelections;
    function getSelections() {
        var Res = [];
        Res = $(t.tableId).bootstrapTable('getSelections');
        return Res;
    }

    this.get = get;
    function get() {
        var Res = [];
        Res = $(t.tableId).bootstrapTable('getData');
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        var Res = true;
        // $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
        //     Res[index] = $(obj).attr("value");
        // });
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        if (ifTrue == "true") {
        } else {
        }
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
    }
}
function Core3Check(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");
    this.name = $(this.domId).attr("name");

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        $(t.domId).unbind("focus").bind("focus", function (e) {
            localValidate();
        });
        $(t.domId).unbind("blur").bind("blur", function (e) {
            $.hideTooltip();
        });
        $(t.domId + ' input').unbind(t.validateOn).bind(t.validateOn, function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
            }
        })
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.set = set;
    function set(defaultVal) {
        if (defaultVal == 1) {
            // $(t.domId + ' input').attr("checked", "true");
            $("#" + $(t.domId).attr("name")).prop("checked", true);
        } else {
            // $(t.domId + ' input').removeAttr("checked");
            $("#" + $(t.domId).attr("name")).prop("checked", false);
        }
        localValidate();
    }

    this.get = get;
    function get() {
        var ret = 0;
        if ($(t.domId + ' input').is(':checked')) {
            ret = 1;
        }
        return ret;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        // var crtErrMsg = t.errMsg;
        // var localValidate = t.coreRegExp.test(get());
        // ret = localValidate;
        // if (ret) {
        //     $(t.domId).removeClass("coreErr");
        // } else {
        //     if (!$($(t.domId)).hasClass("coreErr")) {
        //         $($(t.domId)).addClass("coreErr");
        //     }
        // }
        ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        var local = localValidate();
        if (local && t.validateAjaxUrl != "") {
            t.doObj.d["val"] = get();
            $.ajax({
                type: "Post",
                url: t.validateAjaxUrl,
                async: false,
                dataType: "json",
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    if (data["s"]) {
                        ret = true;
                    } else {
                        crtErrMsg = data.msg + ":" + data.msgMore;
                    }
                }
            });
        }
        ret = local;
        if (ret) {
            $(t.domId + '').removeClass("coreErr");
            $(t).trigger("validateF", []);
            $.hideTooltip();
        } else {
            $.showTooltip(false, $(t.domId), $(t.domId), crtErrMsg);
            $(t).trigger("validateS", []);
            if (!$($(t.domId + '')).hasClass("coreErr")) {
                $($(t.domId + '')).addClass("coreErr");
            }
        }
        return ret;
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + ' input').attr("readonly", true);
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + ' input').removeAttr("readonly");
    }

    this.enable = enable;
    function enable() {
        $(t.domId + ' input').removeAttr("disabled");

    }

    this.disable = disable;
    function disable() {
        $(t.domId + ' input').attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $("#" + $(t.domId).attr("name")).prop("checked", false);
    }
}
function Core3CheckBox(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");
    this.name = $(this.domId).attr("name");

    var t = this;
    this.addCls = addCls;

    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;

    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;

    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        $(t.domId).unbind("focus").bind("focus", function (e) {
            localValidate();
        });
        $(t.domId).unbind("blur").bind("blur", function (e) {
            $.hideTooltip();
        });
        $(t.domId + ' input').unbind(t.validateOn).bind(t.validateOn, function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
            }
        })
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();
        //测试
        //set("生物,数学,语文,");

    }

    this.set = set;

    function set(defaultVal) {
        var express = defaultVal.split(','); //去掉它们之间的分割符“，”

        $(t.domId + ' input').each(function (index, obj) {
            for (var j = 0; j < express.length; j++) {
                if ($(obj).val() == express[j]) {
                    $(obj).prop("checked", true);
                }
                // else {
                //     $(obj).prop("checked", false);
                // }
            }
        });
        localValidate();
    }

    this.get = get;

    function get() {
        var ret = "";
        $(t.domId + ' input').each(function (index, obj) {
            if ($(obj).is(':checked')) {
                ret += $(obj).val() + ",";
            }
        });
        return ret;
    }

    this.getDbFieldName = getDbFieldName;

    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;

    function localValidate() {
        var ret = false;

        ret = true;
        return ret;
    }

    this.validate = validate;

    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        var local = localValidate();
        if (local && t.validateAjaxUrl != "") {
            t.doObj.d["val"] = get();
            $.ajax({
                type: "Post",
                url: t.validateAjaxUrl,
                async: false,
                dataType: "json",
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    if (data["s"]) {
                        ret = true;
                    } else {
                        crtErrMsg = data.msg + ":" + data.msgMore;
                    }
                }
            });
        }
        ret = local;
        if (ret) {
            $(t.domId + '').removeClass("coreErr");
            $(t).trigger("validateF", []);
            $.hideTooltip();
        } else {
            $.showTooltip(false, $(t.domId), $(t.domId), crtErrMsg);
            $(t).trigger("validateS", []);
            if (!$($(t.domId + '')).hasClass("coreErr")) {
                $($(t.domId + '')).addClass("coreErr");
            }
        }
        return ret;
    }

    this.readOnly = readOnly;

    function readOnly() {
        $(t.domId + ' input').attr("readonly", true);
    }

    this.writeAble = writeAble;

    function writeAble() {
        $(t.domId + ' input').removeAttr("readonly");
    }

    this.enable = enable;

    function enable() {
        $(t.domId + ' input').removeAttr("disabled");

    }

    this.disable = disable;

    function disable() {
        $(t.domId + ' input').attr("disabled", true);
    }

    this.hide = hide;

    function hide() {
        $(t.domId).hide();
    }

    this.show = show;

    function show() {
        $(t.domId).show();
    }

    this.reset = reset;

    function reset() {
        // $("#" + $(t.domId).attr("name")).prop("checked", false);
        $(t.domId + ' input').each(function (index, obj) {
            $(obj).prop("checked", false);
        });
    }
}
function Core3Radio(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        $(t.domId + ' input').unbind("change").bind("change", function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
            }
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.set = set;
    function set(defaultVal) {
        $(t.domId + ' input').each(function (index, obj) {
            if ($(obj).val() == defaultVal) {
                //$(obj).attr("checked", "true");
                $(obj).prop("checked", true);
            } else {
                //$(obj).removeAttr("checked");
                $(obj).prop("checked", false);
            }
        });
        localValidate();
    }

    this.get = get;
    function get() {
        var ret = "";
        $(t.domId + ' input').each(function (index, obj) {
            if ($(obj).is(':checked')) {
                ret = $(obj).val();
            }
        });
        return ret;

    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        if (t.coreRegExp == undefined) {
            ret = true;
            return ret;
        }
        var val = get();

        var localValidate = t.coreRegExp.test(get());
        ret = localValidate;
        if (ret) {
            $(t.domId).removeClass("coreErr");
        } else {
            if (!$($(t.domId)).hasClass("coreErr")) {
                $($(t.domId)).addClass("coreErr");
            }
        }
        return ret;
    }

    this.validate = validate;
    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        var localValidateSta = localValidate();
        ret = localValidateSta;
        if (localValidateSta && t.validateAjaxUrl != "") {
            t.doObj.d["val"] = get();
            $.ajax({
                type: "Post",
                url: t.validateAjaxUrl,
                async: false,
                dataType: "json",
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    if (data["s"]) {
                        ret = true;
                    } else {
                        crtErrMsg = data.msg + ":" + data.msgMore;
                    }
                }
            });
        }
        if (ret) {
            $(t.domId).removeClass("coreErr");
            $.hideTooltip();
            $(t).trigger("validateS", []);

        } else {
            $.showTooltip(false, $(t.domId), $(t.domId), crtErrMsg);
            if (!$($(t.domId)).hasClass("coreErr")) {
                $($(t.domId)).addClass("coreErr");
            }
            $(t).trigger("validateF", []);

        }
        return ret;
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + ' input').attr("readonly", true);
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + ' input').removeAttr("readonly");
    }

    this.enable = enable;
    function enable() {
        $(t.domId + ' input').removeAttr("disabled");

    }

    this.disable = disable;
    function disable() {
        $(t.domId + ' input').attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + ' input').each(function (index, obj) {
           // $(obj).removeAttr("checked");
            $(obj).prop("checked", false);
        });
    }
}
function Core3DataTime(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");
    this.defaultVal = $(this.domId + ' input').val();

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        $(t.domId + " .date").attr("data-date-format", $(t.domId).attr("data-date-format"));

        $(t.domId + ' .form_datetime').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1
        });
        $(t.domId + ' .form_date').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        });
        $(t.domId + ' .form_time').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: 0
        });
        $(t.domId + ' input').unbind(t.validateOn).bind(t.validateOn, function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
            }
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.set = set;
    function set(defaultVal) {
        $(t.domId + ' input').val(defaultVal);
        localValidate();
    }

    this.get = get;
    function get() {
        return $(t.domId + ' input').val();
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        if (t.coreRegExp == undefined) {
            return true;
        }
        var crtErrMsg = t.errMsg;
        var localValidate = t.coreRegExp.test(get());
        ret = localValidate;
        if (ret) {
            $(t.domId + ' input').removeClass("coreErr");
        } else {
            if (!$($(t.domId + ' input')).hasClass("coreErr")) {
                $($(t.domId + ' input')).addClass("coreErr");
            }
        }
        return ret;
    }

    this.validate = validate;
    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        if (localValidate()) {
            if (t.validateAjaxUrl != "") {
                t.doObj.d["val"] = get();
                $.ajax({
                    type: "Post",
                    url: t.validateAjaxUrl,
                    async: false,
                    dataType: "json",
                    data: {
                        "doObj": JSON.stringify(t.doObj)
                    },
                    success: function (data) {
                        if (data["s"]) {
                            ret = true;
                        } else {
                            crtErrMsg = data.msg + ":" + data.msgMore;
                        }
                    }
                });
            } else {
                ret = true;
            }
        }
        if (ret) {
            $(t.domId + ' input').removeClass("coreErr");
            $.hideTooltip();
            $(t).trigger("validateS", []);

        } else {
            $.showTooltip(false, $(t.domId), $(t.domId + ' input'), crtErrMsg);
            if (!$($(t.domId + ' input')).hasClass("coreErr")) {
                $($(t.domId + ' input')).addClass("coreErr");
            }
            $(t).trigger("validateF", []);

        }
        return ret;
    }


    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + ' input').attr("readonly", true);
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + ' input').removeAttr("readonly");
    }

    this.enable = enable;
    function enable() {
        $(t.domId + ' input').removeAttr("disabled");

    }

    this.disable = disable;
    function disable() {
        $(t.domId + ' input').attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.getNowFormatDate = getNowFormatDate;
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hours = date.getHours();
        var Minutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        if (Minutes >= 0 && Minutes <= 9) {
            Minutes = "0" + Minutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            getSeconds = "0" + getSeconds;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hours + seperator2 + Minutes
            + seperator2 + getSeconds;
        return currentdate;
    }

    this.reset = reset;
    function reset() {
        //$(t.domId + " .corePli1").val(getNowFormatDate());
        //$(t.domId + " .corePli > table > tbody > tr  .col2 > i").removeClass("glyphicon-ok-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-remove-sign")
        //$(t.domId + " .corePli > table > tbody > tr  .col2 > i").removeClass("glyphicon-ok-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-remove-sign");
        // var date = new Date();
        // var seperator1 = "-";
        // var seperator2 = ":";
        // var month = date.getMonth() + 1;
        // var strDate = date.getDate();
        // if (month >= 1 && month <= 9) {
        //     month = "0" + month;
        // }
        // if (strDate >= 0 && strDate <= 9) {
        //     strDate = "0" + strDate;
        // }
        // var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        //     + " " + date.getHours() + seperator2 + date.getMinutes();
        // $(t.domId + ' input').val(currentdate);
        $(t.domId + ' input').val(t.defaultVal);
        if (t.defaultVal == "") {
            $(t.domId + ' input').val(t.defaultVal);
        } else {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var strMinutes = date.getMinutes();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (strMinutes >= 0 && strMinutes <= 9) {
                strMinutes = "0" + strMinutes;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + strMinutes;
            $(t.domId + ' input').val(currentdate);
        }
    }
}
function Core3Tree(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "YC_ID": dicDomId,
        "d": {},
        "p": {}
    };
    var t = this;

    function disableCheck() {
        $(t.domId).find(' li > table > tbody > tr > .col3 > span').unbind("click");
    }

    function enableCheck() {
        var timer = null;
        var onlyLeaf = $(t.domId).attr("onlyLeaf");
        $(t.domId).find(' li > table > tbody > tr > .col3 > span').unbind("click").bind("click", function (e) {
            if (onlyLeaf == "true" && $(e.target).parent().parent().parent().parent().parent().has("ol").length > 0) {
                alert("请选择叶子节点");
            } else {
                timer && clearTimeout(timer);
                timer = setTimeout(function () {
                    $(t).trigger("click", [$(t.domId).attr("basePath") + $(e.target).parent().parent().attr("treeId")]);
                }, 300);
            }
        });
        $(t.domId).find(' li > table > tbody > tr > .col3 > span').unbind("dblclick").bind("dblclick", function (e) {
            if (onlyLeaf == "true" && $(e.target).parent().parent().parent().parent().parent().has("ol").length > 0) {
                alert("请选择叶子节点");
            } else {
                timer && clearTimeout(timer);
                $(t).trigger("dblclick", [$(t.domId).attr("basePath") + $(e.target).parent().parent().attr("treeId")]);
            }
        });
    }

    this.load = load;
    function load() {
        $(t.domId + " .coreDataDic").html("");
        var theRetDataBody = "";
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            async: false,
            dataType: "json",
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data["s"]) {
                    theRetDataBody += data.d;
                    $(t.domId + " .coreDataDic").html(theRetDataBody);
                    $.initCore3Tree(t);
                    enableCheck();
                }
            }
        });
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var obj = $(t.domId);
        var onlyLeaf = $(obj).attr("onlyLeaf");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        var theRetDataBody = "";
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            async: false,
            dataType: "json",
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data["s"]) {
                    theRetDataBody += data.d;
                    $(t.domId + " .coreDataDic").html(theRetDataBody);
                    $.initCore3Tree(t);
                    enableCheck();
                    if ($(obj).attr("readOnly") == "true") {
                        readOnly("true")
                    }
                }
            }
        });
    }

    this.active = active;
    function active(treeId) {
        $(t.domId).attr("activeNode", treeId);
    }

    this.set = set;
    function set(defaultVal) {
    }

    this.get = get;
    function get() {
        var Res = [];
        return Res;
    }

    this.validate = validate;
    function validate() {
        // var Res = [];
        // $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
        //     Res[index] = $(obj).attr("value");
        // });
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly() {
        disableCheck();
    }

    this.writeAble = writeAble;
    function writeAble() {
        enableCheck();
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.enable = enable;
    function enable() {
        enableCheck();
    }

    this.disable = disable;
    function disable() {
        disableCheck();
    }

    this.hide = hide;
    function hide() {
        $(t.domId).fadeOut();
    }

    this.show = show;
    function show() {
        $(t.domId).fadeIn();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + " .corePli > table > tbody > tr  .col2 > i").removeClass("glyphicon-ok-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-remove-sign")
    }
}
function Core3TreeCheck(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "p": {}
    };
    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    function disableCheck() {
        $(t.domId).find(' li > table > tbody > tr > .col2 > i').unbind("click");
        $(t.domId + " .coreFun ").unbind("click");
    }

    function addMinus() {
        $(t.domId).find('.corePli').each(function (index, allObj) {
            var ok = false;
            var remove = false;
            if ($(allObj).has("ol").length > 0) {
                if ($(allObj).find(" .corePli table >tbody>tr>.col2>i").hasClass("glyphicon-ok-sign")) {
                    ok = true;
                }
                if ($(allObj).find(" .corePli table >tbody>tr>.col2>i").hasClass("glyphicon-remove-sign")) {
                    remove = true;
                }
                if (ok == true && remove == true) {
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-remove-sign").removeClass("glyphicon-ok-sign").addClass("glyphicon-minus-sign");
                }
                if (ok == true && remove == false) {
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-minus-sign").removeClass("glyphicon-remove-sign").addClass("glyphicon-ok-sign");
                }
                if (ok == false) {
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-minus-sign").removeClass("glyphicon-ok-sign").addClass("glyphicon-remove-sign");
                }
            }
        });
    }

    function enableCheck() {
        $(t.domId).find(' li > table > tbody > tr > .col2 > i').unbind("click").bind("click", function (e) {
            var onleOne = $(t.domId).attr("onlyOne");
            if (onleOne == "true") {
                if ($(e.target).parent().parent().parent().parent().parent().has("ol").length > 0) {
                    alert("只允许选择一个，请选择叶子节点。")
                    return;
                }
                reset();
            }
            var checkEd = false;
            if ($(e.target).hasClass("glyphicon-remove-sign")) {
                checkEd = true;
            } else if ($(e.target).hasClass("glyphicon-ok-sign")) {
                checkEd = false;
            } else if ($(e.target).hasClass("glyphicon-ban-sign")) {
                checkEd = false;
            }
            $(e.target).removeClass("glyphicon-remove-sign").removeClass("glyphicon-minus-sign").removeClass("glyphicon-ok-sign");
            if (checkEd) {
                $(e.target).addClass("glyphicon-ok-sign");
            } else {
                $(e.target).addClass("glyphicon-remove-sign");
            }
            if ($(e.target).parents("table").parent().has("ol").length > 0) {
                if ($(e.target).hasClass("glyphicon-remove-sign")) {
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").removeClass("glyphicon-ok-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-remove-sign");
                } else if ($(e.target).hasClass("glyphicon-ok-sign")) {
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").removeClass("glyphicon-minus-sign").removeClass("glyphicon-remove-sign").addClass("glyphicon-ok-sign");
                }
            }
            addMinus();
            $(t).trigger("change", [get()]);
        });
        $(t.domId + " .glyphicon-remove").unbind("click").bind("click", function (e) {
            reset();
            $(t).trigger("change", [get()]);
        });
    }


    this.init = init;
    function init() {
        var obj = $(t.domId);
        var onlyLeaf = $(obj).attr("onlyLeaf");
        var onleOne = $(obj).attr("onlyOne");
        var coreFilter = $(obj).attr("coreFilter");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    function loadTree() {
        var theRetDataBody = "";
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            async: false,
            dataType: "json",
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data["s"]) {
                    theRetDataBody += "	 <div class='coreTree' id = '" + t.domId.substring(1) + "_TREE'>";
                    theRetDataBody += data.d;
                    theRetDataBody += "	 </div>";
                }
            }
        });
        $(t.domId + " .coreDataDic").html(theRetDataBody);
        $.initColTree(t.domId.substring(1) + "_TREE");
        $(t.domId).find(' li > table > tbody > tr > .col2 > i').addClass('glyphicon glyphicon-remove-sign');
        enableCheck();
    }

    function setTree(theTreeHtml) {
        $(t.domId + " .coreDataDic").html(theTreeHtml);
        $.initColTree(t.domId.substring(1) + "_TREE");
        $(t.domId).find(' li > table > tbody > tr > .col2 > i').addClass('glyphicon glyphicon-remove-sign');
        enableCheck();
    }

    this.set = set;
    function set(defaultVal) {
        reset();
        var dbVal = eval(defaultVal);
        $(t.domId + " .corePli > table > tbody > tr").each(function (index, allObj) {
            for (var i = 0; i < dbVal.length; i++) {
                if ($(t.domId).attr("basePath") + $(allObj).attr("treeId") == dbVal[i]) {
                    var checkEd = true;
                    $(allObj).find(" .col2 > i").removeClass("glyphicon-remove-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-ok-sign");
                }
            }
        });
        addMinus();
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        var Res = [];
        // $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
        //     Res[index] = $(obj).attr("value");
        // });
        return Res;
    }

    this.get = get;
    function get() {
        var Res = [];
        var i = 0;
        var basePath = $(t.domId).attr("basePath");
        $(t.domId).find('.corePli').each(function (index, allObj) {
            if ($(allObj).has("ol").length == 0 && $(allObj).find("> table > tbody > tr> .col2 > i").hasClass("glyphicon-ok-sign")) {
                Res[i] = basePath + $(allObj).find("> table > tbody > tr").attr("treeId");
                i++;
            }
        });
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }


    this.readOnly = readOnly;
    function readOnly() {
        disableCheck();
    }

    this.writeAble = writeAble;
    function writeAble() {
        enableCheck();
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + " .corePli > table > tbody > tr  .col2 > i").removeClass("glyphicon-ok-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-remove-sign")
    }
}
function Core3TreeSelect(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");

    var t = this;

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var obj = $(t.domId);
        var onlyLeaf = $(obj).attr("onlyLeaf");
        var onleOne = $(obj).attr("onlyOne");
        var coreFilter = $(obj).attr("coreFilter");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        if (onleOne != "true") {
            $(t.domId + " .dropdown-menu").unbind("click").bind("click", function (e) {
                e.stopPropagation();
            });
        }
        $(t.domId + " .dropdown-toggle .glyphicon-remove").unbind("click").bind("click", function (e) {
            $(t).trigger("change", [get()]);
            reset();
        });
        $(t.domId + " .coreTreeFilter").unbind("change").bind("change", function (e) {
            if ($(e.target).val() == "") {
                $(t.domId + " .corePli").fadeIn();
            } else {
                $(t.domId + " .corePli").fadeOut();
                $(t.domId + " .corePli .col3").each(function (index, allObj) {
                    if ($(allObj).html().indexOf($(e.target).val()) > -1) {
                        $(allObj).parents("li").fadeIn();
                    }
                });
            }

        });
        var theRetDataBody = "";
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

        if ($(t.domId).attr("ajaxUrl") != "") {
            $.ajax({
                type: "Post",
                url: $(t.domId).attr("ajaxUrl"),
                async: false,
                dataType: "json",
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    if (data["s"]) {
                        theRetDataBody += "	 <div class='coreTree' id = '" + dicDomId + "_TREE'>";
                        theRetDataBody += data.d;
                        theRetDataBody += "	 </div>";
                    }
                }
            });
            $(t.domId + " .coreDataDic").html(theRetDataBody);
        }
        $.initColTree(dicDomId + "_TREE");
        if (onlyLeaf == "true") {
            $(obj).find('.corePli').each(function (index, allObj) {
                $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("canSel");
                $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("cannotSel");
                if ($(allObj).has("ol").length > 0) {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("cannotSel");
                } else {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("canSel");
                }
            });
        } else {
            $(obj).find('.corePli > table > tbody > tr > .col3  > span').each(function (index, allObj) {
                $(allObj).removeClass("canSel");
                $(allObj).removeClass("cannotSel");
                $(allObj).addClass("canSel");
            });
        }

        $(t.domId + " .coreDataDic .coreTree .cannotSel").unbind("click").bind("click", function (e) {
            alert('本节点不能选择，请点击鼠标形状为手型的节点！');
        });

        $(t.domId + "").on("hidden.bs.dropdown", function () {
            $(t).trigger("changeEnd", [get()]);
        });

        $(t.domId + " .coreDataDic  .coreTree .canSel").unbind("click").bind("click", function (e) {
            var selText = "";
            $(e.target).parents(" .corePli ").find(" > table > tbody > tr").each(function (index, eobj) {
                if (index > 0) {
                    selText = selText + "-";
                }
                selText = selText + $(eobj).text();
            });
            var selValue = $(t.domId).attr("basePath") + $(e.target).parent().parent().attr("treeId");

            var addHtml = "<li value='" + selValue + "'><a>" + selText + "</a><span class='glyphicon glyphicon-remove'> </span></li>";

            var ifAdd = true;
            $(t.domId + " .coreDataDicSelEd > li").each(function (eval, obj) {
                if (selValue == $(obj).attr("value")) {
                    ifAdd = false;
                }
            });
            if (ifAdd) {
                if (onleOne == "true") {
                    $(t.domId + " .coreDataDicSelEd").html("")
                }
                $(t.domId + " .coreDataDicSelEd").append(addHtml);
                $(t.domId + " .coreDataDicSelEd > li > span").unbind("click").bind("click", function (e) {
                    $(e.target).parent().remove();
                    $(t).trigger("change", [get()]);
                });
                $(t).trigger("change", [get()]);
            }
        });
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        if (t.coreRegExp == undefined) {
            return true;
        }
        var crtErrMsg = t.errMsg;
        var localValidate = t.coreRegExp.test(get());
        ret = localValidate;
        if (ret) {
            $(t.domId).removeClass("coreErr");
        } else {
            if (!$(t.domId).hasClass("coreErr")) {
                $(t.domId).addClass("coreErr");
            }
        }
        return ret;
    }

    this.set = set;
    function set(defaultVal) {
        reset();
        var dbVal = eval(defaultVal);
        $(t.domId + " .corePli > table > tbody > tr").each(function (index, allObj) {
            for (var i = 0; i < dbVal.length; i++) {
                if ($(t.domId).attr("basePath") + $(allObj).attr("treeId") == dbVal[i]["v"]) {
                    var selText = "";
                    $(allObj).parents(" .corePli ").find(" > table > tbody > tr").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var addHtml = "<li value='" + dbVal[i]["v"] + "'><a>" + selText + "</a><span class='glyphicon glyphicon-remove'> </span></li>";
                    $(t.domId + " .coreDataDicSelEd").append(addHtml);
                }
            }
        });
        $(t.domId + " .coreDataDicSelEd > li > span").unbind("click").bind("click", function (e) {
            $(e.target).parent().remove();
            $(t).trigger("change", [get()]);
        });

    }

    this.validate = validate;
    function validate() {
        var Res = [];
        $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            Res[index] = $(obj).attr("value");
        });
        return Res;
    }

    this.get = get;
    function get() {
        var Res = [];
        $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            var node = {};
            node['v'] = $(obj).attr("value");
            node['n'] = $(obj).find(" > a ").html();
            Res[index] = node;
        });
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.disable = disable;
    function disable() {
        $(t.domId + " .coreDataDicRemove").html("");
        $(t.domId + " .coreDataDicDropDown").html("");
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        if (ifTrue == "true") {
            $(t.domId + " .coreDropDownFun").attr("data-toggle", "");
            $(t.domId + " .coreDataDicSelEd > li > span").fadeOut();
            $(t.domId + " .coreFun").fadeOut();
        } else {
            $(t.domId + " .coreDropDownFun").attr("data-toggle", "dropdown");
            $(t.domId + " .coreDataDicSelEd > li > span").fadeIn();
            $(t.domId + " .coreFun").fadeIn();
        }
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + " .coreDropDownFun").attr("data-toggle", "");
        $(t.domId + " .coreDataDicSelEd > li > span").fadeOut();
        $(t.domId + " .coreFun").fadeOut();
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + " .coreDropDownFun").attr("data-toggle", "dropdown");
        $(t.domId + " .coreDataDicSelEd > li > span").fadeIn();
        $(t.domId + " .coreFun").fadeIn();
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + " .coreDataDicSelEd").html("");
    }
}
function Core3TreeSelectInput(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");

    var t = this;

    this.addCls = addCls;

    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;

    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;

    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var obj = $(t.domId);
        var onlyLeaf = $(obj).attr("onlyLeaf");
        var onleOne = $(obj).attr("onlyOne");
        var coreFilter = $(obj).attr("coreFilter");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        if (onleOne != "true") {
            $(t.domId + " .dropdown-menu").unbind("click").bind("click", function (e) {
                e.stopPropagation();
            });
        }
        $(t.domId + " .dropdown-toggle .glyphicon-remove").unbind("click").bind("click", function (e) {
            $(t).trigger("change", [get()]);
            reset();
        });
        $(t.domId + " .coreTreeFilter").unbind("change").bind("change", function (e) {
            if ($(e.target).val() == "") {
                $(t.domId + " .corePli").fadeIn();
            } else {
                $(t.domId + " .corePli").fadeOut();
                $(t.domId + " .corePli .col3").each(function (index, allObj) {
                    if ($(allObj).html().indexOf($(e.target).val()) > -1) {
                        $(allObj).parents("li").fadeIn();
                    }
                });
            }

        });
        var theRetDataBody = "";
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

        if ($(t.domId).attr("ajaxUrl") != "") {
            $.ajax({
                type: "Post",
                url: $(t.domId).attr("ajaxUrl"),
                async: false,
                dataType: "json",
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    if (data["s"]) {
                        theRetDataBody += "	 <div class='coreTree' id = '" + dicDomId + "_TREE'>";
                        theRetDataBody += data.d;
                        theRetDataBody += "	 </div>";
                    }
                }
            });
            $(t.domId + " .coreDataDic").html(theRetDataBody);
        }
        $.initColTree(dicDomId + "_TREE");
        if (onlyLeaf == "true") {
            $(obj).find('.corePli').each(function (index, allObj) {
                $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("canSel");
                $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("cannotSel");
                if ($(allObj).has("ol").length > 0) {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("cannotSel");
                } else {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("canSel");
                }
            });
        } else {
            $(obj).find('.corePli > table > tbody > tr > .col3  > span').each(function (index, allObj) {
                $(allObj).removeClass("canSel");
                $(allObj).removeClass("cannotSel");
                $(allObj).addClass("canSel");
            });
        }

        $(t.domId + " .coreDataDic .coreTree .cannotSel").unbind("click").bind("click", function (e) {
            alert('本节点不能选择，请点击鼠标形状为手型的节点！');
        });

        $(t.domId + "").on("hidden.bs.dropdown", function () {
            $(t).trigger("changeEnd", [get()]);
        });

        $(t.domId + " .coreDataDic  .coreTree .canSel").unbind("click").bind("click", function (e) {
            var selText = "";
            $(e.target).parents(" .corePli ").find(" > table > tbody > tr").each(function (index, eobj) {
                if (index > 0) {
                    selText = selText + "-";
                }
                selText = selText + $(eobj).text();
            });
            var selValue = $(t.domId).attr("basePath") + $(e.target).parent().parent().attr("treeId");

            var addHtml = "<li value='" + selValue + "'><a>" + selText + "</a><span class='glyphicon glyphicon-remove'> </span></li>";

            var ifAdd = true;
            $(t.domId + " .coreDataDicSelEd > li").each(function (eval, obj) {
                if (selValue == $(obj).attr("value")) {
                    ifAdd = false;
                }
            });
            if (ifAdd) {
                if (onleOne == "true") {
                    $(t.domId + " .coreDataDicSelEd").html("")
                }
                $(t.domId + " .coreDataDicSelEd").append(addHtml);
                $(t.domId + " .coreDataDicSelEd > li > span").unbind("click").bind("click", function (e) {
                    $(e.target).parent().remove();
                    $(t).trigger("change", [get()]);
                });
                $(t).trigger("change", [get()]);
            }
        });
        //测试
      // set("主题分类1,主题分类2,主题分类3")
    }

    this.localValidate = localValidate;

    function localValidate() {
        var ret = false;
        if (t.coreRegExp == undefined) {
            return true;
        }
        var crtErrMsg = t.errMsg;
        var localValidate = t.coreRegExp.test(get());
        ret = localValidate;
        if (ret) {
            $(t.domId).removeClass("coreErr");
        } else {
            if (!$(t.domId).hasClass("coreErr")) {
                $(t.domId).addClass("coreErr");
            }
        }
        return ret;
    }

    this.set = set;

    function set(defaultVal) {
        reset();
        //转化input值 to array
      var express = defaultVal.split(';'); //去掉它们之间的分割符“;”
      var defaultValArray = [];
        for (var j = 0; j < express.length; j++) {
          defaultValArray.push({"v":express[j]});
        }
        var dbVal = eval(defaultValArray);
        $(t.domId + " .corePli > table > tbody > tr").each(function (index, allObj) {
            for (var i = 0; i < dbVal.length; i++) {
                if ($(t.domId).attr("basePath") + $(allObj).attr("treeId") == dbVal[i]["v"]) {
                    var selText = "";
                    $(allObj).parents(" .corePli ").find(" > table > tbody > tr").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var addHtml = "<li value='" + dbVal[i]["v"] + "'><a>" + selText + "</a><span class='glyphicon glyphicon-remove'> </span></li>";
                    $(t.domId + " .coreDataDicSelEd").append(addHtml);
                }
            }
        });
        $(t.domId + " .coreDataDicSelEd > li > span").unbind("click").bind("click", function (e) {
            $(e.target).parent().remove();
            $(t).trigger("change", [get()]);
        });

    }

    this.validate = validate;

    function validate() {
        var Res = [];
        $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            Res[index] = $(obj).attr("value");
        });
        return Res;
    }

    this.get = get;

    function get() {
        var ret = "";
        $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            // node['v'] = $(obj).attr("value");
            // node['n'] = $(obj).find(" > a ").html();
            // Res[index] = node;
          ret += $(obj).attr("value") + ";";
        });
        //去除最后一位字符";"
      ret = ret.substring(0,ret.lastIndexOf(";"))
      return ret;
    }

    this.getDbFieldName = getDbFieldName;

    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.disable = disable;

    function disable() {
        $(t.domId + " .coreDataDicRemove").html("");
        $(t.domId + " .coreDataDicDropDown").html("");
    }

    this.readOnly = readOnly;

    function readOnly(ifTrue) {
        if (ifTrue == "true") {
            $(t.domId + " .coreDropDownFun").attr("data-toggle", "");
            $(t.domId + " .coreDataDicSelEd > li > span").fadeOut();
            $(t.domId + " .coreFun").fadeOut();
        } else {
            $(t.domId + " .coreDropDownFun").attr("data-toggle", "dropdown");
            $(t.domId + " .coreDataDicSelEd > li > span").fadeIn();
            $(t.domId + " .coreFun").fadeIn();
        }
    }

    this.readOnly = readOnly;

    function readOnly() {
        $(t.domId + " .coreDropDownFun").attr("data-toggle", "");
        $(t.domId + " .coreDataDicSelEd > li > span").fadeOut();
        $(t.domId + " .coreFun").fadeOut();
    }

    this.writeAble = writeAble;

    function writeAble() {
        $(t.domId + " .coreDropDownFun").attr("data-toggle", "dropdown");
        $(t.domId + " .coreDataDicSelEd > li > span").fadeIn();
        $(t.domId + " .coreFun").fadeIn();
    }

    this.enable = enable;

    function enable() {
    }

    this.disable = disable;

    function disable() {
    }

    this.hide = hide;

    function hide() {
        $(t.domId).hide();
    }

    this.show = show;

    function show() {
        $(t.domId).show();
    }

    this.reset = reset;

    function reset() {
        $(t.domId + " .coreDataDicSelEd").html("");
    }
}
function Core3Model(domId, formPath, ifBackdrop, modalLg) {
    this.domId = '#' + domId;
    this.formPath = formPath;
    this.doObj = {
        "d": {},
        "p": {}
    };

    var t = this;

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }


    this.init = init;
    function init() {
        $.showLoading();
        $(t.domId).removeData('bs.modal');
        $(t.domId).remove();
        if ($(t.domId).length == 0) {
            var modelFrm = "";
            modelFrm += '<div class="modal fade" id="' + t.domId.substring(1) + '"><div class="modal-dialog ' + modalLg + '"><div class="modal-content"></div></div></div>';
            $("body").append(modelFrm);
        }
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        $(t.domId).removeData('bs.modal').modal({"remote": t.formPath, "show": false, "backdrop": ifBackdrop});
        $(t.domId).unbind("shown.bs.modal").bind("shown.bs.modal", function (event, data) {
            $(t).trigger("show", []);
        });
        $(t.domId).unbind("loaded.bs.modal").bind("loaded.bs.modal", function (event, data) {
            $.hideLoading();
            $(t).trigger("loaded", []);
        });
        $(t.domId).unbind("hidden.bs.modal").bind("hidden.bs.modal", function (event, data) {
            $(t).trigger("hide", []);
        });
    }

    this.load = load;
    function load(ifTop) {
        init(ifTop);
    }

    this.set = set;
    function set(defaultVal) {
    }

    this.get = get;
    function get() {
        var Res = [];
        return Res;
    }

    this.validate = validate;
    function validate() {
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {

    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).modal("hide");
    }

    this.show = show;
    function show() {
        $(t.domId).modal();
    }

    this.reset = reset;
    function reset() {
    }
}
function Core3Img(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "p": {}
    };
    this.coreRegExp = eval($(this.domId).attr("validateRegExp"));
    this.validateAjaxUrl = $(this.domId).attr("validateAjaxUrl");
    this.validateOn = $(this.domId).attr("validateOn");
    this.errMsg = $(this.domId).attr("data-content");

    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    function enableChange(e) {
        var fileUploadInput = $(e.target).find("input");
        $(fileUploadInput).click();
        $(fileUploadInput).unbind("change");
        $(fileUploadInput).val("");
        $(fileUploadInput).unbind("change").bind("change", function (e) {
            var helpfileUpload = new HelpfileUpload("page", $(e.target).attr("id"));
            helpfileUpload.FileUpload();
            $(helpfileUpload).unbind("uploadSuccess").bind("uploadSuccess", function (event, data) {
                if (data.s) {
                    $(t).trigger("change", ["fileUploadS", data]);
                    $(t).trigger("fileUploadS", ["fileUpload", data]);
                    $(t.domId + " .coreDataDic a ").attr("href", data.url);
                    $(t.domId + " .coreDataDic a > img ").attr("src", data.url);
                    $(t.domId + " .coreDataDic ul input ").val(data.url);
                    validate();
                } else {
                    $(t).trigger("fileUploadF", ["fileUpload", data]);
                    validate();
                }
            });
        });
    }


    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }

        $(t.domId).unbind("focus").bind("focus", function (e) {
            validate()
        });
        $(t.domId).unbind("blur").bind("blur", function (e) {
            validate();
        });
        $(t.domId + ' input').unbind(t.validateOn).bind(t.validateOn, function (e) {
            if (validate()) {
                $(t).trigger("change", [get()]);
            }
        });
        $(t.domId + " .fileUploadBtn").unbind("click").bind("click", function (e) {
            enableChange(e);
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.set = set;
    function set(defaultVal) {
        $(t.domId + " .coreDataDic a ").attr("href", defaultVal);
        $(t.domId + " .coreDataDic a > img ").attr("src", defaultVal);
        $(t.domId + " .coreDataDic ul input ").val(defaultVal);
        localValidate();
    }

    this.get = get;
    function get() {
        return $(t.domId + ' ul input').val();
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = false;
        if (t.coreRegExp == undefined) {
            return true;
        }
        var crtErrMsg = t.errMsg;
        var localValidate = t.coreRegExp.test(get());
        ret = localValidate;
        if (ret) {
            $(t.domId).removeClass("coreErr");
        } else {
            if (!$($(t.domId)).hasClass("coreErr")) {
                $($(t.domId)).addClass("coreErr");
            }
        }
        return ret;
    }

    this.validate = validate;
    function validate() {
        var ret = false;
        var crtErrMsg = t.errMsg;
        var local = localValidate();

        if (local && t.validateAjaxUrl != "") {
            t.doObj.d["val"] = get();
            $.ajax({
                type: "Post",
                url: t.validateAjaxUrl,
                async: false,
                dataType: "json",
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    if (data["s"]) {
                        ret = true;
                    } else {
                        crtErrMsg = data.msg + ":" + data.msgMore;
                    }
                }
            });
        }
        ret = local;
        if (ret) {
            $(t.domId + '').removeClass("coreErr");
            $.hideTooltip();
            $(t).trigger("validateS", []);

        } else {
            $.showTooltip(false, $(t.domId), $(t.domId), crtErrMsg);
            if (!$($(t.domId + '')).hasClass("coreErr")) {
                $($(t.domId + '')).addClass("coreErr");
            }
            $(t).trigger("validateF", []);
        }
        return ret;
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + " .fileUploadBtn").unbind("click");
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + " .fileUploadBtn").unbind("click").bind("click", function (e) {
            enableChange(e);
        });
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + " .coreDataDic a ").attr("href", "");
        $(t.domId + " .coreDataDic a > img ").attr("src", "");
        $(t.domId + " .coreDataDic ul input ").val("");
    }
}
function Core3Imgs(dicDomId) {
    this.domId = "#" + dicDomId;
    this.mod = null;
    this.imgsUploadForm = null;
    this.imgsUploadFormSave = null;
    this.imgsUploadFormAlert = null;
    this.doObj = {
        "d": {},
        "p": {}
    };
    var t = this;

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        $(t.domId + " .fileUploadBtn").unbind("click").bind("click", function (e) {
            t.mod.init();
            t.mod.show();
        });
        t.mod = new Core3Model("imgsUpload", "/corePub/imgsUpload.jsp", true, "");
        $(t.domId + " .coreDropDownFun > .glyphicon-remove").unbind("click").bind("click", function (e) {
            reset();
            $(t).trigger("change", [get()]);
        });

        $(t.mod).unbind("show").bind("show", function (event, data) {
            $(" .imgsUploadForm").attr("id", $.getGuid());
            t.imgsUploadForm = new Core3Form($(" .imgsUploadForm").attr("id"));
            $(t.imgsUploadForm).bind("validateF", function (event, data) {
                t.imgsUploadForm.disable();
            });
            $(t.imgsUploadForm).bind("validateS", function (event, data) {
                t.imgsUploadFormSave.enable();
            });
            t.imgsUploadForm.init();

            $(t.imgsUploadForm.formDoms.URL).unbind("fileUploadF").bind("fileUploadF", function (event, doType, data) {
                t.imgsUploadFormAlert.set(data);
            });
            $(t.imgsUploadForm.formDoms.URL).unbind("fileUploadS").bind("fileUploadS", function (event, doType, data) {
                t.imgsUploadFormAlert.set(data);
            });

            $(" .imgsUploadFormAlert").attr("id", $.getGuid());
            t.imgsUploadFormAlert = new Core3Alert($(" .imgsUploadFormAlert").attr("id"));
            t.imgsUploadFormAlert.init();
            t.imgsUploadFormAlert.show();

            $(" .imgsUploadFormSave").attr("id", $.getGuid());
            t.imgsUploadFormSave = new Core3Button($(" .imgsUploadFormSave").attr("id"));
            $(t.imgsUploadFormSave).bind("click", function (event, data) {
                t.mod.hide();
                var fileDomData = (t.imgsUploadForm.get());
                var addHtml = "<li name= '" + fileDomData.d.NAME + "' value='" + fileDomData.d.URL + "'><span class='glyphicon glyphicon-remove pull-right'></span><div style='height:120px;'><img style = 'margin-top:10px;width:160px;max-height:100px;' src='" + fileDomData.d.URL + "'/></div><div style='text-align:center'><a target='_blank' href='" + fileDomData.d.URL + "'>" + fileDomData.d.NAME + "</a></div></li>";
                $(t.domId + " .coreDataDicSelEd").append(addHtml);
                $(t).trigger("change", [get()]);
                $(t.domId + " .coreDataDicSelEd > li > .glyphicon-remove").unbind("click").bind("click", function (e) {
                    $(e.target).parent().remove();
                    $(t).trigger("change", [get()]);
                });
            });
            t.imgsUploadFormSave.init();
            t.imgsUploadFormSave.disable();
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.set = set;
    function set(defaultVal) {
        reset();
        for (var i = 0; i < defaultVal.length; i++) {
            var addHtml = "<li name= '" + defaultVal[i].n + "' value='" + defaultVal[i].v + "'><span class='glyphicon glyphicon-remove pull-right'></span><div style='height:120px;'><img style = 'margin-top:10px;width:160px;max-height:100px;' src='" + defaultVal[i].v + "'/></div><div style='text-align:center'><a target='_blank' href='" + defaultVal[i].v + "'>" + defaultVal[i].n + "</a></div></li>";
            $(t.domId + " .coreDataDicSelEd").append(addHtml);

        }
        $(t.domId + " .coreDataDicSelEd > li > .glyphicon-remove").unbind("click").bind("click", function (e) {
            $(e.target).parent().remove();
            $(t).trigger("change", [get()]);
        });

    }

    this.validate = validate;
    function validate() {
        var Res = [];
        // $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
        //     Res[index] = $(obj).attr("value");
        // });
        return Res;
    }

    this.get = get;
    function get() {
        var Res = [];
        $(t.domId + " .coreDataDicSelEd > li").each(function (index, obj) {
            var node = {};
            node['v'] = $(obj).attr("value");
            node['n'] = $(obj).attr("name");
            Res[index] = node;
        });
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.disable = disable;
    function disable() {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + " .coreDataDicSelEd > li > span").show();
        $(t.domId + " .coreFun").show();
    }

    this.enable = enable;
    function enable() {
        $(t.domId + " .coreDataDicSelEd > li > span").show();
        $(t.domId + " .coreFun").show();
    }

    this.disable = disable;
    function disable() {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + " .coreDataDicSelEd").html("");
    }
}
function Core3Videos(dicDomId) {
    this.domId = "#" + dicDomId;
    this.mod = null;
    this.videosUploadForm = null;
    this.videosUploadFormSave = null;
    this.videosUploadFormAlert = null;
    this.doObj = {
        "d": {},
        "p": {}
    };
    var t = this;

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        $(t.domId + " .fileUploadBtn").unbind("click").bind("click", function (e) {
            t.mod.init();
            t.mod.show();
        });
        t.mod = new Core3Model("videosUpload", "/corePub/videosUpload.jsp", true, "");
        $(t.domId + " .coreDropDownFun > .glyphicon-remove").unbind("click").bind("click", function (e) {
            reset();
            $(t).trigger("change", [get()]);
        });

        $(t.mod).unbind("show").bind("show", function (event, data) {
            $(" .videosUploadForm").attr("id", $.getGuid());
            t.videosUploadForm = new Core3Form($(" .videosUploadForm").attr("id"));
            $(t.videosUploadForm).bind("validateF", function (event, data) {
                t.videosUploadForm.disable();
            });
            $(t.videosUploadForm).bind("validateS", function (event, data) {
                t.videosUploadFormSave.enable();
            });
            t.videosUploadForm.init();

            $(t.videosUploadForm.formDoms.URL).unbind("fileUploadF").bind("fileUploadF", function (event, doType, data) {
                t.videosUploadFormAlert.set(data);
            });
            $(t.videosUploadForm.formDoms.URL).unbind("fileUploadS").bind("fileUploadS", function (event, doType, data) {
                t.videosUploadFormAlert.set(data);
            });

            $(" .videosUploadFormAlert").attr("id", $.getGuid());
            t.videosUploadFormAlert = new Core3Alert($(" .videosUploadFormAlert").attr("id"));
            t.videosUploadFormAlert.init();
            t.videosUploadFormAlert.show();

            $(" .videosUploadFormSave").attr("id", $.getGuid());
            t.videosUploadFormSave = new Core3Button($(" .videosUploadFormSave").attr("id"));
            $(t.videosUploadFormSave).bind("click", function (event, data) {
                t.mod.hide();
                var fileDomData = (t.videosUploadForm.get());
                var addHtml = "<li name= '" + fileDomData.d.NAME + "' value='" + fileDomData.d.VIEDOURL + "' imgval = '" + fileDomData.d.IMGURL + "'><span class='glyphicon glyphicon-remove pull-right'></span><div style='margin-top:20px;vertical-align:middle;justify-content:center;text-align:center;height:120px;width:160px;background-image:url(" + fileDomData.d.IMGURL + ")'><span><i class='glyphicon glyphicon-play-circle' style='font-size: 40px;margin-top: 30px;color: #4b45ff;'></i><span></div><div style='text-align:center'><a target='_blank' href='" + fileDomData.d.VIEDOURL + "'>" + fileDomData.d.NAME + "</a></div></li>";
                $(t.domId + " .coreDataDicSelEd").append(addHtml);
                $(t).trigger("change", [get()]);
                $(t.domId + " .coreDataDicSelEd > li > .glyphicon-remove").unbind("click").bind("click", function (e) {
                    $(e.target).parent().remove();
                    $(t).trigger("change", [get()]);
                });
            });
            t.videosUploadFormSave.init();
            t.videosUploadFormSave.disable();
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.set = set;
    function set(defaultVal) {
        reset();
        for (var i = 0; i < defaultVal.length; i++) {
            var addHtml = "<li name= '" + defaultVal[i]['n'] + "' value='" + defaultVal[i]['v'] + "' imgval = '" + defaultVal[i]['imgv'] + "'><span class='glyphicon glyphicon-remove pull-right'></span><div style='margin-top:20px;vertical-align:middle;justify-content:center;text-align:center;height:120px;width:160px;background-image:url(" + defaultVal[i]['imgv'] + ")'><span><i class='glyphicon glyphicon-play-circle' style='font-size: 40px;margin-top: 30px;color: #4b45ff;'></i><span></div><div style='text-align:center'><a target='_blank' href='" + defaultVal[i]['v'] + "'>" + defaultVal[i]['n'] + "</a></div></li>";
            $(t.domId + " .coreDataDicSelEd").append(addHtml);
        }
        $(t.domId + " .coreDataDicSelEd > li > .glyphicon-remove").unbind("click").bind("click", function (e) {
            $(e.target).parent().remove();
            $(t).trigger("change", [get()]);
        });
    }

    this.validate = validate;
    function validate() {
        var Res = [];
        // $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
        //     Res[index] = $(obj).attr("value");
        // });
        return Res;
    }

    this.get = get;
    function get() {
        var Res = [];
        $(t.domId + " .coreDataDicSelEd > li").each(function (index, obj) {
            var node = {};
            node['imgv'] = $(obj).attr("imgval");
            node['v'] = $(obj).attr("value");
            node['n'] = $(obj).attr("name");
            Res[index] = node;
        });
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.disable = disable;
    function disable() {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.readOnly = readOnly;
    function readOnly() {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.writeAble = writeAble;
    function writeAble() {
        $(t.domId + " .coreDataDicSelEd > li > span").show();
        $(t.domId + " .coreFun").show();
    }

    this.enable = enable;
    function enable() {
        $(t.domId + " .coreDataDicSelEd > li > span").show();
        $(t.domId + " .coreFun").show();
    }

    this.disable = disable;
    function disable() {
        $(t.domId + " .coreDataDicSelEd > li > span").hide();
        $(t.domId + " .coreFun").hide();
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        $(t.domId + " .coreDataDicSelEd").html("");
    }
}
function Core3Button(dicDomId) {
    this.domId = "#" + dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {},
        "listP": {},
        "p": {}
    };
    var t = this;
    this.changeIcon = changeIcon;
    function changeIcon(oldIconClassName, newIconClassName) {
        $(t.domId + " i ").removeClass(oldIconClassName).addClass(newIconClassName);
    }

    this.hasIcon = hasIcon;
    function hasIcon(iconClassName) {
        return $(t.domId + " i ").hasClass(iconClassName);
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.hasCls = hasCls;
    function hasCls(className) {
        return $(t.domId).hasClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        var timer = null;
        $(t.domId).unbind("click").bind("click", function (e) {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                $(t).trigger("click", []);
            }, 300);
        });
        $(t.domId).unbind("dblclick").bind("dblclick", function (e) {
            timer && clearTimeout(timer);
            $(t).trigger("dblclick", []);
        });
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();

    }

    this.set = set;
    function set(defaultVal) {
        $(t.domId + " i").html(defaultVal);
    }

    this.get = get;
    function get() {
        var Res;
        Res = $(t.domId + " i").html();
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return "";
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        // var Res = [];
        // $(t.domId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
        //     Res[index] = $(obj).attr("value");
        // });
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        if (ifTrue == "true") {
            $(t.domId).removeAttr("disabled");
        } else {
        }
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
        $(t.domId).removeAttr("disabled");
    }

    this.disable = disable;
    function disable() {
        $(t.domId).attr("disabled", true);
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
    }
}
function Core3List(listDomId) {
    this.domId = "#" + listDomId;
    this.ajaxUrl = "";
    this.multiSelect = false;
    this.paiXu = {};
    this.rowHtml = "";
    this.mainKey = "";
    this.doObj = {
        "d": {},
        "active": "",
        "p": {
            "pageSize": 10,
            "theRecordIndex": 0,
            "orderBy": "YC_ID",
            "search": "",
            "desc": "desc"
        }
    };
    var t = this;

    function dataSync() {
        var Res = false;
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").remove();
        if ("r" in t.doObj.d) {
            for (var ri = 0; ri < t.doObj.d.r.length; ri++) {
                var rowData = t.doObj.d.r[ri];
                var crtRowHtml = t.rowHtml;
                for (var key in rowData) {
                    var replaceReg = new RegExp("C:" + key + ":C", 'g');
                    crtRowHtml = crtRowHtml.replace(replaceReg, rowData[key]);
                }
                var rowIdReg = new RegExp("C:ROW_ID:C", 'g');
                crtRowHtml = crtRowHtml.replace(rowIdReg, ri + 1);
                var dataIdReg = new RegExp("C:DATA_ID:C", 'g');
                crtRowHtml = crtRowHtml.replace(dataIdReg, parseInt(t.doObj.p.pageSize) * (parseInt(t.doObj.p.theRecordIndex) - 1) + ri + 1);
                $(t.domId + " .Core3ListBody").append("" + crtRowHtml);
                if (t.doObj.active == rowData[t.mainKey]) {
                    rowActive(ri + 1);
                }
            }
            Res = true;
            if (t.doObj.d.r.length == 0) {
                if ($(t.domId + " .Core3ListHeader th").length > 0) {
                    $(t.domId + " .Core3ListBody").append("<tr class = 'Core3ListBodyRow'><td align = 'center' colspan = '" + $(t.domId + " .Core3ListHeader th").length + "'>" + $(t.domId).attr("data-content") + "<td></tr>");
                } else {
                    $(t.domId + " .Core3ListBody").append("<div class = 'Core3ListBodyRow' style='text-align:center'>" + $(t.domId).attr("data-content") + "</div>");
                }
            }
        } else {
            if ($(t.domId + " .Core3ListHeader th").length > 0) {
                $(t.domId + " .Core3ListBody").append("<tr class = 'Core3ListBodyRow'><td align = 'center' colspan = '" + $(t.domId + " .Core3ListHeader th").length + "'>" + $(t.domId).attr("data-content") + "<td></tr>");
            } else {
                $(t.domId + " .Core3ListBody").append("<div class = 'Core3ListBodyRow' style='text-align:center'>" + $(t.domId).attr("data-content") + "</div>");
            }
        }

        var timer = null;
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").unbind("click").bind("click", function (e) {
            timer && clearTimeout(timer);
            if ($(e.target).attr("href") == undefined && $(e.target).attr("onclick") == undefined && $(e.target).attr("ondblclick") == undefined) {
                if ($(e.delegateTarget).attr("rowId") != undefined) {
                    var rowId = parseInt($(e.delegateTarget).attr("rowId"));
                    timer = setTimeout(function () {
                        var data = t.doObj.d.r[rowId - 1];
                        rowSelect(rowId);
                        /////////
                        var retEnv = "";
                        var eventDom = null;

                        if ($(e.target).hasClass("targetCls")) {
                            if ($(e.target).attr("targetName") != undefined) {
                                retEnv = $(e.target).attr("targetName");
                                eventDom = $(e.target);
                            }
                        } else {
                            $(e.target).parents(" .targetCls").each(function (index, obj) {
                                if (retEnv == "") {
                                    if ($(obj).attr("targetName") != undefined) {
                                        retEnv = $(obj).attr("targetName");
                                        eventDom = obj;
                                    }
                                }
                            });
                        }
                        $(t).trigger("rowClick", ["rowClick", data, rowId, retEnv, $(e.target)]);
                        ///////////
                        //$(t).trigger("rowClick", ["rowClick", data, rowId]);
                    }, 300);
                }
            }
        });
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").unbind("dblclick").bind("dblclick", function (e) {
            timer && clearTimeout(timer);
            if ($(e.target).attr("href") == undefined && $(e.target).attr("onclick") == undefined && $(e.target).attr("ondblclick") == undefined) {
                if ($(e.delegateTarget).attr("rowId") != undefined) {
                    var rowId = parseInt($(e.delegateTarget).attr("rowId"));
                    rowSelectOne(rowId);
                    rowActive(rowId);
                    var data = t.doObj.d.r[rowId - 1];
                    $(t).trigger("rowDblClick", ["rowDblClick", data, rowId]);
                }
            }
        });

        //设置具有rowSelected class 的选中
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").each(function (index, obj) {
            if ($(obj).attr("rowId") != undefined) {
                if ($(obj).hasClass("rowSelected")) {
                    $(obj).find(" .rowMark").attr("checked", "true");
                }
            }
        });

        return Res;
    }

    this.init = init;
    function init() {
        var Res = {};
        Res['s'] = false;
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        t.ajaxUrl = $(t.domId).attr("ajaxUrl");
        if ($(t.domId).attr("multiSelect") == "true") {
            t.multiSelect = true;
        }
        if (!t.multiSelect) {
            $(t.domId + " .allMark").attr("disabled", true);
        }
        t.mainKey = $(t.domId).attr("mainKey");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        $(t.domId + " .Core3ListPaiXu").each(function (index, obj) {
            if ($(obj).attr("id") == undefined) {
                $(obj).attr("id", $.getGuid());
            }
            var coreHelpType = $(obj).attr("coreHelpType");
            var formDomName = $(obj).attr("name");
            var formDomId = $(obj).attr("id");
            if (coreHelpType == "Core3Button") {
                t.paiXu[formDomName] = new Core3Button(formDomId);
                $(t.paiXu[formDomName]).unbind("click").bind("click", function (event, data) {
                    var crtPaiXu = {
                        "orderBy": formDomName,
                        "desc": "desc",
                    };
                    for (var key in t.paiXu) {
                        if (formDomName != key) {
                            t.paiXu[key].changeIcon("glyphicon-chevron-up", "aa");
                            t.paiXu[key].changeIcon("glyphicon-chevron-down", "aa");
                        }
                    }

                    if (t.paiXu[formDomName].hasIcon("aa")) {
                        t.paiXu[formDomName].changeIcon("aa", "glyphicon-chevron-down");
                    } else {
                        if (t.paiXu[formDomName].hasIcon("glyphicon-chevron-down")) {
                            t.paiXu[formDomName].changeIcon("glyphicon-chevron-down", "glyphicon-chevron-up");
                        } else {
                            t.paiXu[formDomName].changeIcon("glyphicon-chevron-up", "glyphicon-chevron-down");
                        }
                    }
                    if (t.paiXu[formDomName].hasIcon("glyphicon-chevron-up")) {
                        crtPaiXu.desc = "";
                    }
                    load(crtPaiXu);
                });
                t.paiXu[formDomName].init();
            }
        });
        t.rowHtml = "" + $(t.domId + " .Core3ListBody .Core3ListBodyRow")[0].outerHTML;
        load({});
        if ($(t.domId).attr("core3ReadOnly") == "true") readOnly();
        if ($(t.domId).attr("core3Disabled") == "true") disable();
        if ($(t.domId).attr("core3Hiddened") == "true") hide();
        return Res;
    }

    this.allSelect = allSelect;
    function allSelect() {
        if ($(t.domId + " .allMark").attr("checked") == undefined) {
            $(t.domId + " .allMark").attr("checked", "true");
            $(t.domId + " .Core3ListBody .Core3ListBodyRow .rowMark").attr("checked", "true");
            $(t.domId + " .Core3ListBody .Core3ListBodyRow").addClass("rowSelected");
        } else {
            $(t.domId + " .allMark").removeAttr("checked");
            $(t.domId + " .Core3ListBody .Core3ListBodyRow .rowMark").removeAttr("checked");
            $(t.domId + " .Core3ListBody .Core3ListBodyRow").removeClass("rowSelected");
        }
    }

    this.rowSelectOne = rowSelectOne;
    function rowSelectOne(rowId) {
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").removeClass("rowSelected");
        $(t.domId + " .Core3ListBody .Core3ListBodyRow .rowMark").removeAttr("checked");

        $(t.domId + " .Core3ListBody .Core3ListBodyRow").each(function (index, obj) {
            if ($(obj).attr("rowId") != undefined) {
                var rowaaId = parseInt($(obj).attr("rowId"));
                if (rowaaId == rowId) {
                    $(obj).addClass("rowSelected");
                    $(obj).find(" .rowMark").attr("checked", "true");
                }
            }
        });
    }

    this.rowActive = rowActive;
    function rowActive(rowId) {
        t.doObj.active = "";
        $(t.domId + " .Core3ListBody .rowActive").removeClass("rowActive");
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").each(function (index, obj) {
            if ($(obj).attr("rowId") != undefined) {
                var rowaaId = parseInt($(obj).attr("rowId"));
                if (rowaaId == rowId) {
                    $(obj).addClass("rowActive");
                    t.doObj.active = t.doObj.d.r[rowId - 1][t.mainKey];
                }
            }
        });
    }

    this.active = active;
    function active(YC_ID) {
        t.doObj.active = YC_ID;
        $(t.domId + " .Core3ListBody .rowActive").removeClass("rowActive");
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").each(function (index, obj) {
            if ($(obj).attr("rowId") != undefined) {
                var rowaaId = parseInt($(obj).attr("rowId"));
                if (t.doObj.d.r[rowaaId - 1][t.mainKey] == t.doObj.active) {
                    $(obj).addClass("rowActive");
                }
            }
        });
    }

    this.getActive = getActive;
    function getActive() {
        var ret = {"s": false};
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").each(function (index, obj) {
            if ($(obj).attr("rowId") != undefined) {
                var rowaaId = parseInt($(obj).attr("rowId"));
                if (t.doObj.d.r[rowaaId - 1][t.mainKey] == t.doObj.active) {
                    t.doObj.active = t.doObj.d.r[rowaaId - 1][t.mainKey];
                    ret.s = true;
                    ret.d = t.doObj.d.r[rowaaId - 1];
                }
            }
        });
        return ret;
    }


    this.rowSelect = rowSelect;
    function rowSelect(rowId) {
        if (!t.multiSelect) {
            $(t.domId + " .Core3ListBody .Core3ListBodyRow").removeClass("rowSelected");
            $(t.domId + " .Core3ListBody .Core3ListBodyRow .rowMark").removeAttr("checked");
        }
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").each(function (index, obj) {
            if ($(obj).attr("rowId") != undefined) {
                var rowaaId = parseInt($(obj).attr("rowId"));
                if (rowaaId == rowId) {
                    if ($(obj).hasClass("rowSelected")) {
                        $(obj).removeClass("rowSelected");
                    } else {
                        $(obj).addClass("rowSelected");
                    }
                    if ($(obj).hasClass("rowSelected")) {
                        $(obj).find(" .rowMark").attr("checked", "true");
                    } else {
                        $(obj).find(" .rowMark").removeAttr("checked");
                    }
                }
            }
        });
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.getSelections = getSelections;
    function getSelections(doType) {
        var Res = [];
        $(t.domId + " .Core3ListBody .rowSelected").each(function (index, obj) {
            var data = t.doObj.d.r[parseInt($(obj).attr("rowId")) - 1];
            if(doType!="list"){
            
              delete data.CAOZUO;
               }
            Res.push(data);
        });
        return Res;
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.submit = submit;
    function submit(doType, doObj) {
      
        var Res = {};
        Res['s'] = false;
        t.doObj.d = getSelections(doType);
        //console.log( t.doObj.d);
		 
        t.doObj.DO_TYPE = doType;
        for (var key in doObj) {
            t.doObj[key] = doObj[key];
        }
		
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {

                Res = data;
                Res['doType'] = doType;
                if (data.s) {
                    $(t).trigger("submitS", [doType, data]);
                } else {
                    $(t).trigger("submitF", [doType, data]);
                }

            },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
                      
                             console.log(errorThrown);
	         
                }
        });
        return Res;
    }

    this.changRowCls = changRowCls;
    function changRowCls(rowId, oldCls, newCls) {

    }

    this.getCrtPageNum = getCrtPageNum;
    function getCrtPageNum() {
        return t.doObj.p.theRecordIndex;
    }

    this.getTotalPagesNum = getTotalPagesNum;
    function getTotalPagesNum() {
        var ret = 1;
        if ("t" in t.doObj.d) {
            ret = Math.ceil(parseInt(t.doObj.d.t) / parseInt(t.doObj.p.pageSize));
        }
        return ret;
    }

    this.getRowCnt = getRowCnt;
    function getRowCnt() {
        var ret = 0;
        if ("t" in t.doObj.d) {
            ret = parseInt(t.doObj.d.t);
        }
        return ret;
    }

    this.go = go;
    function go(pageNum) {
        t.doObj.d.r = [];
        dataSync();
        if ("t" in t.doObj.d) {
            if (parseInt(pageNum) * parseInt(t.doObj.p.pageSize) < parseInt(t.doObj.d.t)) {
                t.doObj.p.theRecordIndex = pageNum;
                if (t.doObj.p.theRecordIndex < 1) {
                    t.doObj.p.theRecordIndex = 1;
                }
            } else {
                t.doObj.p.theRecordIndex = Math.floor(parseInt(t.doObj.d.t) / parseInt(t.doObj.p.pageSize))
            }
        }
        load({});
    }

    this.goNext = goNext;
    function goNext() {
        t.doObj.d.r = [];
        dataSync();
        if ("t" in t.doObj.d) {
            if (parseInt(t.doObj.p.theRecordIndex) * parseInt(t.doObj.p.pageSize) < t.doObj.d.t) {
                t.doObj.p.theRecordIndex++;
            }
        }
        load({});
    }

    this.goBefore = goBefore;
    function goBefore() {
        t.doObj.d.r = [];
        dataSync();
        if (t.doObj.p.theRecordIndex != 1) {
            t.doObj.p.theRecordIndex--;
        }
        load({});
    }

    this.goFirst = goFirst;
    function goFirst() {
        t.doObj.d.r = [];
        dataSync();
        t.doObj.p.theRecordIndex = 1;
        load({});
    }

    this.goLast = goLast;
    function goLast() {
        t.doObj.d.r = [];
        dataSync();
        if ("t" in t.doObj.d) {
            t.doObj.p.theRecordIndex = Math.ceil(parseInt(t.doObj.d.t) / parseInt(t.doObj.p.pageSize));
        }
        load({});
    }

    this.load = load;
    function load(addAttrToP) {
        var Res = {"s": false};
        $(t.domId + " .Core3ListBody .Core3ListBodyRow").remove();
        if ($(t.domId + " .Core3ListHeader th").length > 0) {
            $(t.domId + " .Core3ListBody").append("<tr class = 'Core3ListBodyRow'><td align = 'center' colspan = '" + $(t.domId + " .Core3ListHeader th").length + "'>" + $(t.domId).attr("loadingMsg") + "<td></tr>");
        } else {
            $(t.domId + " .Core3ListBody").append("<div class = 'Core3ListBodyRow' style='text-align:center'>" + $(t.domId).attr("loadingMsg") + "</div>");
        }
        t.doObj.d = {};
        for (var key in addAttrToP) {
            t.doObj.p[key] = addAttrToP[key];
        }
        if (t.ajaxUrl != "") {
            t.doObj.DO_TYPE = "list";
            $.ajax({
                type: "Post",
                url: $(t.domId).attr("ajaxUrl"),
                dataType: "json",
                async: false,
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    Res = data;
                    Res['doType'] = "load";
                    if (data.s) {
                        t.doObj.d = data;
                        $(t).trigger("loadS", ["load", data]);
                        setTimeout(function () {
                            dataSync();
                        }, 400);
                    } else {
                        t.doObj.d = {};
                        $(t).trigger("loadF", ["load", data]);
                    }
                }
            });
        }
        return Res;
    }

    this.set = set;
    function set() {
        load();
    }

    this.get = get;
    function get() {
        var Res = [];
        Res = t.doObj.d;
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        var Res = true;
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        if (ifTrue == "true") {
        } else {
        }
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
    }
}
function Core3Websocket(wsUrl) {
    this.domId = wsUrl;
    this.websocket = null;
    this.doObj = {
        "DO_TYPE": "",
        "YC_ID": "",
        "d": {},
        "p": {
            topAttr: {},
            myAttr: {}
        }
    };
    this.helpDimTreeSel = {};
    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.load = load;
    function load() {
        var Res = {};
        return Res;
    }

    this.setMyAttr = setMyAttr;
    function setMyAttr(myAttr) {
        t.doObj.p.myAttr = myAttr;
        t.doObj.DO_TYPE = "setMyAttr";
        t.websocket.send(JSON.stringify(t.doObj));
    }

    this.setTopAttr = setTopAttr;
    function setTopAttr(topAttr) {
        t.doObj.p.topAttr = topAttr;
        t.doObj.DO_TYPE = "setTopAttr";
        t.websocket.send(JSON.stringify(t.doObj));
    }

    this.init = init;
    function init() {
        if ('WebSocket' in window) {
            if (t.websocket != null) {
                t.websocket.close();
            }
            t.websocket = new WebSocket(t.domId);
        } else {
            alert('当前浏览器不支持此页面，推荐使用火狐浏览器');
        }
        t.websocket.onmessage = function (event) {
            var theData = JSON.parse(event.data);
            if (theData["s"]) {
                if ("cliId" in theData) {
                    t.doObj.YC_ID = theData["cliId"];
                }
                if ("d" in theData) {
                    t.doObj.d = theData["d"];
                    $(t).trigger("change", [theData]);
                }
            }
        };
        t.websocket.onerror = function (event) {
            $(t).trigger("error", []);
        };
        t.websocket.onopen = function (event) {
            $(t).trigger("open", []);
        }
        t.websocket.onclose = function (event) {
            $(t).trigger("close", []);
//                setTimeout(init, 2000);
        }
        window.onbeforeunload = function (event) {
            t.websocket.close();
        }
    }

    this.close = close;
    function close() {
        t.websocket.close();
//            t.websocket = null;

    }

    this.set = set;
    function set(defaultValue) {
        t.doObj.d = defaultValue;
    }

    this.submit = submit;
    function submit(doType, doObj) {
        var Res = {};
        Res['s'] = false;
        t.doObj.DO_TYPE = doType;
        for (var key in doObj) {
            t.doObj[key] = doObj[key];
        }
        t.websocket.send(JSON.stringify(t.doObj));
    }

    this.get = get;
    function get() {
        return t.doObj.d;
    }

    this.validate = validate;
    function validate() {
        var theRet = true;
        return theRet;
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
    }

    this.show = show;
    function show() {
    }

    this.reset = reset;
    function reset() {
    }
}
function Core3BusPaiMai(dicDomId) {
    this.domId = "#" + dicDomId;
    this.ajaxUrl = "";
    this.formUrl = "";
    this.formObj = null;
    this.wsUrl = "";
    this.formDoms = {};
    this.paimaiMod = null;
    this.ws = null;
    this.doObj = {
        "DO_TYPE": "",
        "YC_ID": "",
        "uid": "",
        "d": {},
        "p": {}
    };
    var t = this;
    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.submit = submit;
    function submit(doType, doObj) {
        var Res = {};

        return Res;
    }

    this.load = load;
    function load(doObj) {
        var Res = {};
        var btnYc_id = [];

        for (var key in t.formDoms) {
            btnYc_id.push(t.formDoms[key].doObj.p.ID);
        }

        Res['s'] = false;
        t.doObj.d = btnYc_id;
        t.doObj.DO_TYPE = "list";
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                for (var i = 0; i < data.PaiMai_Json.length; i++) {
                    if (JSON.stringify(data.PaiMai_Json[i].PAIMAI_JSON) == "{}") {//拍卖未开始、开始
                        var now = new Date().getTime();
                        for (var key in t.formDoms) {//所有按钮
                            if (t.formDoms[key].doObj.p.ID == data.PaiMai_Json[i].YC_ID) {
                                var time = t.formDoms[key].doObj.p['开始时间'];
                                if (now > t.formDoms[key].doObj.p['开始时间']) {//已开始
                                    t.formDoms[key].enable();
                                    t.formDoms[key].set('进入拍卖');
                                }
                                if (now < t.formDoms[key].doObj.p['开始时间']) {//未开始
                                    t.formDoms[key].disable();
                                    t.formDoms[key].set('拍卖开始时间为：' + t.formDoms[key].doObj.p['开始时间']);
                                }
                            }
                        }
                    } else {//拍卖结束
                        for (var key in t.formDoms) {
                            if (t.formDoms[key].doObj.p.ID == data.PaiMai_Json[i].YC_ID) {
                                t.formDoms[key].disable();
                                t.formDoms[key].set('成交价：' + data.PaiMai_Json[i].PAIMAI_JSON.crt['当前价格']);
                            }
                        }
                    }
                }

                Res = data;
                Res['doType'] = "";
            }
        });


        return Res;
    }

    this.set = set;
    function set(defaultVal) {
    }

    this.setBuyerId = setBuyerId;
    function setBuyerId(buyerId) {
        t.doObj.uid = buyerId;
    }

    this.init = init;
    function init() {
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        t.formDoms = {};
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        t.ajaxUrl = $(t.domId).attr("ajaxUrl");
        t.formUrl = $(t.domId).attr("formUrl");
        t.wsUrl = $(t.domId).attr("wsUrl");


        t.paimaiMod = new Core3Model("paimaidddd", t.formUrl, true, "");
        $(t.paimaiMod).unbind("hide").bind("hide", function (event, data) {
            t.ws.close();
        });
        t.ws = new Core3Websocket(t.wsUrl);
        $(t.ws).unbind("change").bind("change", function (event, data) {
            if (data.s) {
                if ("DO_TYPE" in data) {
                    if ("BAOJIA" == data.DO_TYPE) {
                        var crtShangPingData = {};
                        crtShangPingData["商品名称"] = data.d["dim"]["YC_NAME"] + "：" + data.d["dim"]["ID"];
                        crtShangPingData["底价"] = data.d["dim"]["底价"];
                        crtShangPingData["报价增量"] = data.d["dim"]["报价增量"];
                        crtShangPingData["当前价格"] = data.d["crt"]["当前价格"];
                        crtShangPingData["当前报价人"] = data.d["crt"]["uid"];
                        if (crtShangPingData["当前价格"] == crtShangPingData["底价"]) {
                            $(t).trigger("begin", [data]);
                        } else {
                            $(t).trigger("change", [data]);
                        }
                        t.formObj.set(crtShangPingData);
                    } else if ("JIESHU" == data.DO_TYPE) {
                        var crtShangPingData = {};
                        crtShangPingData["距离结束时间"] = data.d;
                        if (data.d == -1) {
                            $(t).trigger("end", [data]);
                            t.ws.close();
                        }
                        t.formObj.set(crtShangPingData);
                    }
                }
            } else {
                $.confirm({
                    title: '错误!',
                    content: '本商品拍卖出现系统错误，请联系管理员',
                    buttons: {
                        YES: {
                            text: '知道了',
                            action: function () {
                                paimaiMod.hide();
                            }
                        }
                    }
                });
            }
        });
        $(t.ws).unbind("open").bind("open", function (event, data) {
            t.ws.setMyAttr(t.doObj);
        });

        $(t.domId + " ." + $(t.domId).attr("myDomsCls")).each(function (index, obj) {
            if ($(obj).attr("id") == undefined) {
                $(obj).attr("id", $.getGuid());
            }
            var coreHelpType = $(obj).attr("coreHelpType");
            var formDomName = $(obj).attr("name");
            var formDomId = $(obj).attr("id");
            if ("Core3Button" == coreHelpType) {
                t.formDoms[formDomName] = new Core3Button(formDomId);
            }
            $(t.formDoms[formDomName]).unbind("click").bind("click", function (e) {
                t.paimaiMod.init(true);
                $(t.paimaiMod).unbind("show").bind("show", function (event, data) {
                    t.doObj["p"] = t.formDoms[formDomName].doObj.p;
                    t.ws.init();
                });
                t.paimaiMod.show();

                $(t).trigger("click", [t.formDoms[formDomName]]);
            });
            t.formDoms[formDomName].init();
        });

    }

    this.get = get;
    function get() {
        var Res = {};
        return Res;
    }

    this.validate = validate;
    function validate() {
        return true;
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {

    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        t.doObj = {
            "DO_TYPE": "",
            "YC_ID": "",
            "d": {},
            "p": {}
        };
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        init();
    }
}
function Core3BusPinLun(listDomId) {
    this.domId = "#" + listDomId;
    this.ajaxUrl = "";
    this.listDom = {};
    this.formDom = {};
    this.submitDom = {};
    this.doObj = {
        "d": {},
        "p": {}
    };
    var t = this;
    this.init = init;
    function init() {
        var Res = {};
        Res['s'] = false;
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        t.ajaxUrl = $(t.domId).attr("ajaxUrl");

        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        if ($(t.domId + " .Core3PinLunList").length != 1) {
            console.error("获取评论列表组件出现错误:");
            return;
        }
        $(t.domId + " .Core3PinLunList").attr("id", $.getGuid());
        t.listDom = new Core3List($(t.domId + " .Core3PinLunList").attr("id"));
        for (var key in t.doObj.p) {
            $.setInitDoObjP(t.listDom, key, t.doObj.p[key]);
        }
        $(t.listDom).unbind("loadS").bind("loadS", function (e, fun, data) {
            $(t).trigger("loadS", ["load", data]);
        });
        $(t.listDom).unbind("loadF").bind("loadF", function (e, fun, data) {
            $(t).trigger("loadF", ["load", data]);
        });
        t.listDom.init({});

        if ($(t.domId + " .Core3PinLunTiJiao").length != 1) {
            console.error("获取表单提交组件出现错误:");
            return;
        }
        $(t.domId + " .Core3PinLunTiJiao").attr("id", $.getGuid());
        t.submitDom = new Core3Button($(t.domId + " .Core3PinLunTiJiao").attr("id"));
        $(t.submitDom).unbind("click").bind("click", function (event, data) {
            if (t.formDom.validate()) {
                var theRet = t.formDom.submit("add", t.doObj.p);
                if (theRet.s) {
                    $(t).trigger("submitS", ["submit", theRet]);
                    t.listDom.load({});
                } else {
                    $(t).trigger("submitF", ["submit", theRet]);
                }
            }

        });
        t.submitDom.init({});
        if ($(t.domId + " .Core3PinLunForm").length != 1) {
            console.error("获取表单组件出现错误:");
            return;
        }
        $(t.domId + " .Core3PinLunForm").attr("id", $.getGuid());
        t.formDom = new Core3Form($(t.domId + " .Core3PinLunForm").attr("id"));
        for (var key in t.doObj.p) {
            $.setInitDoObjP(t.formDom, key, t.doObj.p[key]);
        }

        $(t.formDom).unbind("validateF").bind("validateF", function (event, data) {
            t.submitDom.disable();
        });
        $(t.formDom).unbind("validateS").bind("validateS", function (event, data) {
            t.submitDom.enable();
        });
        t.formDom.init();

        Res['s'] = true;
        return Res;
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.load = load;
    function load() {
        var Res = {"s": false};
        Res = t.listDom.load({});
        return Res;
    }

    this.set = set;
    function set() {
        var Res = {"s": false};
        $(t.listDom).unbind("loadS").bind("loadS", function (e, fun, data) {
            $(t).trigger("setS", ["set", data]);
            Res.s = true;
            Res.d = data;
        });
        $(t.listDom).unbind("loadF").bind("loadF", function (e, fun, data) {
            $(t).trigger("setF", ["set", data]);
        });
        t.listDom.load({});
        return Res;
    }

    this.get = get;
    function get() {
        var Res = {};
        Res = t.doObj.d;
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        var Res = true;
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        if (ifTrue == "true") {
        } else {
        }
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        set();
    }
}
function Core3BusPraise(listDomId) {
    this.domId = "#" + listDomId;
    this.ajaxUrl = "";
    this.zan = null;
    this.zanText = null;
    this.cai = null;
    this.caiText = null;
    this.doObj = {
        "d": {},
        "p": {}
    };
    var t = this;
    this.init = init;
    function init() {
        var Res = {};
        Res['s'] = false;
        var ifMoreDoms = $(t.domId).length;
        if (ifMoreDoms == 0) {
            console.error("没有这个组件:" + t.domId);
            return;
        } else if (ifMoreDoms > 1) {
            console.error("存在多个组件:" + t.domId);
            return;
        }
        t.ajaxUrl = $(t.domId).attr("ajaxUrl");
        var initDoObjP = JSON.parse($(t.domId).attr("initDoObjP"));
        for (var key in initDoObjP) {
            t.doObj.p[key] = initDoObjP[key];
        }
        if ($(t.domId + " .zanDom").length == 1 && $(t.domId + " .zanText").length == 1) {
            $(t.domId + " .zanDom").attr("id", $.getGuid());
            t.zan = new Core3Button($(t.domId + " .zanDom").attr("id"));
            $(t.zan).unbind("click").bind("click", function (event, data) {
                if (t.zan.hasCls("zan")) {
                    t.zan.removeCls("zan");
                    t.zan.addCls("yiZan");
                    t.zanText.set(parseInt(t.zanText.get()) + 1);
                    submit("addZan", t.doObj);
                    $(t).trigger("change", ["change", get()]);

                } else {
                    t.zan.removeCls("yiZan");
                    t.zan.addCls("zan");
                    t.zanText.set(parseInt(t.zanText.get()) - 1);
                    submit("removeZan", t.doObj);
                    $(t).trigger("change", ["change", get()]);

                }
            });
            t.zan.init();
            $(t.domId + " .zanText").attr("id", $.getGuid());
            t.zanText = new Core3Button($(t.domId + " .zanText").attr("id"));
            t.zanText.init();
        }
        if ($(t.domId + " .caiDom").length == 1 && $(t.domId + " .caiText").length == 1) {
            $(t.domId + " .caiDom").attr("id", $.getGuid());
            t.cai = new Core3Button($(t.domId + " .caiDom").attr("id"));
            $(t.cai).unbind("click").bind("click", function (event, data) {
                if (t.cai.hasCls("cai")) {
                    t.cai.removeCls("cai");
                    t.cai.addCls("yiCai");
                    t.caiText.set(parseInt(t.caiText.get()) + 1);
                    submit("addCai", t.doObj);
                    $(t).trigger("change", ["change", get()]);
                } else {
                    t.cai.removeCls("yiCai");
                    t.cai.addCls("cai");
                    t.caiText.set(parseInt(t.caiText.get()) - 1);
                    submit("removeCai", t.doObj);
                    $(t).trigger("change", ["change", get()]);
                }
            });
            t.cai.init();
            $(t.domId + " .caiText").attr("id", $.getGuid());
            t.caiText = new Core3Button($(t.domId + " .caiText").attr("id"));
            t.caiText.init();
        }
        load({});

        Res['s'] = true;
        return Res;
    }

    this.submit = submit;
    function submit(doType, doObj) {
        var Res = {};
        Res['s'] = false;
        t.doObj.d = get();
        t.doObj.DO_TYPE = doType;
        for (var key in doObj) {
            t.doObj[key] = doObj[key];
        }
        $.ajax({
            type: "Post",
            url: $(t.domId).attr("ajaxUrl"),
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                Res = data;
                Res['doType'] = doType;
                if (data.s) {
                    $(t).trigger("submitS", [doType, data]);
                } else {
                    $(t).trigger("submitF", [doType, data]);
                }
            }
        });
        return Res;
    }

    this.load = load;
    function load(addAttrToP) {
        var Res = {"s": false};
        for (var key in addAttrToP) {
            t.doObj.p[key] = addAttrToP[key];
        }
        if (t.ajaxUrl != "") {
            t.doObj.DO_TYPE = "list";
            $.ajax({
                type: "Post",
                url: $(t.domId).attr("ajaxUrl"),
                dataType: "json",
                async: false,
                data: {
                    "doObj": JSON.stringify(t.doObj)
                },
                success: function (data) {
                    Res = data;
                    Res['doType'] = "load";
                    if (data.s) {
                        t.doObj.d = data;
                        set(data.d.ZAN_JSON);
                    } else {
                        $(t).trigger("loadF", ["load", data]);
                    }
                }
            });
        }
        return Res;
    }

    this.addCls = addCls;
    function addCls(className) {
        $(t.domId).addClass(className);
    }

    this.removeCls = removeCls;
    function removeCls(className) {
        $(t.domId).removeClass(className);
    }

    this.set = set;
    function set(dbValue) {
        var Res = {"s": false};
        if ("zan" in dbValue) {
            t.zanText.set(dbValue.zan);
        } else {
            t.zanText.set("0");
        }
        if ("cai" in dbValue) {
            t.caiText.set(dbValue.cai);
        } else {
            t.caiText.set("0");
        }
        return Res;
    }

    this.get = get;
    function get() {
        var Res = {};
        Res.zan = t.zanText.get();
        Res.cai = t.caiText.get();
        return Res;
    }

    this.getDbFieldName = getDbFieldName;
    function getDbFieldName() {
        return $(t.domId).attr("dbFeldName");
    }

    this.localValidate = localValidate;
    function localValidate() {
        var ret = true;
        return ret;
    }

    this.validate = validate;
    function validate() {
        var Res = true;
        return Res;
    }

    this.readOnly = readOnly;
    function readOnly(ifTrue) {
        if (ifTrue == "true") {
        } else {
        }
    }

    this.readOnly = readOnly;
    function readOnly() {
    }

    this.writeAble = writeAble;
    function writeAble() {
    }

    this.enable = enable;
    function enable() {
    }

    this.disable = disable;
    function disable() {
    }

    this.hide = hide;
    function hide() {
        $(t.domId).hide();
    }

    this.show = show;
    function show() {
        $(t.domId).show();
    }

    this.reset = reset;
    function reset() {
        set({zan: "0", cai: "0"});
    }
}
function RsaEncrypt(param) {
    var key = RSAUtils.getKeyPair('10001', '', '82db3c4f60404f0f5c95abcf86a68683901e56a627127160edff594f8a59397a076b2cef7f074066cb5738f9dbafe18dd4baa6e9f2516dc6d38126a64d82cd4fb91e023a3cf1534503af0423ae2999bc8cf70a174d779babd577317083f3d13e783e04876bc01f8ebb2ba76501b12476e8f0248805bfab7d8a579c9510d4ee17');
    //加密后的密码
    var password = RSAUtils.encryptedString(key, param);
    return password;
}
