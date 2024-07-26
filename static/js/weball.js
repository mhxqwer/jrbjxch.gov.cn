/**供网站使用，对浏览器的要求较低
 *
 */

$.initTree = function(treeDomId) {
    $('#'+treeDomId).find(' li > table > tbody > tr > td > span > i').addClass(
        'glyphicon glyphicon-triangle-right');
    $('#'+treeDomId+' li:has(ol)').addClass('corePli').find(
        ' > table > tbody > tr > td > span > i').removeClass(
        'glyphicon-triangle-right').addClass('glyphicon-plus');

    $('#'+treeDomId+' li:has(ol)').find(' > ol > li').hide('slow');


    var openedNodeVal = $('#'+treeDomId).prop("openedNode");
    if (openedNodeVal == undefined){
        openedNodeVal = {};
    }
    $('#'+treeDomId+' .openedNode').each(function(e){
        openedNodeVal[$(this).attr("id")] = true;
        var children = $(this).parent().parent().parent().parent().parent().parent().find(' >ol > li');
        children.show('slow');
        openedNodeVal[$(this).attr("id")] = true;
        $(this).removeClass('glyphicon-plus').addClass('glyphicon-minus');
    });
    $('#'+treeDomId+' .active').parents('li').find(' >ol > li').show('slow');
    $('#'+treeDomId+' .active').parents('ol >li').find(' > table > tbody > tr > td > span > i').removeClass('glyphicon-plus').addClass('glyphicon-minus');


    $('#'+treeDomId).prop("openedNode",openedNodeVal);
    $('#'+treeDomId+' .corePli .glyphicon').on(
        'click',
        function(e) {
            var openedNodeVal = $('#'+treeDomId).prop("openedNode");
            if (openedNodeVal == undefined){
                openedNodeVal = {};
            }
            var children = $(this).parent().parent().parent().parent().parent().parent().find(' >ol > li');
            if (children.is(":visible")) {
                children.hide('slow');
                openedNodeVal[$(this).attr("id")] = false;
                $(this).removeClass('glyphicon-minus').addClass('glyphicon-plus');
            } else {
                children.show('slow');
                openedNodeVal[$(this).attr("id")] = true;
                $(this).removeClass('glyphicon-plus').addClass('glyphicon-minus');
            }
            $('#'+treeDomId).prop("openedNode",openedNodeVal);
            e.stopPropagation();
        });
    $('#'+treeDomId+' .corePli table').on('click', function(e) {
        $('#'+treeDomId+' li table a').removeClass("active");
        $(this).find(' a ').addClass("active");
        $('#'+treeDomId).prop("activeNode",$(this).find(' i ').attr("id"));
        e.stopPropagation();
    })
};
function HelpfileUpload(fileType, fileElementId) {
    this.file_url = "/corePub/fileUpload.jsp?fileType=" + fileType;
    this.fileElementId = fileElementId;
    var t = this;
    this.FileUpload = FileUpload;
    function FileUpload() {
        $.ajaxFileUpload({
            url: t.file_url,            //需要链接到服务器地址
            secureuri: true,
            type: "get",
            fileElementId: t.fileElementId,                        //文件选择框的id属性
            success: function (data, status) {
                var results = $(data).find('body').html();
                $(t).trigger("uploadSuccess", [eval("(" + results + ")")]);
            }, error: function (data, status, e) {
                var results = $(data).find('body').html();
                $(t).trigger("uploadError", [eval("(" + results + ")")]);
            }
        });
    }

}

function HelpDimTreeDropDownSel(dicDomId) {
    this.dicDomId = dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {}
    };
    this.faTree = {

    };

    var t = this;

    this.reset = reset;
    function reset() {

    }

    this.get = get;
    function get() {
        var Res = {
            "dicVal": {},
            "formVal": {}
        };
        $("#" + t.dicDomId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            var node = {};
            node['coreTreePath'] = $(obj).find("div").attr("coreTreePath");
            node['SORT'] = index;
            node['coreTreeType'] = $(obj).find("div").attr("coreTreeType");
            node['faPath'] = $(obj).find("div").attr("faPath");
            node['coreTreeText'] = $(obj).find("div > a").html();
            Res["dicVal"]["SON"+$(obj).find("div").attr("coreTreeType") + "_" + index] = node;
        });
        var formVal = {};
        var formDom = $("#"+t.dicDomId + " .coreForm > form").serializeArray();
        for (var i = 0; i < formDom.length;i++){
            var formDomName = formDom[i]["name"];
            formVal[formDomName] = formDom[i]["value"];
        }
        $("#" + t.dicDomId + " .coreForm input[type='checkbox']").each(
            function () {
                if ($(this).is(':checked')) {
                    formVal[$(this).attr('name')] = 1;
                } else {
                    formVal[$(this).attr('name')] = 0;
                }
            });
        Res["formVal"] = formVal;
        $(t).trigger("change", [Res]);
        return Res;
    }

    this.set = set;
    function set(defaultVal) {
        for (var keyName in defaultVal["dicVal"]) {
            var lll = '<li>' +
                '<div class="input-group" coreTreePath="' + defaultVal["dicVal"][keyName]['coreTreePath'] + '" coreTreeType="' + keyName.substring(3, keyName.indexOf("_")) + '">' +
                '<a href="#" class="form-control">' + defaultVal["dicVal"][keyName]['coreTreeText'] + '</a>' +
                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                '</li>';
            $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
        }
        $("#" + t.dicDomId + " .coreDataDicDataForm").setForm(defaultVal["formVal"]);

    }

    this.hid = hid;
    function hid() {
        console.log("HelpDimTreeDropDownSel-----hid待开发");
    }

    this.disable = disable;
    function disable() {
        console.log("HelpDimTreeDropDownSel-----disable待开发");
    }

    this.reload = reload;
    function reload(index,theChangeDomHtml) {
        var reloadPan = $('#'+t.dicDomId +' .collapse_'+index +' > div > div');
        reloadPan.html(theChangeDomHtml);
        if (reloadPan.hasClass("coreTree")) {
            $.initColTree(reloadPan.attr("id"));
            if ($(reloadPan).parent().parent().parent().attr("onlyLeaf") == "true") {
                $(reloadPan).find('.corePli').each(function (index, allObj) {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("canSel");
                    $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("cannotSel");
                    if ($(allObj).has("ol").length > 0) {
                        $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("cannotSel");
                    } else {
                        $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("canSel");
                    }
                });
            } else {
                $(reloadPan).find('.corePli > table > tbody > tr > .col3  > span').each(function (index, allObj) {
                    $(allObj).removeClass("canSel");
                    $(allObj).removeClass("cannotSel");
                    $(allObj).addClass("canSel");
                });
            }
            $("#" + t.dicDomId + " .coreDataDic .collapse_" + index + " .coreTree .cannotSel").unbind("click").bind("click", function (e) {
                alert('本节点不能选择，请点击鼠标形状为手型的节点！');
            });
            $("#" + t.dicDomId + " .coreDataDic .collapse_" + index + "  .coreTree .canSel").unbind("click").bind("click", function (e) {
                var nextPanel = $(e.target).parents(".helpTree").attr("nextPanel");
                if (nextPanel == "") {
                    var selText = "";
                    var faPath = "";
                    for (var key in t.faTree){
                        selText += t.faTree[key]["text"]+";";
                        faPath += t.faTree[key]["value"]+";";
                    }
                    selText += $(e.target).parents(".helpTree").attr("value")+":"
                    $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var coreTreePath = $(e.target).parents("tr").attr("treeId");
                    var ifAdd = true;
                    $("#" + t.dicDomId + " .coreDataDicSelEd > li > div").each(function (eval, obj) {
                        if (coreTreePath == $(obj).attr("coreTreePath")) {
                            ifAdd = false;
                        }
                    });
                    if (ifAdd){
                        var aa = selText.substring(selText.lastIndexOf(":")+1,selText.length);
                        var lll = '<li>' +
                            '<div class="input-group" faPath = "'+faPath+'" coreTreePath="' + $(e.target).parents("tr ").attr("treeId") + '" coreTreeType="' + $(e.target).parents(".helpTree").attr("value") + '">' +
                            '<a href="#" class="form-control">' + aa + '</a>' +
                            '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                            '</li>';
                        $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                        get();
                    }else{
                        alert("本节点已经被选中");
                    }
                    $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                        $(e.target).parent().parent().remove();
                        get();
                    });
                    $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                        $(e.target).parent().parent().parent().remove();
                        get();
                    });
                } else {
                    $(e.target).parents(".panel-collapse").collapse('toggle');
                    $(e.target).parents(".panel-group").find(".collapse_" + nextPanel).collapse('toggle');
                    var selText = "";
                    selText += $(e.target).parents(".helpTree").attr("value")+":"
                    $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var panId =$(e.target).parents(" .coreTree ").attr("id");
                    var coreTreePath = $(e.target).parents("tr").attr("treeId");
                    t.faTree[panId]={
                        'text':selText,
                        'value':coreTreePath
                    };
                    for (var key in t.faTree){
                        if (key > panId ){
                            delete t.faTree[key];
                        }
                    }
                    $(t).trigger("panelChange", [t.faTree,nextPanel]);
                }
            });

        }

    }

    this.init = init;
    function init() {
        var theRetDataHead = "";
        theRetDataHead += "<div class='input-group'>";
        theRetDataHead += "	<ul class='list-inline coreDataDicSelEd'>";
        theRetDataHead += "	</ul>";
        theRetDataHead += "	<span class='input-group-addon coreDataDicDropDown'>";
        theRetDataHead += "		<span class='glyphicon glyphicon-arrow-down dropdown-toggle' data-toggle='dropdown'></span>";
        theRetDataHead += "		<div class='dropdown-menu coreDropDownPanel'>";
        theRetDataHead += "			<div class='panel-group'>";

        var theRetDataBody = "";
        $('#' + t.dicDomId + " .help").each(function (index, obj) {
            if ($(obj).hasClass("helpTree")) {
                theRetDataBody += "				<div class='panel panel-default helpTree' value = '" + $(obj).attr("value") + "' nextPanel = '" + $(obj).attr("nextPanel") + "' onlyLeaf = '" + $(obj).attr("onlyLeaf") + "' coreId = '" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "					<div class='panel-heading '>";
                theRetDataBody += "						<h4 class='panel-title'>" + $(obj).attr("name") + "</h4>";
                theRetDataBody += "					</div>";
                theRetDataBody += "					<div class='panel-collapse collapse collapse_" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "						<div class='panel-body'>";
                theRetDataBody += "							<div class='coreTree' id = '" + $(obj).attr("coreId") + "'>";
                theRetDataBody += $(obj).html();
                theRetDataBody += "							</div>";
                theRetDataBody += "						</div>";
                theRetDataBody += "					</div>";
                theRetDataBody += "				</div>";
            } else if ($(obj).hasClass("helpForm")) {
                theRetDataBody += "				<div class='panel panel-default helpForm' value = '" + $(obj).attr("value") + "' nextPanel = '" + $(obj).attr("nextPanel") + "' coreId = '" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "					<div class='panel-heading '>";
                theRetDataBody += "						<h4 class='panel-title'>" + $(obj).attr("name") + "</h4>";
                theRetDataBody += "					</div>";
                theRetDataBody += "					<div class='panel-collapse collapse collapse_" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "						<div class='panel-body'>";
                theRetDataBody += "							<div class='coreForm' id = '" + $(obj).attr("coreId") + "'>";
                theRetDataBody += $(obj).html();
                theRetDataBody += "						    </div>";
                theRetDataBody += "						</div>";
                theRetDataBody += "					</div>";
                theRetDataBody += "				</div>";
            }

        });
        var theRetDataFoot = "";

        theRetDataFoot += "			</div>";
        theRetDataFoot += "		</div>";
        theRetDataFoot += "	</span>";
        theRetDataFoot += "</div>";

        $("#" + t.dicDomId + " .coreDataDic").html(theRetDataHead + theRetDataBody + theRetDataFoot);

        $("#" + t.dicDomId + " .coreDataDic .dropdown-menu").unbind("click").bind("click", function (e) {
            e.stopPropagation();
        });

        $("#" + t.dicDomId + " .coreDataDic").find(".coreTree").each(function (coreTreeIndex, obj) {
            $.initColTree($(obj).attr("id"));
            if ($(obj).parent().parent().parent().attr("onlyLeaf") == "true") {
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

        });
        $("#" + t.dicDomId + " .coreDataDicDropDown").on("hidden.bs.dropdown", function () {
            $(t).trigger("changeEnd", [get()]);
        });
        $("#" + t.dicDomId + " .coreDataDic .panel-heading").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().find(".panel-collapse").collapse('toggle');
        });

        $("#" + t.dicDomId + " .coreDataDic .coreTree .cannotSel").unbind("click").bind("click", function (e) {
            alert('本节点不能选择，请点击鼠标形状为手型的节点！');
        });
        $("#" + t.dicDomId + " .coreDataDic  .coreTree .canSel").unbind("click").bind("click", function (e) {
            var nextPanel = $(e.target).parents(".helpTree").attr("nextPanel");
            if (nextPanel == "") {
                var selText = "";
                var faPath = "";
                for (var key in t.faTree){
                    selText += t.faTree[key]["text"]+";";
                    faPath += t.faTree[key]["value"]+";";
                }
                selText += $(e.target).parents(".helpTree").attr("value")+":"
                $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                    if (index > 0) {
                        selText = selText + "-";
                    }
                    selText = selText + $(eobj).text();
                });
                var coreTreePath = $(e.target).parents("tr").attr("treeId");
                var ifAdd = true;
                $("#" + t.dicDomId + " .coreDataDicSelEd > li > div").each(function (eval, obj) {
                    if (coreTreePath == $(obj).attr("coreTreePath")) {
                        ifAdd = false;
                    }
                });
                if (ifAdd){
                    var aa = selText.substring(selText.lastIndexOf(":")+1,selText.length);
                    var lll = '<li>' +
                        '<div class="input-group" faPath = "'+faPath+'" coreTreePath="' + $(e.target).parents("tr ").attr("treeId") + '" coreTreeType="' + $(e.target).parents(".helpTree").attr("value") + '">' +
                        '<a href="#" class="form-control">' + aa + '</a>' +
                        '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                        '</li>';
                    $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                    get();
                }else{
                    alert("本节点已经被选中");
                }
                $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                    $(e.target).parent().parent().remove();
                    get();
                });
                $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                    $(e.target).parent().parent().parent().remove();
                    get();
                });
            } else {
                $(e.target).parents(".panel-collapse").collapse('toggle');
                $(e.target).parents(".panel-group").find(".collapse_" + nextPanel).collapse('toggle');
                var selText = "";
                selText += $(e.target).parents(".helpTree").attr("value")+":"
                $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                    if (index > 0) {
                        selText = selText + "-";
                    }
                    selText = selText + $(eobj).text();
                });
                var panId =$(e.target).parents(" .coreTree ").attr("id");
                var coreTreePath = $(e.target).parents("tr").attr("treeId");
                t.faTree[panId]={
                    'text':selText,
                    'value':coreTreePath
                };
                for (var key in t.faTree){
                    if (key > panId ){
                        delete t.faTree[key];
                    }
                }
                $(t).trigger("panelChange", [t.faTree,nextPanel]);
            }
        });
    }

};

function HelpDimTreeSel(treeDomId) {
    this.treeDomId = treeDomId;
    this.doObj = {
        "treeDomId" : treeDomId,
        "d" : {}
    };
    var t = this;

    this.reset = reset;
    function reset() {

    }

    this.get = get;
    function get() {
        var Res = {
            "dicVal":{},
            "formVal":{}
        };
        $('#' + treeDomId).find('.corePli').each(function (index, allObj) {
            if (!$(allObj).find("> table > tbody > tr> .col2 > i").hasClass("glyphicon-remove-sign")) {
                if ($(allObj).find("> table > tbody > tr> .col2 > i").hasClass("glyphicon-minus-sign")){
                    Res.dicVal[$(allObj).find("> table > tbody > tr").attr("treeId")] = "minus";
                }else{
                    Res.dicVal[$(allObj).find("> table > tbody > tr").attr("treeId")] = "ok";
                }
            }
        });
        return Res;
    }

    this.set = set;
    function set(helpDimTreeSelInitJson) {

        $('#' + treeDomId).find('.corePli').each(function (index, allObj) {
            var treeId = $(allObj).find(" > table > tbody > tr");
            if(treeId.attr("treeId") in helpDimTreeSelInitJson.dicVal){
                treeId.find(">.col2>i").removeClass("glyphicon-remove-sign").removeClass("glyphicon-minus-sign").addClass("glyphicon-ok-sign");
            }
        });


        $('#' + treeDomId).find('.corePli').each(function (index,allObj) {

            var ok = false;
            var remove = false;
            if(!$(allObj).find("> table >tbody>tr>.col1>i").hasClass("glyphicon-triangle-right")){

                if ($(allObj).find(" .corePli table >tbody>tr>.col2>i").hasClass("glyphicon-ok-sign")){
                    ok = true;
                }
                if ($(allObj).find(" .corePli table >tbody>tr>.col2>i").hasClass("glyphicon-remove-sign")){
                    remove = true;
                }
                if (ok == true && remove == true){
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-remove-sign");
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-ok-sign");
                    $(allObj).find("> table > tbody > tr> .col2 >i").addClass("glyphicon-minus-sign");
                }
                if (ok == true && remove == false){
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-minus-sign");
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-remove-sign");
                    $(allObj).find("> table > tbody > tr> .col2 >i").addClass("glyphicon-ok-sign");
                }
                if (ok == false){
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-minus-sign");
                    $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-ok-sign");
                    $(allObj).find("> table > tbody > tr> .col2 >i").addClass("glyphicon-remove-sign");
                }
            }
        });
    }

    this.hid = hid;
    function hid() {
        console.log("HelpDimTreeSel-----hid待开发");
    }

    this.disable = disable;
    function disable() {
        console.log("HelpDimTreeSel-----disable待开发");
    }

    this.init = init;
    function init(){
        $.initColTree(t.treeDomId);
        $('#' + t.treeDomId).find(' li > table > tbody > tr > .col2 > i').addClass('glyphicon glyphicon-remove-sign');

        $('#' + treeDomId).find(' li > table > tbody > tr > .col2 > i').unbind("click").bind("click", function (e) {

            var checkEd = false;
            if ($(e.target).hasClass("glyphicon-remove-sign")) {
                checkEd = true;
            } else if ($(e.target).hasClass("glyphicon-ok-sign")) {
                checkEd = false;
            } else if ($(e.target).hasClass("glyphicon-ban-sign")) {
                checkEd = false;
            }
            $(e.target).removeClass("glyphicon-remove-sign").removeClass("glyphicon-minus-sign").removeClass("glyphicon-ok-sign");
            if(checkEd){
                $(e.target).addClass("glyphicon-ok-sign");
            }else{
                $(e.target).addClass("glyphicon-remove-sign");
            }
            if ($(e.target).parents("table").parent().has("ol").length > 0){
                if ($(e.target).hasClass("glyphicon-remove-sign")) {
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").removeClass("glyphicon-ok-sign");
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").removeClass("glyphicon-minus-sign");
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").addClass("glyphicon-remove-sign");
                } else if ($(e.target).hasClass("glyphicon-ok-sign")) {
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").removeClass("glyphicon-minus-sign");
                    $(e.target).parents("table").parent().parent().find("table > tbody > tr > .col2 > i").removeClass("glyphicon-remove-sign");
                    $(e.target).parents("table").parent().find("table > tbody > tr > .col2 > i").addClass("glyphicon-ok-sign");
                }
            }
            $('#' + treeDomId).find('.corePli').each(function (index,allObj) {

                var ok = false;
                var remove = false;
                if ($(allObj).has("ol").length > 0){

                    if ($(allObj).find(" .corePli table >tbody>tr>.col2>i").hasClass("glyphicon-ok-sign")){
                        ok = true;
                    }
                    if ($(allObj).find(" .corePli table >tbody>tr>.col2>i").hasClass("glyphicon-remove-sign")){
                        remove = true;
                    }
                    if (ok == true && remove == true){
                        $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-remove-sign");
                        $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-ok-sign");
                        $(allObj).find("> table > tbody > tr> .col2 >i").addClass("glyphicon-minus-sign");
                    }
                    if (ok == true && remove == false){
                        $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-minus-sign");
                        $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-remove-sign");
                        $(allObj).find("> table > tbody > tr> .col2 >i").addClass("glyphicon-ok-sign");
                    }
                    if (ok == false){
                        $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-minus-sign");
                        $(allObj).find("> table > tbody > tr> .col2 >i").removeClass("glyphicon-ok-sign");
                        $(allObj).find("> table > tbody > tr> .col2 >i").addClass("glyphicon-remove-sign");
                    }
                }
            });
            $(t).trigger("change", get());
        });
    }
}

function HelpDimTreeSelNew(dicDomId) {
    this.dicDomId = dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {}
    };
    this.faTree = {};

    var t = this;

    this.reset = reset;
    function reset() {

    }

    this.get = get;
    function get() {
        var Res = {
            "dicVal": {},
            "formVal": {}
        };
        $("#" + t.dicDomId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            var node = {};
            node['coreTreePath'] = $(obj).find("div").attr("coreTreePath");
            node['SORT'] = index;
            node['coreTreeType'] = $(obj).find("div").attr("coreTreeType");
            node['faPath'] = $(obj).find("div").attr("faPath");
            node['coreTreeText'] = $(obj).find("div > a").html();
            Res["dicVal"]["SON" + $(obj).find("div").attr("coreTreeType") + "_" + index] = node;
        });
        var formVal = {};
        var formDom = $("#" + t.dicDomId + " .coreForm > form").serializeArray();
        for (var i = 0; i < formDom.length; i++) {
            var formDomName = formDom[i]["name"];
            formVal[formDomName] = formDom[i]["value"];
        }
        $("#" + t.dicDomId + " .coreForm input[type='checkbox']").each(
            function () {
                if ($(this).is(':checked')) {
                    formVal[$(this).attr('name')] = 1;
                } else {
                    formVal[$(this).attr('name')] = 0;
                }
            });
        Res["formVal"] = formVal;

        return Res;
    }

    this.reload = reload;
    function reload(index, theChangeDomHtml) {
        var reloadPan = $('#' + t.dicDomId + ' .collapse_' + index + ' > div > div');
        reloadPan.html(theChangeDomHtml);
        if (reloadPan.hasClass("coreTree")) {
            $.initColTree(reloadPan.attr("id"));
            if ($(reloadPan).parent().parent().parent().attr("onlyLeaf") == "true") {
                $(reloadPan).find('.corePli').each(function (index, allObj) {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("canSel");
                    $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("cannotSel");
                    if ($(allObj).has("ol").length > 0) {
                        $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("cannotSel");
                    } else {
                        $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("canSel");
                    }
                });
            } else {
                $(reloadPan).find('.corePli > table > tbody > tr > .col3  > span').each(function (index, allObj) {
                    $(allObj).removeClass("canSel");
                    $(allObj).removeClass("cannotSel");
                    $(allObj).addClass("canSel");
                });
            }
            $("#" + t.dicDomId + " .coreDataDic .collapse_" + index + " .coreTree .cannotSel").unbind("click").bind("click", function (e) {
                alert('本节点不能选择，请点击鼠标形状为手型的节点！');
            });
            $("#" + t.dicDomId + " .coreDataDic .collapse_" + index + "  .coreTree .canSel").unbind("click").bind("click", function (e) {
                var nextPanel = $(e.target).parents(".helpTree").attr("nextPanel");
                if (nextPanel == "") {
                    var selText = "";
                    var faPath = "";
                    for (var key in t.faTree) {
                        selText += t.faTree[key]["text"] + ";";
                        faPath += t.faTree[key]["value"] + ";";
                    }
                    selText += $(e.target).parents(".helpTree").attr("value") + ":"
                    $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var coreTreePath = $(e.target).parents("tr").attr("treeId");
                    var ifAdd = true;
                    $("#" + t.dicDomId + " .coreDataDicSelEd > li > div").each(function (eval, obj) {
                        if (coreTreePath == $(obj).attr("coreTreePath")) {
                            ifAdd = false;
                        }
                    });
                    if (ifAdd) {
                        var aa = selText.substring(selText.lastIndexOf(":")+1,selText.length);
                        var lll = '<li>' +
                            '<div class="input-group" faPath = "' + faPath + '" coreTreePath="' + $(e.target).parents("tr ").attr("treeId") + '" coreTreeType="' + $(e.target).parents(".helpTree").attr("value") + '">' +
                            '<a href="#" class="form-control">' + aa + '</a>' +
                            '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                            '</li>';
                        $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                        $(t).trigger("change", [get()]);
                    } else {
                        alert("本节点已经被选中");
                    }
                    $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                        $(e.target).parent().parent().remove();
                        $(t).trigger("change", [get()]);
                    });
                    $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                        $(e.target).parent().parent().parent().remove();
                        $(t).trigger("change", [get()]);
                    });
                } else {
                    $(e.target).parents(".panel-collapse").collapse('toggle');
                    $(e.target).parents(".panel-group").find(".collapse_" + nextPanel).collapse('toggle');
                    var selText = "";
                    selText += $(e.target).parents(".helpTree").attr("value") + ":"
                    $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var panId = $(e.target).parents(" .coreTree ").attr("id");
                    var coreTreePath = $(e.target).parents("tr").attr("treeId");
                    t.faTree[panId] = {
                        'text': selText,
                        'value': coreTreePath
                    };
                    for (var key in t.faTree) {
                        if (key > panId) {
                            delete t.faTree[key];
                        }
                    }
                    $(t).trigger("panelChange", [t.faTree, nextPanel]);
                }
            });

        }

    };

    this.disable = disable;
    function disable() {
        $("#" + t.dicDomId + " .coreDataDicRemove").html("");
        $("#" + t.dicDomId + " .coreDataDicDropDown").html("");
    }

    this.reset = reset;
    function reset() {
        $("#" + t.dicDomId + " .coreDataDicSelEd").html("");
    }

    this.init = init;
    function init() {
        var theRetDataHead = "";
        theRetDataHead += "<div class='input-group'>";
        theRetDataHead += "	<ul class='list-inline coreDataDicSelEd'>";
        theRetDataHead += "	</ul>";
        theRetDataHead += "	<span class='input-group-addon coreDataDicDropDown'>";
        theRetDataHead += "		<span class='glyphicon glyphicon-arrow-down dropdown-toggle' data-toggle='dropdown'></span>";
        theRetDataHead += "		<div class='dropdown-menu coreDropDownPanel'>";
        theRetDataHead += "			<div class='panel-group'>";

        var theRetDataBody = "";
        $('#' + t.dicDomId + " .help").each(function (index, obj) {
            if ($(obj).hasClass("helpTree")) {
                var thisTreeReq = {};
                //thisTreeReq['coreDicRoot'] = $(obj).attr("coreDicRoot");
                //thisTreeReq['coreChengJi'] = $(obj).attr("coreChengJi");
                $.ajax({
                    type: "Post",
                    url: $(obj).attr("ajaxUrl"),
                    async: false,
                    dataType: "json",
                    data: {
                        "doObj": JSON.stringify(thisTreeReq)
                    },
                    success: function (data) {
                        var onleOne = false;

                        if ($(obj).attr("onlyOne") != undefined ){
                            onleOne = $(obj).attr("onlyOne");
                        }
                        if (data["s"]) {
                            theRetDataBody += "				<div class='panel panel-default helpTree' value = '" + $(obj).attr("value") + "' nextPanel = '" + $(obj).attr("nextPanel") + "' onlyOne = '"+onleOne+"' onlyLeaf = '" + $(obj).attr("onlyLeaf") + "' coreId = '" + $(obj).attr("coreId") + "'>";
                            theRetDataBody += "					<div class='panel-heading '>";
                            theRetDataBody += "						<h4 class='panel-title'>" + $(obj).attr("name") + "</h4>";
                            theRetDataBody += "					</div>";
                            theRetDataBody += "					<div class='panel-collapse collapse collapse_" + $(obj).attr("coreId") + " in'>";
                            theRetDataBody += "						<div class='panel-body'>";
                            theRetDataBody += "							<div class='coreTree' id = 'HelpDataDicSelCoreTree" + $(obj).attr("coreId") + "'>";
                            theRetDataBody += data.d;
                            theRetDataBody += "							</div>";
                            theRetDataBody += "						</div>";
                            theRetDataBody += "					</div>";
                            theRetDataBody += "				</div>";

                        }
                    }
                });

            } else if ($(obj).hasClass("helpForm")) {
                theRetDataBody += "				<div class='panel panel-default helpForm' value = '" + $(obj).attr("value") + "' nextPanel = '" + $(obj).attr("nextPanel") + "' coreId = '" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "					<div class='panel-heading '>";
                theRetDataBody += "						<h4 class='panel-title'>" + $(obj).attr("name") + "</h4>";
                theRetDataBody += "					</div>";
                theRetDataBody += "					<div class='panel-collapse collapse collapse_" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "						<div class='panel-body'>";
                theRetDataBody += "							<div class='coreForm' id = 'HelpDataDicSelCoreForm" + $(obj).attr("coreId") + "'>";
                theRetDataBody += $(obj).html();
                theRetDataBody += "						    </div>";
                theRetDataBody += "						</div>";
                theRetDataBody += "					</div>";
                theRetDataBody += "				</div>";
            }

        });
        var theRetDataFoot = "";

        theRetDataFoot += "			</div>";
        theRetDataFoot += "		</div>";
        theRetDataFoot += "	</span>";
        theRetDataFoot += "</div>";

        $("#" + t.dicDomId + " .coreDataDic").html(theRetDataHead + theRetDataBody + theRetDataFoot);

        $("#" + t.dicDomId + " .coreDataDic .dropdown-menu").unbind("click").bind("click", function (e) {
            e.stopPropagation();
        });

        $("#" + t.dicDomId + " .coreDataDic").find(".coreTree").each(function (coreTreeIndex, obj) {
            $.initColTree($(obj).attr("id"));
            if ($(obj).parent().parent().parent().attr("onlyLeaf") == "true") {
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

        });
        $("#" + t.dicDomId + " .coreDataDicDropDown").on("hidden.bs.dropdown", function () {
            $(t).trigger("changeEnd", [get()]);
        });
        $("#" + t.dicDomId + " .coreDataDic .panel-heading").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().find(".panel-collapse").collapse('toggle');
        });

        $("#" + t.dicDomId + " .coreDataDic .coreTree .cannotSel").unbind("click").bind("click", function (e) {
            alert('本节点不能选择，请点击鼠标形状为手型的节点！');
        });
        $("#" + t.dicDomId + " .coreDataDic  .coreTree .canSel").unbind("click").bind("click", function (e) {
            var nextPanel = $(e.target).parents(".helpTree").attr("nextPanel");
            if (nextPanel == "") {
                var selText = "";
                var faPath = "";
                for (var key in t.faTree) {
                    selText += t.faTree[key]["text"] + ";";
                    faPath += t.faTree[key]["value"] + ";";
                }
                selText += $(e.target).parents(".helpTree").attr("value") + ":"
                $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                    if (index > 0) {
                        selText = selText + "-";
                    }
                    selText = selText + $(eobj).text();
                });
                var coreTreePath = $(e.target).parents("tr").attr("treeId");
                var ifAdd = true;
                $("#" + t.dicDomId + " .coreDataDicSelEd > li > div").each(function (eval, obj) {
                    if (coreTreePath == $(obj).attr("coreTreePath")) {
                        ifAdd = false;
                    }
                });
                if (ifAdd) {
                    var aa = selText.substring(selText.lastIndexOf(":")+1,selText.length);
                    var lll = '<li>' +
                        '<div class="input-group" faPath = "' + faPath + '" coreTreePath="' + $(e.target).parents("tr ").attr("treeId") + '" coreTreeType="' + $(e.target).parents(".helpTree").attr("value") + '">' +
                        '<a href="#" class="form-control">' + aa + '</a>' +
                        '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                        '</li>';
                    if ($(e.target).parents(".helpTree").attr("onlyOne")=="true"){
                        $("#" + t.dicDomId + " .coreDataDicSelEd").html("")
                    };

                    $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                    $(t).trigger("change", [get()]);
                } else {
                    alert("本节点已经被选中");
                }
                $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                    $(e.target).parent().parent().remove();
                    $(t).trigger("change", [get()]);
                });
                $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                    $(e.target).parent().parent().parent().remove();
                    $(t).trigger("change", [get()]);
                });
            } else {
                $(e.target).parents(".panel-collapse").collapse('toggle');
                $(e.target).parents(".panel-group").find(".collapse_" + nextPanel).collapse('toggle');
                var selText = "";
                selText += $(e.target).parents(".helpTree").attr("value") + ":"
                $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                    if (index > 0) {
                        selText = selText + "-";
                    }
                    selText = selText + $(eobj).text();
                });
                var panId = $(e.target).parents(" .coreTree ").attr("id");
                var coreTreePath = $(e.target).parents("tr").attr("treeId");
                t.faTree[panId] = {
                    'text': selText,
                    'value': coreTreePath
                };
                for (var key in t.faTree) {
                    if (key > panId) {
                        delete t.faTree[key];
                    }
                }
                $(t).trigger("panelChange", [t.faTree, nextPanel]);
            }
        });
    }

    this.set = set;
    function set(defaultVal) {
        reset();
        for (var keyName in defaultVal["dicVal"]) {
            coreTreeText = defaultVal["dicVal"][keyName]['coreTreeText'];
            coreTreeText = coreTreeText.substring(coreTreeText.lastIndexOf(":")+1,coreTreeText.length);
            var lll = '<li>' +
                '<div class="input-group" coreTreePath="' + defaultVal["dicVal"][keyName]['coreTreePath'] + '" coreTreeType="' + keyName.substring(3, keyName.indexOf("_")) + '">' +
                '<a href="#" class="form-control">' + coreTreeText + '</a>' +
                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                '</li>';
            $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
        }
        $("#" + t.dicDomId + " .coreDataDicDataForm").setForm(defaultVal["formVal"]);

        $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().parent().remove();
            $(t).trigger("change", [get()]);
        });

    }
}

function HelpDataDicSel(dicDomId) {
    this.dicDomId = dicDomId;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {}
    };
    this.faTree = {};

    var t = this;

    this.reset = reset;
    function reset() {

    }

    this.get = get;
    function get() {
        var Res = {
            "dicVal": {},
            "formVal": {}
        };
        $("#" + t.dicDomId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            var node = {};
            node['coreTreePath'] = $(obj).find("div").attr("coreTreePath");
            node['SORT'] = index;
            node['coreTreeType'] = $(obj).find("div").attr("coreTreeType");
            node['faPath'] = $(obj).find("div").attr("faPath");
            node['coreTreeText'] = $(obj).find("div > a").html();
            Res["dicVal"]["SON" + $(obj).find("div").attr("coreTreeType") + "_" + index] = node;
        });
        var formVal = {};
        var formDom = $("#" + t.dicDomId + " .coreForm > form").serializeArray();
        for (var i = 0; i < formDom.length; i++) {
            var formDomName = formDom[i]["name"];
            formVal[formDomName] = formDom[i]["value"];
        }
        $("#" + t.dicDomId + " .coreForm input[type='checkbox']").each(
            function () {
                if ($(this).is(':checked')) {
                    formVal[$(this).attr('name')] = 1;
                } else {
                    formVal[$(this).attr('name')] = 0;
                }
            });
        Res["formVal"] = formVal;

        return Res;
    }

    this.reload = reload;
    function reload(index, theChangeDomHtml) {
        var reloadPan = $('#' + t.dicDomId + ' .collapse_' + index + ' > div > div');
        reloadPan.html(theChangeDomHtml);
        if (reloadPan.hasClass("coreTree")) {
            $.initColTree(reloadPan.attr("id"));
            if ($(reloadPan).parent().parent().parent().attr("onlyLeaf") == "true") {
                $(reloadPan).find('.corePli').each(function (index, allObj) {
                    $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("canSel");
                    $(allObj).find(" > table > tbody > tr > .col3  > span").removeClass("cannotSel");
                    if ($(allObj).has("ol").length > 0) {
                        $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("cannotSel");
                    } else {
                        $(allObj).find(" > table > tbody > tr > .col3  > span").addClass("canSel");
                    }
                });
            } else {
                $(reloadPan).find('.corePli > table > tbody > tr > .col3  > span').each(function (index, allObj) {
                    $(allObj).removeClass("canSel");
                    $(allObj).removeClass("cannotSel");
                    $(allObj).addClass("canSel");
                });
            }
            $("#" + t.dicDomId + " .coreDataDic .collapse_" + index + " .coreTree .cannotSel").unbind("click").bind("click", function (e) {
                alert('本节点不能选择，请点击鼠标形状为手型的节点！');
            });
            $("#" + t.dicDomId + " .coreDataDic .collapse_" + index + "  .coreTree .canSel").unbind("click").bind("click", function (e) {
                var nextPanel = $(e.target).parents(".helpTree").attr("nextPanel");
                if (nextPanel == "") {
                    var selText = "";
                    var faPath = "";
                    for (var key in t.faTree) {
                        selText += t.faTree[key]["text"] + ";";
                        faPath += t.faTree[key]["value"] + ";";
                    }
                    selText += $(e.target).parents(".helpTree").attr("value") + ":"
                    $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var coreTreePath = $(e.target).parents("tr").attr("treeId");
                    var ifAdd = true;
                    $("#" + t.dicDomId + " .coreDataDicSelEd > li > div").each(function (eval, obj) {
                        if (coreTreePath == $(obj).attr("coreTreePath")) {
                            ifAdd = false;
                        }
                    });
                    if (ifAdd) {
                        var aa = selText.substring(selText.lastIndexOf(":")+1,selText.length);
                        var lll = '<li>' +
                            '<div class="input-group" faPath = "' + faPath + '" coreTreePath="' + $(e.target).parents("tr ").attr("treeId") + '" coreTreeType="' + $(e.target).parents(".helpTree").attr("value") + '">' +
                            '<a href="#" class="form-control">' + aa + '</a>' +
                            '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                            '</li>';
                        $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                        $(t).trigger("change", [get()]);
                    } else {
                        alert("本节点已经被选中");
                    }
                    $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                        $(e.target).parent().parent().remove();
                        $(t).trigger("change", [get()]);
                    });
                    $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                        $(e.target).parent().parent().parent().remove();
                        $(t).trigger("change", [get()]);
                    });
                } else {
                    $(e.target).parents(".panel-collapse").collapse('toggle');
                    $(e.target).parents(".panel-group").find(".collapse_" + nextPanel).collapse('toggle');
                    var selText = "";
                    selText += $(e.target).parents(".helpTree").attr("value") + ":"
                    $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                        if (index > 0) {
                            selText = selText + "-";
                        }
                        selText = selText + $(eobj).text();
                    });
                    var panId = $(e.target).parents(" .coreTree ").attr("id");
                    var coreTreePath = $(e.target).parents("tr").attr("treeId");
                    t.faTree[panId] = {
                        'text': selText,
                        'value': coreTreePath
                    };
                    for (var key in t.faTree) {
                        if (key > panId) {
                            delete t.faTree[key];
                        }
                    }
                    $(t).trigger("panelChange", [t.faTree, nextPanel]);
                }
            });

        }

    };

    this.disable = disable;
    function disable() {
        $("#" + t.dicDomId + " .coreDataDicRemove").html("");
        $("#" + t.dicDomId + " .coreDataDicDropDown").html("");
    }

    this.reset = reset;
    function reset() {
        $("#" + t.dicDomId + " .coreDataDicSelEd").html("");
    }

    this.init = init;
    function init() {
        var theRetDataHead = "";
        theRetDataHead += "<div class='input-group'>";
        theRetDataHead += "	<ul class='list-inline coreDataDicSelEd'>";
        theRetDataHead += "	</ul>";
        theRetDataHead += "	<span class='input-group-addon coreDataDicDropDown'>";
        theRetDataHead += "		<span class='glyphicon glyphicon-arrow-down dropdown-toggle' data-toggle='dropdown'></span>";
        theRetDataHead += "		<div class='dropdown-menu coreDropDownPanel'>";
        theRetDataHead += "			<div class='panel-group'>";

        var theRetDataBody = "";
        $('#' + t.dicDomId + " .help").each(function (index, obj) {
            if ($(obj).hasClass("helpTree")) {
                var thisTreeReq = {};
                thisTreeReq['coreDicRoot'] = $(obj).attr("coreDicRoot");
                thisTreeReq['coreChengJi'] = $(obj).attr("coreChengJi");
                $.ajax({
                    type: "Post",
                    url: "/corePub/HelpDataDicSel.jsp",
                    async: false,
                    dataType: "json",
                    data: {
                        "doObj": JSON.stringify(thisTreeReq)
                    },
                    success: function (data) {
                        var onleOne = false;

                        if ($(obj).attr("onlyOne") != undefined ){
                            onleOne = $(obj).attr("onlyOne");
                        }
                        if (data["s"]) {
                            theRetDataBody += "				<div class='panel panel-default helpTree' value = '" + $(obj).attr("value") + "' nextPanel = '" + $(obj).attr("nextPanel") + "' onlyOne = '"+onleOne+"' onlyLeaf = '" + $(obj).attr("onlyLeaf") + "' coreId = '" + $(obj).attr("coreId") + "'>";
                            theRetDataBody += "					<div class='panel-heading '>";
                            theRetDataBody += "						<h4 class='panel-title'>" + $(obj).attr("name") + "</h4>";
                            theRetDataBody += "					</div>";
                            theRetDataBody += "					<div class='panel-collapse collapse collapse_" + $(obj).attr("coreId") + " in'>";
                            theRetDataBody += "						<div class='panel-body'>";
                            theRetDataBody += "							<div class='coreTree' id = 'HelpDataDicSelCoreTree" + $(obj).attr("coreId") + "'>";
                            theRetDataBody += data.d;
                            theRetDataBody += "							</div>";
                            theRetDataBody += "						</div>";
                            theRetDataBody += "					</div>";
                            theRetDataBody += "				</div>";

                        }
                    }
                });

            } else if ($(obj).hasClass("helpForm")) {
                theRetDataBody += "				<div class='panel panel-default helpForm' value = '" + $(obj).attr("value") + "' nextPanel = '" + $(obj).attr("nextPanel") + "' coreId = '" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "					<div class='panel-heading '>";
                theRetDataBody += "						<h4 class='panel-title'>" + $(obj).attr("name") + "</h4>";
                theRetDataBody += "					</div>";
                theRetDataBody += "					<div class='panel-collapse collapse collapse_" + $(obj).attr("coreId") + "'>";
                theRetDataBody += "						<div class='panel-body'>";
                theRetDataBody += "							<div class='coreForm' id = 'HelpDataDicSelCoreForm" + $(obj).attr("coreId") + "'>";
                theRetDataBody += $(obj).html();
                theRetDataBody += "						    </div>";
                theRetDataBody += "						</div>";
                theRetDataBody += "					</div>";
                theRetDataBody += "				</div>";
            }

        });
        var theRetDataFoot = "";

        theRetDataFoot += "			</div>";
        theRetDataFoot += "		</div>";
        theRetDataFoot += "	</span>";
        theRetDataFoot += "</div>";

        $("#" + t.dicDomId + " .coreDataDic").html(theRetDataHead + theRetDataBody + theRetDataFoot);

        $("#" + t.dicDomId + " .coreDataDic .dropdown-menu").unbind("click").bind("click", function (e) {
            e.stopPropagation();
        });

        $("#" + t.dicDomId + " .coreDataDic").find(".coreTree").each(function (coreTreeIndex, obj) {
            $.initColTree($(obj).attr("id"));
            if ($(obj).parent().parent().parent().attr("onlyLeaf") == "true") {
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

        });
        $("#" + t.dicDomId + " .coreDataDicDropDown").on("hidden.bs.dropdown", function () {
            $(t).trigger("changeEnd", [get()]);
        });
        $("#" + t.dicDomId + " .coreDataDic .panel-heading").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().find(".panel-collapse").collapse('toggle');
        });

        $("#" + t.dicDomId + " .coreDataDic .coreTree .cannotSel").unbind("click").bind("click", function (e) {
            alert('本节点不能选择，请点击鼠标形状为手型的节点！');
        });
        $("#" + t.dicDomId + " .coreDataDic  .coreTree .canSel").unbind("click").bind("click", function (e) {
            var nextPanel = $(e.target).parents(".helpTree").attr("nextPanel");
            if (nextPanel == "") {
                var selText = "";
                var faPath = "";
                for (var key in t.faTree) {
                    selText += t.faTree[key]["text"] + ";";
                    faPath += t.faTree[key]["value"] + ";";
                }
                selText += $(e.target).parents(".helpTree").attr("value") + ":"
                $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                    if (index > 0) {
                        selText = selText + "-";
                    }
                    selText = selText + $(eobj).text();
                });
                var coreTreePath = $(e.target).parents("tr").attr("treeId");
                var ifAdd = true;
                $("#" + t.dicDomId + " .coreDataDicSelEd > li > div").each(function (eval, obj) {
                    if (coreTreePath == $(obj).attr("coreTreePath")) {
                        ifAdd = false;
                    }
                });
                if (ifAdd) {
                    var aa = selText.substring(selText.lastIndexOf(":")+1,selText.length);
                    var lll = '<li>' +
                        '<div class="input-group" faPath = "' + faPath + '" coreTreePath="' + $(e.target).parents("tr ").attr("treeId") + '" coreTreeType="' + $(e.target).parents(".helpTree").attr("value") + '">' +
                        '<a href="#" class="form-control">' + aa + '</a>' +
                        '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                        '</li>';
                    if ($(e.target).parents(".helpTree").attr("onlyOne")=="true"){
                        $("#" + t.dicDomId + " .coreDataDicSelEd").html("")
                    };

                    $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                    $(t).trigger("change", [get()]);
                } else {
                    alert("本节点已经被选中");
                }
                $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                    $(e.target).parent().parent().remove();
                    $(t).trigger("change", [get()]);
                });
                $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                    $(e.target).parent().parent().parent().remove();
                    $(t).trigger("change", [get()]);
                });
            } else {
                $(e.target).parents(".panel-collapse").collapse('toggle');
                $(e.target).parents(".panel-group").find(".collapse_" + nextPanel).collapse('toggle');
                var selText = "";
                selText += $(e.target).parents(".helpTree").attr("value") + ":"
                $(e.target).parents(" .corePli ").find(" > table > tbody > tr > .col3  > span ").each(function (index, eobj) {
                    if (index > 0) {
                        selText = selText + "-";
                    }
                    selText = selText + $(eobj).text();
                });
                var panId = $(e.target).parents(" .coreTree ").attr("id");
                var coreTreePath = $(e.target).parents("tr").attr("treeId");
                t.faTree[panId] = {
                    'text': selText,
                    'value': coreTreePath
                };
                for (var key in t.faTree) {
                    if (key > panId) {
                        delete t.faTree[key];
                    }
                }
                $(t).trigger("panelChange", [t.faTree, nextPanel]);
            }
        });
    }

    this.set = set;
    function set(defaultVal) {
        reset();
        for (var keyName in defaultVal["dicVal"]) {
            coreTreeText = defaultVal["dicVal"][keyName]['coreTreeText'];
            coreTreeText = coreTreeText.substring(coreTreeText.lastIndexOf(":")+1,coreTreeText.length);
            var lll = '<li>' +
                '<div class="input-group" coreTreePath="' + defaultVal["dicVal"][keyName]['coreTreePath'] + '" coreTreeType="' + keyName.substring(3, keyName.indexOf("_")) + '">' +
                '<a href="#" class="form-control">' + coreTreeText + '</a>' +
                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                '</li>';
            $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
        }
        $("#" + t.dicDomId + " .coreDataDicDataForm").setForm(defaultVal["formVal"]);

        $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().parent().remove();
            $(t).trigger("change", [get()]);
        });

    }
}

function HelpFile(helpDomId) {
    this.helpDomId = helpDomId;
    this.defaultVal = {};
    this.doObj = {
        "helpDomId": helpDomId,
        "d": {}
    };
    this.faTree = {};

    var t = this;

    this.get = get;
    function get() {
        var Res = {
            "dicVal": [],
            "formVal": {}
        };
        $("#" + t.helpDomId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            var node = {};
            node['url'] = $(obj).find("img").attr("src");
            node['fileType'] = "img";
            node['ifDefault'] = $(obj).find('div').hasClass("selectedDom");
            Res["dicVal"].push(node);
        });
        return Res;
    }

    this.disable = disable;
    function disable() {
        $("#" + t.helpDomId + " .input-group-addon > .glyphicon-file").unbind("click");
        $("#" + t.helpDomId + " .coreDataDicRemove").unbind("click");
        $("#" + t.helpDomId + " .coreDataDicRemove > a").unbind("click");
        $("#" + t.helpDomId + " ul img").unbind("click");
    }

    this.hid = hid;
    function hid() {
        $("#" + t.helpDomId + "").addClass("hidden");
    }

    this.reset = reset;
    function reset() {
        $("#" + t.helpDomId + " .coreDataDicSelEd").html("");
        for (var keyName in t.defaultVal["dicVal"]) {
            var lll = '<li>' +
                '<div class="input-group ">' +
                '<img class="form-control" src=' + t.defaultVal["dicVal"][keyName]["url"] + ' style="height:100px; max-width:100px; min-width:10px;">' +
                '<div style="text-align: center"><a href=' + t.defaultVal["dicVal"][keyName]["url"] + ' target="_blank">查看大图</a></div>' +
                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                '</li>';
            var liObj = $(lll);
            if (t.defaultVal["dicVal"][keyName]["ifDefault"]) {
                $(liObj).find("div").addClass("selectedDom");
            }
            $("#" + t.helpDomId + " .coreDataDicSelEd").append($(liObj));
        }
        $(t).trigger("change", [get()]);
        $("#" + t.helpDomId + " .coreDataDicRemove").unbind("click");
        $("#" + t.helpDomId + " .coreDataDicRemove").bind("click", function (e) {
            $(e.target).parent().parent().remove();
            $(t).trigger("change", [get()]);
        });
        $("#" + t.helpDomId + " .coreDataDicRemove > a").unbind("click");
        $("#" + t.helpDomId + " .coreDataDicRemove > a").bind("click", function (e) {
            $(e.target).parent().parent().parent().remove();
            $(t).trigger("change", [get()]);
        });
        $("#" + t.helpDomId + " ul img").unbind("click");
        $("#" + t.helpDomId + " ul img").bind("click", function (e) {
            $("#" + t.helpDomId + " ul .selectedDom").removeClass("selectedDom");
            $(e.target).parent().addClass("selectedDom");
            $(t).trigger("change", [get()]);
        });
    }

    this.init = init;
    function init() {
        $("#" + t.helpDomId + " .input-group-addon > .glyphicon-file").unbind("click");
        $("#" + t.helpDomId + " .input-group-addon > .glyphicon-file").bind("click", function (e) {
            var fileUploadBtn = $(e.target).find(".fileUploadBtn");
            $(fileUploadBtn).click();
            $(fileUploadBtn).unbind("change");
            $(fileUploadBtn).val("");
            $(fileUploadBtn).unbind("change").bind("change", function (eaaaa) {
                var helpfileUpload = new HelpfileUpload("page", $(eaaaa.target).attr("id"));
                helpfileUpload.FileUpload();
                $(helpfileUpload).unbind("uploadSuccess").bind("uploadSuccess", function (event, data) {
                    if (data.s) {
                        //if($("#" + t.helpDomId).hasClass('coreDataDicSelEd')){
                            var lll = '<li>' +
                                '<div class="input-group">' +
                                '<img class="form-control" src=' + data.url + ' style="height:200px; max-width:160px; min-width:40px;">' +
                                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                                '</li>';
                            $("#" + t.helpDomId + " .coreDataDicSelEd").append(lll);
                            $(t).trigger("change", [get()]);
                            $("#" + t.helpDomId + " .coreDataDicRemove").unbind("click");
                            $("#" + t.helpDomId + " .coreDataDicRemove").bind("click", function (e) {
                                $(e.target).parent().parent().remove();
                                $(t).trigger("change", [get()]);
                            });
                            $("#" + t.helpDomId + " .coreDataDicRemove > a").unbind("click");
                            $("#" + t.helpDomId + " .coreDataDicRemove > a").bind("click", function (e) {
                                $(e.target).parent().parent().parent().remove();
                                $(t).trigger("change", [get()]);
                            });
                            $("#" + t.helpDomId + " ul img").unbind("click");
                            $("#" + t.helpDomId + " ul img").bind("click", function (e) {
                                $("#" + t.helpDomId + " ul .selectedDom").removeClass("selectedDom");
                                $(e.target).parent().addClass("selectedDom");
                                $(t).trigger("change", [get()]);
                            });
                        /*}else{
                            $("#" + t.helpDomId + " .coreDataDicSelFlie").val(data.url);
                        }*/

                    } else {
                        alert("上传失败!");
                    }
                });
            });
        });

    }

    this.set = set;
    function set(defaultVal) {
        t.defaultVal = defaultVal;
        reset();
    }
}

function CoreDataDicHelp(dicDomId, coreDataDicForm, coreDataDicData, coreDataDicHelpNeedJson, ifLeafCanCheck) {
    this.dicDomId = dicDomId;
    this.coreDataDicData = coreDataDicData;
    this.coreDataDicForm = coreDataDicForm;
    this.ifLeafCanCheck = ifLeafCanCheck;
    this.doObj = {
        "dicDomId": dicDomId,
        "d": coreDataDicHelpNeedJson
    };

    var t = this;

    this.reset = reset;
    function reset() {

    }

    this.get = get;
    function get() {
        var Res = {
            "dicVal": {},
            "formVal": {}
        };
        $("#" + t.dicDomId + " .coreDataDicSelEd").find("li").each(function (index, obj) {
            var node = {};
            node['coreTreePath'] = $(obj).find("div").attr("coreTreePath");
            node['SORT'] = index;
            node['coreTreeType'] = $(obj).find("div").attr("coreTreeType");
            node['coreTreeText'] = $(obj).find("div > a").html();

            Res["dicVal"]["SON" + $(obj).find("div").attr("coreTreeType") + "_" + index] = node;
        });

        var formVal = {};
        var formDom = $("#" + t.dicDomId + " .coreDataDicDataForm").serializeArray();
        for (var i = 0; i < formDom.length; i++) {
            var formDomName = formDom[i]["name"];
            formVal[formDomName] = formDom[i]["value"];
        }
        $("#" + t.dicDomId + " .coreDataDicDataForm input[type='checkbox']").each(
            function () {
                if ($(this).is(':checked')) {
                    formVal[$(this).attr('name')] = 1;
                } else {
                    formVal[$(this).attr('name')] = 0;
                }
            });
        Res["formVal"] = formVal;

        $("#" + t.coreDataDicForm).setForm(formVal);

        $("#" + t.coreDataDicForm).readForm();

        $("#" + t.coreDataDicData).val(JSON.stringify(Res));
        $(t).trigger("change", [Res]);
        return Res;
    }


    this.set = set;
    function set(defaultVal) {

        for (var keyName in defaultVal["dicVal"]) {
            var lll = '<li>' +
                '<div class="input-group" coreTreePath="' + defaultVal["dicVal"][keyName]['coreTreePath'] + '" coreTreeType="' + keyName.substring(3, keyName.indexOf("_")) + '">' +
                '<a href="#" class="form-control">' + defaultVal["dicVal"][keyName]['coreTreeText'] + '</a>' +
                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                '</li>';
            $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
        }
        $("#" + t.dicDomId + " .coreDataDicDataForm").setForm(defaultVal["formVal"]);
        $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().remove();
            get();
        });
        $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
            $(e.target).parent().parent().parent().remove();
            get();
        });
    }

    this.hid = hid;
    function hid() {
        console.log("CoreDataDicHelp--hid待开发");
    }

    this.disable = disable;
    function disable() {
        console.log("CoreDataDicHelp--disable待开发");
    }

    this.init = init;
    function init() {
        $.ajax({
            type: "Post",
            url: "/corePub/dataDicHelp.jsp",
            async: false,
            dataType: "json",
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data["s"]) {
                    var formHtmlData = "";
                    if ($("#" + t.coreDataDicForm + "").html().length > 0) {
                        formHtmlData += "				<div class='panel panel-default'>";
                        formHtmlData += "					<div class='panel-heading ddxxccz' targetDom='collapse_Form'>";
                        formHtmlData += "						<h4 class='panel-title'>表单</h4>";
                        formHtmlData += "					</div>";
                        formHtmlData += "					<div class='panel-collapse collapse collapse_Form'>";
                        formHtmlData += "                       <form class='form-horizontal coreDataDicDataForm' data-toggle='validator'>";
                        formHtmlData += "						    <div class='panel-body'>";
                        formHtmlData += $("#" + t.coreDataDicForm + "").html();
                        formHtmlData += "						    </div>";
                        formHtmlData += "                       </form>";
                        formHtmlData += "					</div>";
                        formHtmlData += "				</div>";
                    }

                    $("#" + t.dicDomId + "").html(data.dHead + data.dBody + formHtmlData + data.dFoot);


                    $("#" + t.dicDomId + "").find(".coreTree").each(function (eval, obj) {
                        $.initColTree($(obj).attr("id"));
                        if (t.doObj['d']['rootS'][$(obj).attr("id").substring($(obj).attr("id").lastIndexOf("_") + 1, $(obj).attr("id").length)]['onlyLeafCanSel']) {
                            $('#' + $(obj).attr("id")).find("table > tbody > tr > td > span > i ").each(function (index, obj2) {
                                if (!$(obj2).hasClass("glyphicon-triangle-right")) {
                                    $(obj2).parent().parent().parent().parent().parent().removeClass("coreDataDicToSel")
                                }
                            });
                        }
                    });
                    $("#" + t.dicDomId + " .dropdown-menu").unbind("click").bind("click", function (e) {
                        e.stopPropagation();
                    });
                    $("#" + t.dicDomId + " .coreDataDicDropDown").on("hidden.bs.dropdown", function () {
                        $(t).trigger("changeEnd", [get()]);
                    });

                    $("#" + t.dicDomId + " .ddxxccz").unbind("click").bind("click", function (e) {
                        $("#" + t.dicDomId + " ." + $(this).attr("targetDom")).collapse('toggle');
                    });

                    $("#" + t.dicDomId + " .coreDataDicToSel").unbind("click").bind("click", function (e) {

                        var selText = "";
                        $(e.target).parents(" .corePli ").find(" > table .selName ").each(function (index, obj) {
                            if (index > 0) {
                                selText = selText + "-";
                            }
                            selText = selText + $(obj).text();
                        });
                        var coreTreePath = $(e.target).parent().parent().parent().parent().parent().attr("coreTreePath");
                        var ifAdd = true;
                        $("#" + t.dicDomId + " .coreDataDicSelEd").find("li").each(function (eval, obj) {
                            if (coreTreePath == $(obj).find("div").attr("coreTreePath")) {
                                ifAdd = false;
                            }
                        });
                        if (ifAdd) {
                            var lll = '<li>' +
                                '<div class="input-group" coreTreePath="' + $(e.target).parents(" .coreDataDicToSel ").attr("coreTreePath") + '" coreTreeType="' + $(e.target).parents(" .coreDataDicToSel ").attr("coreTreeType") + '">' +
                                '<a href="#" class="form-control">' + selText + '</a>' +
                                '<span class="input-group-addon coreDataDicRemove"><a class="glyphicon glyphicon-remove"></a></span></div>' +
                                '</li>';
                            $("#" + t.dicDomId + " .coreDataDicSelEd").append(lll);
                            get();
                        }
                        $("#" + t.dicDomId + " .coreDataDicRemove").unbind("click").bind("click", function (e) {
                            $(e.target).parent().parent().remove();
                            get();
                        });
                        $("#" + t.dicDomId + " .coreDataDicRemove > a").unbind("click").bind("click", function (e) {
                            $(e.target).parent().parent().parent().remove();
                            get();
                        });
                    });
                }
            }
        });
    }
}

$.fn.readForm = function () {
    var formVal = {};
    var t = this;
    var formDom = $(t).serializeArray();
    for (var i = 0; i < formDom.length; i++) {
        var formDomName = formDom[i]["name"];
        formVal[formDomName] = formDom[i]["value"];
    }
    $(t).find(" input").each(
        function () {
            if ($(this).attr("type") == "checkbox") {
                if ($(this).is(':checked')) {
                    formVal[$(this).attr('name')] = 1;
                } else {
                    formVal[$(this).attr('name')] = 0;
                }
            }

        });
    return formVal;
};

$.fn.setForm = function (jsonValue) {
    var obj = this;
    $.each(jsonValue, function (name, ival) {
        var $oinput = obj.find("[name=" + name + "]");
        if ($oinput.attr("type") == "radio" || $oinput.attr("type") == "checkbox") {
            $oinput.each(function () {
                if (Object.prototype.toString.apply(ival) == '[object Array]') {//是复选框，并且是数组
                    for (var i = 0; i < ival.length; i++) {
                        if ($(this).val() == ival[i]) {
                            $(this).attr("checked", "checked");
                        } else {
                            $(this).removeAttr('checked')
                        }
                    }
                } else {
                    if ($(this).val() == ival) {
                        $(this).attr("checked", "true");
                    } else {
                        $(this).removeAttr('checked')
                    }
                }
            });
        } else if ($oinput.attr("type") == "textarea") {//多行文本框
            obj.find("[name=" + name + "]").html(ival);
        } else {
            obj.find("[name=" + name + "]").val(ival);
        }
    });
};

function F() {
    this.read = read;
    function read(moFormObj) {
        var ret = {};
        var formVal = {};
        var formBasic = [];
        ret["formVal"] = formVal;
        ret["formBasic"] = formBasic;
        var t = $('#' + moFormObj.moFormId);
        $(t).find(" .needSave").each(
            function (index, obj) {
                if ($(obj).attr("dType") == "text") {
                    var formDomName = $(obj).attr("name");
                    formVal[formDomName] = $(obj).val();
                }
                else if ($(obj).attr("dType") == "checkbox") {
                    var formDomName = $(obj).attr("name");
                    if ($(obj).is(':checked')) {
                        formVal[formDomName] = 1;
                    } else {
                        formVal[formDomName] = 0;
                    }
                }
                else if ($(obj).attr("dType") == "radio") {
                    var formDomName = $(obj).attr("name");
                    $(obj).find(" input").each(
                        function () {
                            if ($(this).attr("type") == "radio") {
                                if ($(this).is(':checked')) {
                                    formVal[$(this).attr('name')] = $(this).val();
                                }
                            }
                        });
                }
                else if ($(obj).attr("dType") == "uEditor") {
                    var ue = UE.getEditor($(obj).attr("id"));
                    formVal[$(obj).attr("id")] = ue.getContent();

                }
                else if ($(obj).attr("dType") == "coreHelp") {
                    formVal[$(obj).attr("id")] = moFormObj.coreHelp[$(obj).attr("id")].get();
                }

            });

        $(t).find(" .needBasic").each(
            function (index, obj) {
                var b = {};
                b["jsonname"] = $(obj).attr("name");
                b["filedName"] = $(obj).attr("name");
                if ($(obj).attr("filedName") != undefined) {
                    b["filedName"] = $(obj).attr("filedName");
                }
                formBasic.push(b);
            });
        return ret;
    }

    this.set = set;
    function set(moFormObj, jsonValue, moFormSta) {
        var t = $('#' + moFormObj.moFormId);
        $(t).find(" .needSave").each(function (index, obj) {

            if ($(obj).attr("dType") == "text") {
                var formDomName = $(obj).attr("name");
                if (formDomName in jsonValue) {
                    $(obj).val(jsonValue[formDomName]);
                } else {
                    if (formDomName != 'YC_FBRJGID' & formDomName != 'YC_FBRJGNAME' & formDomName != 'YC_CHUANGJIANREN') {
                        $(obj).val("");
                    }
                }
            }
            else if ($(obj).attr("dType") == "checkbox") {
                var formDomName = $(obj).attr("name");
                if (formDomName in jsonValue) {
                    if (jsonValue[formDomName] == 1) {
                        $(obj).attr("checked", "checked");
                    } else {
                        $(obj).attr("checked", false);
                    }
                }
                else {
                    $(obj).attr("checked", false);
                }
            }
            else if ($(obj).attr("dType") == "radio") {
                var formDomName = $(obj).attr("name");
                $(obj).find(" input").each(
                    function () {
                        if ($(this).attr("type") == "radio") {
                            if (formDomName in jsonValue) {
                                if (jsonValue[formDomName] == $(this).val()) {
                                    $(this).attr("checked", "checked");
                                }
                            } else {
                                $(obj).attr("checked", false);
                            }
                        }
                    });
            }
            else if ($(obj).attr("dType") == "uEditor") {
                var ue = UE.getEditor($(obj).attr("id"));
                if ($(obj).attr("id") in jsonValue) {
                    ue.addListener("ready", function () {
                        ue.setContent(jsonValue[$(obj).attr("id")]);
                    });
                } else {
                    ue.addListener("ready", function () {
                        ue.setContent("");
                    });
                }
            }
            else if ($(obj).attr("dType") == "coreHelp") {
                var formDomName = $(obj).attr("id");
                if (formDomName in jsonValue) {
                    moFormObj.coreHelp[formDomName].set(jsonValue[formDomName]);
                } else {
                    moFormObj.coreHelp[formDomName].set("");
                }
            }
        });
    }

}

function F2() {
    this.getDim = getDim;
    function getDim(moFormObj) {
        var theRet = "";
        moFormObj.doObj.DO_TYPE = "wGetNodeFormDim";
        $.ajax({
            type: "Post",
            url: "/corePub/w2.jsp",
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(moFormObj.doObj)
            },
            success: function (data) {
                var html = "";
                var head = "";
                var foot = "";
                var colhead = "";
                var colfoot = "";
                if (data.s) {
                    var array = data.r;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i]["Id"].indexOf("R") == 0) {//生成行
                            head += colhead;
                            colhead = '';
                            head += foot;
                            foot = '';
                            head += '<div class="row">';
                            foot = '</div>' + foot;
                        } else {
                            colfoot = '';
                            var name = array[i]["expression"]["f"];
                            if (name == "") {
                                name = array[i]["expression"]["n"]
                            }
                            if (array[i]["expression"]["t"] == "date") {
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><input type="' + array[i]["expression"]["t"] + '" dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" name="' + name + '" f="DN' + array[i]["expression"]["f"] + '" placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</input></div></div></div>' + colfoot;
                            } else if (array[i]["expression"]["t"] == "text") {
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><input type="' + array[i]["expression"]["t"] + '" dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" name="' + name + '" f="DN' + array[i]["expression"]["f"] + '"  placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</input></div></div></div>' + colfoot;
                            } else if(array[i]["expression"]["t"] == "button"){
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><input type="' + array[i]["expression"]["t"] + '" dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" name="' + name + '" value="'+name+'" f="DN' + array[i]["expression"]["f"] + '"  placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</input></div></div></div>' + colfoot;
                            }else if (array[i]["expression"]["t"] == "textarea") {
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><textarea name="' + name + '" f="DN' + array[i]["expression"]["f"] + '"  dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</textarea></div></div></div>' + colfoot;
                            }
                            colhead += colfoot;
                            if(i==array.length-1){
                                colfoot='';
                            }
                        }

                    }
                    theRet = ( head + colhead + colfoot + foot);
                    //$('#' + moFormObj.moFormId).removeClass(moFormObj.doObj.w2.main.style).addClass(moFormObj.doObj.w2.main.style);
                    //$('#' + moFormObj.moFormId + ' .fc').html(head + colhead + colfoot + foot);
                    //moFormObj.w.getNext(moFormObj);
                }
            }
        });
        return theRet;
    }
    this.readDim = readDim;
    function readDim(dimId){
        var ret = {};
        var formVal = {};
        var formBasic = [];
        ret["formVal"] = formVal;
        ret["formBasic"] = formBasic;
        var t = $('#' + dimId);
        $(t).find(" .ns").each(
            function (index, obj) {
                if ($(obj).attr("dt") == "text" || $(obj).attr("dt") == "date" || $(obj).attr("dt") == "textarea") {
                    var formDomName = $(obj).attr("name");
                    formVal[formDomName] = $(obj).val();
                }
                else if ($(obj).attr("dt") == "checkbox") {
                    var formDomName = $(obj).attr("name");
                    if ($(obj).is(':checked')) {
                        formVal[formDomName] = 1;
                    } else {
                        formVal[formDomName] = 0;
                    }
                }
                else if ($(obj).attr("dt") == "radio") {
                    var formDomName = $(obj).attr("name");
                    $(obj).find(" input").each(
                        function () {
                            if ($(this).attr("type") == "radio") {
                                if ($(this).is(':checked')) {
                                    formVal[$(this).attr('name')] = $(this).val();
                                }
                            }
                        });
                }
                else if ($(obj).attr("dt") == "uEditor") {
                    var ue = UE.getEditor($(obj).attr("id"));
                    formVal[$(obj).attr("id")] = ue.getContent();

                }
                else if ($(obj).attr("dt") == "coreHelp") {
                    formVal[$(obj).attr("id")] = moFormObj.coreHelp[$(obj).attr("id")].get();
                }

            });

        $(t).find(" .nb").each(
            function (index, obj) {
                if ($(obj).attr("f") != "DN") {
                    var b = {};
                    b["jsonname"] = $(obj).attr("name");
                    b["f"] = $(obj).attr("f").substring(2);
                    formBasic.push(b);
                }
            });
        return ret;
    }

    this.dim = dim;
    function dim(moFormObj) {
        moFormObj.doObj.DO_TYPE = "wGetFormDim";
        $.ajax({
            type: "Post",
            url: "/corePub/w2.jsp",
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(moFormObj.doObj)
            },
            success: function (data) {
                var html = "";
                var head = "";
                var foot = "";
                var colhead = "";
                var colfoot = "";
                if (data.s) {
                    var array = data.r;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i]["Id"].indexOf("R") == 0) {//生成行
                            head += colhead;
                            colhead = '';
                            head += foot;
                            foot = '';
                            head += '<div class="row">';
                            foot = '</div>' + foot;
                        } else {
                            colfoot = '';
                            var name = array[i]["expression"]["f"];
                            if (name == "") {
                                name = array[i]["expression"]["n"]
                            }
                            if (array[i]["expression"]["t"] == "date") {
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><input type="' + array[i]["expression"]["t"] + '" dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" name="' + name + '" f="DN' + array[i]["expression"]["f"] + '" placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</input></div></div></div>' + colfoot;
                            } else if (array[i]["expression"]["t"] == "text") {
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><input type="' + array[i]["expression"]["t"] + '" dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" name="' + name + '" f="DN' + array[i]["expression"]["f"] + '"  placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</input></div></div></div>' + colfoot;
                            } else if (array[i]["expression"]["t"] == "textarea") {
                                colhead += '<div class="' + array[i]["expression"]["cw"] + '"><div class="form-group"><label class="' + array[i]["expression"]["nw"] + ' control-label">' + array[i]["expression"]["n"] + '</label><div class="' + array[i]["expression"]["iw"] + '"><textarea name="' + name + '" f="DN' + array[i]["expression"]["f"] + '"  dt="' + array[i]["expression"]["dt"] + '" class="' + array[i]["expression"]["cls"] + '" placeholder="' + array[i]["expression"]["e"] + '" data-error="' + array[i]["expression"]["e"] + '">';
                                colfoot = '</textarea></div></div></div>' + colfoot;
                            }
                            colhead += colfoot;
                        }

                    }
                    $('#' + moFormObj.moFormId).removeClass(moFormObj.doObj.w2.main.style).addClass(moFormObj.doObj.w2.main.style);
                    $('#' + moFormObj.moFormId + ' .fc').html(head + colhead + colfoot + foot);
                    //moFormObj.w.getNext(moFormObj);
                }
            }
        });
    }

    this.read = read;
    function read(moFormObj) {
        var ret = {};
        var formVal = {};
        var formBasic = [];
        ret["formVal"] = formVal;
        ret["formBasic"] = formBasic;
        var t = $('#' + moFormObj.moFormId);
        $(t).find(" .ns").each(
            function (index, obj) {
                if ($(obj).attr("dt") == "text" || $(obj).attr("dt") == "date" || $(obj).attr("dt") == "textarea" || $(obj).attr("dt") == "select") {
                    var formDomName = $(obj).attr("name");
                    formVal[formDomName] = $(obj).val();
                }
                else if ($(obj).attr("dt") == "checkbox") {
                    var formDomName = $(obj).attr("name");
                    if ($(obj).is(':checked')) {
                        formVal[formDomName] = 1;
                    } else {
                        formVal[formDomName] = 0;
                    }
                }
                else if ($(obj).attr("dt") == "radio") {
                    var formDomName = $(obj).attr("name");
                    $(obj).find(" input").each(
                        function () {
                            if ($(this).attr("type") == "radio") {
                                if ($(this).is(':checked')) {
                                    formVal[$(this).attr('name')] = $(this).val();
                                }
                            }
                        });
                }
                else if ($(obj).attr("dt") == "uEditor") {
                    var ue = UE.getEditor($(obj).attr("id"));
                    formVal[$(obj).attr("id")] = ue.getContent();

                }
                else if ($(obj).attr("dt") == "coreHelp") {
                    formVal[$(obj).attr("id")] = moFormObj.coreHelp[$(obj).attr("id")].get();
                }

            });

        $(t).find(" .nb").each(
            function (index, obj) {
                if ($(obj).attr("f") != "DN") {
                    var b = {};
                    b["jsonname"] = $(obj).attr("name");
                    b["f"] = $(obj).attr("f").substring(2);
                    formBasic.push(b);
                }
            });
        return ret;
    }

    this.readFJ = readFJ;
    function readFJ(moFormObj) {
        var ret = {};
        var formVal = {};
        var formBasic = [];
        ret["formVal"] = formVal;
        ret["formBasic"] = formBasic;
        var t = $('#' + moFormObj.moFormId);
        $(t).find(" .fj").each(
            function (index, obj) {
                if ($(obj).attr("dt") == "text" || $(obj).attr("dt") == "date" || $(obj).attr("dt") == "textarea") {
                    var formDomName = $(obj).attr("name");
                    formVal[formDomName] = $(obj).val();
                }else if ($(obj).attr("dt") == "select") {
                    var formDomName = $(obj).attr("name");
                    formVal[formDomName] = $(obj).find("option:selected").val();
                }
                else if ($(obj).attr("dt") == "checkbox") {
                    var formDomName = $(obj).attr("name");
                    if ($(obj).is(':checked')) {
                        formVal[formDomName] = 1;
                    } else {
                        formVal[formDomName] = 0;
                    }
                }
                else if ($(obj).attr("dt") == "radio") {
                    var formDomName = $(obj).attr("name");
                    $(obj).find(" input").each(
                        function () {
                            if ($(this).attr("type") == "radio") {
                                if ($(this).is(':checked')) {
                                    formVal[$(this).attr('name')] = $(this).val();
                                }
                            }
                        });
                }
                else if ($(obj).attr("dt") == "uEditor") {
                    var ue = UE.getEditor($(obj).attr("id"));
                    formVal[$(obj).attr("id")] = ue.getContent();

                }
                else if ($(obj).attr("dt") == "coreHelp") {
                    formVal[$(obj).attr("id")] = moFormObj.coreHelp[$(obj).attr("id")].get();
                }

            });

        $(t).find(" .fj").each(
            function (index, obj) {
                if ($(obj).attr("f") != "DN") {
                    var b = {};
                    b["jsonname"] = $(obj).attr("name");
                    b["f"] = $(obj).attr("f").substring(2);
                    formBasic.push(b);
                }
            });
        return ret;
    }

    this.set = set;
    function set(moFormObj, jsonValue) {
        var t = $('#' + moFormObj.moFormId);
        $(t).find(" .ns").each(function (index, obj) {
            if ($(obj).attr("dt") == "text") {
                var formDomName = $(obj).attr("name");
                if (formDomName in jsonValue) {
                    $(obj).val(jsonValue[formDomName]);
                } else {
                    if (formDomName != 'YC_FBRJGID' & formDomName != 'YC_FBRJGNAME') {
                        $(obj).val("");
                    }
                }
            }
            else if ($(obj).attr("dt") == "checkbox") {
                var formDomName = $(obj).attr("name");
                if (formDomName in jsonValue) {
                    if (jsonValue[formDomName] == 1) {
                        $(obj).attr("checked", "checked");
                    } else {
                        $(obj).attr("checked", false);
                    }
                }
                else {
                    $(obj).attr("checked", false);
                }
            }
            else if ($(obj).attr("dt") == "radio") {
                var formDomName = $(obj).attr("name");
                $(obj).find(" input").each(
                    function () {
                        if ($(this).attr("type") == "radio") {
                            if (formDomName in jsonValue) {
                                if (jsonValue[formDomName] == $(this).val()) {
                                    $(this).attr("checked", "checked");
                                }
                            } else {
                                $(obj).attr("checked", false);
                            }
                        }
                    });
            }
            else if ($(obj).attr("dt") == "uEditor") {
                var ue = UE.getEditor($(obj).attr("id"));
                if ($(obj).attr("id") in jsonValue) {
                    ue.setContent(jsonValue[$(obj).attr("id")]);

                } else {
                    ue.setContent("");
                    /*ue.addListener("ready", function () {
                    });*/
                }
            }
            else if ($(obj).attr("dt") == "coreHelp") {
                var formDomName = $(obj).attr("id");
                if (formDomName in jsonValue) {
                    moFormObj.coreHelp[formDomName].set(jsonValue[formDomName]);
                } else {
                    moFormObj.coreHelp[formDomName].set("");
                }
            }
            else if ($(obj).attr("dt") == "select") {
                var formDomName = $(obj).attr("name");
                if (formDomName in jsonValue) {
                    $(obj).val(jsonValue[formDomName]).trigger('change');
                } else {
                    $(obj).val('').trigger('change');
                }
            }
        });
        // var shangpins = jsonValue['listRet']["r"];
        // $('#' + moFormObj.moFormId + ' .shangpinliebiao').html('');
        // var shangpin = "";
        // shangpin += '<div class="col-md-12"></div>';
        // $('#' + moFormObj.moFormId + ' .shangpinliebiao').append(shangpin);
        // shangpin += '<div class="col-md-11">';
        // shangpin += '<div class="row">';
        // shangpin += '<div class="col-md-12">';
        // shangpin += '<table class="table table-striped">';
        // shangpin += '<thead>';
        // shangpin += '<tr>';
        // shangpin += '<td style="width: 30px;"></td>';
        // shangpin += '<td>商品名称</td>';
        // shangpin += '<td style="width: 200px;">生产机构</td>';
        // shangpin += '<td style="width: 60px;">订金</td>';
        // shangpin += '<td style="width: 60px;">预付</td>';
        // shangpin += '<td style="width: 60px;">价格</td>';
        // shangpin += '<td style="width: 100px;">数量</td>';
        // shangpin += '<td style="width: 100px;">承担人员</td>';
        // shangpin += '</tr>';
        // shangpin += '</thead>';
        // shangpin += '<tbody>';
        // for (var i = 0; i < shangpins.length; i++) {
        //     shangpin += '<tr>';
        //     shangpin += '<td style="width: 30px;"><input type="checkbox" '+(shangpins[i]["CDJG_NAME"] != undefined ? 'disabled="disabled"' : '')+'  class="spcheck" spName="'+shangpins[i]["YC_NAME"]+'" spYcId="' + shangpins[i]["YC_ID"] + '" spId="' + shangpins[i]["NE_ID"] + '" jgId="' + shangpins[i]["JG_ID"] + '" name="check"/></td>';
        //     shangpin += '<td>' + shangpins[i]["YC_NAME"] + '</td>';
        //     shangpin += '<td style="width: 200px;">' + (shangpins[i]["JG_NAME"] == undefined ? '' : shangpins[i]["JG_NAME"]) + '</td>';
        //     shangpin += '<td style="width: 60px;">' + (shangpins[i]["NE_PRICE_DINGJING"] == undefined ? '' : shangpins[i]["NE_PRICE_DINGJING"]) + '</td>';
        //     shangpin += '<td style="width: 60px;">' + (shangpins[i]["NE_PRICE_YUFU"] == undefined ? '' : shangpins[i]["NE_PRICE_YUFU"]) + '</td>';
        //     shangpin += '<td style="width: 60px;">' + shangpins[i]["NE_PRICE"] + '</td>';
        //     shangpin += '<td style="width: 100px;">' + shangpins[i]["NE_CNT"] + '</td>';
        //     shangpin += '<td style="width: 100px;">' + (shangpins[i]["CDJG_NAME"] == undefined ? '待派' : shangpins[i]["CDJG_NAME"]) + '</td>';
        //     shangpin += '</tr>';
        // }
        // shangpin += '</tbody>';
        // shangpin += '</table>';
        // shangpin += '</div>';
        // shangpin += '</div>';
        // shangpin += '</div>';
        // shangpin += '</div>';
        // $('#' + moFormObj.moFormId + ' .shangpinliebiao').html(shangpin);
        // $('#' + moFormObj.moFormId + ' .shangpinliebiao .spcheck').unbind("change").bind("change", function (event, data) {
        //     var spObj = {};
        //     $('#' + moFormObj.moFormId + ' .shangpinliebiao .spcheck').each(function (index, obj) {
        //         var spId = $(obj).attr("spId");
        //         var jgId = $(obj).attr("jgId");
        //         var spYcId = $(obj).attr("spYcId");
        //         var spName = $(obj).attr("spName");
        //         if ($(obj).is(':checked')) {
        //             var sp = {};
        //             sp['spId'] = spId;
        //             sp['jgId'] = jgId;
        //             sp['spYcId'] = spYcId;
        //             sp['spName'] = spName;
        //             spObj[spId] = sp;
        //         }
        //     })
        //     moFormObj.doObj['spObj'] = spObj;
        // });

    }

}

function W() {
    this.moFormObj = null;
    this.helpDimTreeSel = {};
    var t = this;
    this.getNext = getNext;
    function getNext() {
        $("#" + t.moFormObj.moFormId + " .wid").html("");
        t.moFormObj.doObj.DO_TYPE = "wGetNext";
        $.ajax({
            type: "post",
            url: '/corePub/w.jsp',
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.moFormObj.doObj)
            },
            success: function (data) {
                if (data.s) {
                    $("#" + t.moFormObj.moFormId + " .wid").html(data.d);
                    $("#" + t.moFormObj.moFormId + " .wid .wkSubMitBtn").bind("click", function (e) {
                        goNext($(e.target).attr("wkNextId"));
                    });
                } else {
                    $("#" + t.moFormObj.moFormId).changeAlert(data);
                }
            }
        });


        $("#" + t.moFormObj.moFormId + " .wid .coreTree").each(function (index, allObj) {
            t.helpDimTreeSel[$(allObj).attr("id")] = new HelpDimTreeSel($(allObj).attr("id"));
            $(t.helpDimTreeSel[$(allObj).attr("id")]).bind("change", function (event, data) {
            });
            t.helpDimTreeSel[$(allObj).attr("id")].init();

        });
        $("#" + t.moFormObj.moFormId + " .wid .dropdown-menu").bind("click", function (e) {
            e.stopPropagation();
        });

    }

    this.init = init;
    function init(moFormObj) {
        this.moFormObj = moFormObj;
        $("#" + t.moFormObj.moFormId + " .wid").html("");
    }

    this.goNext = goNext;
    function goNext(toId) {
        t.moFormObj.doObj.DO_TYPE = "wGoNext";
        t.moFormObj.doObj.wkPi.wkNextNodeId = toId;
        if (undefined != t.helpDimTreeSel["coreWkTree" + toId]) {
            t.moFormObj.doObj.wkPi.wkNextNodeUserId = t.helpDimTreeSel["coreWkTree" + toId].get();
        } else {
            t.moFormObj.doObj.wkPi.wkNextNodeUserId.dicVal = {};
        }
        $.ajax({
            type: "post",
            url: '/corePub/w.jsp',
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.moFormObj.doObj)
            },
            success: function (data) {
                t.moFormObj.afterWkSubmit(data);
            }
        });

    }
}

function W2() {
    this.moFormObj = null;
    this.helpDimTreeSel = {};
    var t = this;
    this.getNext = getNext;
    function getNext(moFormObj) {
        t.moFormObj = moFormObj;
        $("#" + t.moFormObj.moFormId + " .wid").html("");
        t.moFormObj.doObj.DO_TYPE = "wGetNext";
        $.ajax({
            type: "post",
            url: '/corePub/w2.jsp',
            dataType: "json",
            async: false,
            data: {
                "doObj": JSON.stringify(t.moFormObj.doObj)
            },
            success: function (data) {
                if (data.s) {
                    $("#" + t.moFormObj.moFormId + " .wid").html(data.d);
                    $("#" + t.moFormObj.moFormId + " .wid .wkSubMitBtn").unbind("click").bind("click", function (e) {
                        t.moFormObj.doObj.d = t.moFormObj.f.read(t.moFormObj);
                        goNext(t.moFormObj, $(e.target).attr("wk"));

                    });
                } else {
                    $("#" + t.moFormObj.moFormId).changeAlert(data);
                }
            },
            error: function () {
                //alert("error");
            }
        });
        this.getFormDim = getFormDim;
        function getFormDim(wfval) {
            $("#" + t.moFormObj.moFormId + " .shangpinliebiaoForm").html("");
            t.moFormObj.doObj.DO_TYPE = "wGetFormDim";
            $.ajax({
                type: "post",
                url: '/corePub/w.jsp',
                dataType: "json",
                async: false,
                data: {
                    "doObj": JSON.stringify(t.moFormObj.doObj)
                },
                success: function (data) {
                    if (data.s) {
                        t.moFormObj.doObj.wkFormDim = data.d;
                        var html = "";
                        for (key in data["d"]) {
                            t.moFormObj.doObj.wkFormNodeId = key;
                            for (keyTemp in data["d"][key]) {
                                var expression = JSON.parse(data["d"][key][keyTemp]["expression"]);
                                html += "<div class=\"row\">";
                                html += "<div class=\"col-md-6\">";
                                html += "<div class=\"form-group\">";
                                html += "<label class=\"col-md-2 control-label\">" + expression["n"] + "</label>";
                                html += "<div class=\"col-md-10\">";
                                html += "<input type=\"" + expression["t"] + "\" class=\"form-control needCtl needSave needBasic\" dType=\"" + expression["dt"] + "\" ctlName=\"" + expression["n"] + "\" name=\"" + expression["n"] + "\" filedName=\"" + expression["n"] + "\" placeholder=\"" + expression["e"] + "\" data-error=\"" + expression["e"] + "!\">";
                                html += "   <div class=\"help-block with-errors\"></div>";
                                html += "</div>";
                                html += "</div>";
                                html += "</div>";
                                html += "</div>";
                            }
                        }
                        $("#" + t.moFormObj.moFormId + " .shangpinliebiaoForm").html(html);
                        setFormDim(t.moFormObj, wfval);
                    } else {
                        $("#" + t.moFormObj.moFormId).changeAlert(data);
                    }
                },
                error: function () {
                    //alert("error");
                }
            });
        };
        this.setFormDim = setFormDim;
        function setFormDim(moFormObj, jsonValue) {
            var t = $('#' + moFormObj.moFormId + " .shangpinliebiaoForm");
            $(t).find(" .needSave").each(function (index, obj) {
                if ($(obj).attr("dType") == "text") {
                    var formDomName = $(obj).attr("name");
                    if (formDomName in jsonValue) {
                        $(obj).val(jsonValue[formDomName]);
                    } else {
                        if (formDomName != 'YC_FBRJGID' & formDomName != 'YC_FBRJGNAME') {
                            $(obj).val("");
                        }
                    }
                }
                else if ($(obj).attr("dType") == "checkbox") {
                    var formDomName = $(obj).attr("name");
                    if (formDomName in jsonValue) {
                        if (jsonValue[formDomName] == 1) {
                            $(obj).attr("checked", "checked");
                        } else {
                            $(obj).attr("checked", false);
                        }
                    }
                    else {
                        $(obj).attr("checked", false);
                    }
                }
                else if ($(obj).attr("dType") == "radio") {
                    var formDomName = $(obj).attr("name");
                    $(obj).find(" input").each(
                        function () {
                            if ($(this).attr("type") == "radio") {
                                if (formDomName in jsonValue) {
                                    if (jsonValue[formDomName] == $(this).val()) {
                                        $(this).attr("checked", "checked");
                                    }
                                } else {
                                    $(obj).attr("checked", false);
                                }
                            }
                        });
                }
                else if ($(obj).attr("dType") == "uEditor") {
                    var ue = UE.getEditor($(obj).attr("id"));
                    if ($(obj).attr("id") in jsonValue) {
                        ue.addListener("ready", function () {
                            ue.setContent(jsonValue[$(obj).attr("id")]);
                        });

                    } else {
                        ue.addListener("ready", function () {
                            ue.setContent("");
                        });

                    }
                }
                else if ($(obj).attr("dType") == "coreHelp") {
                    var formDomName = $(obj).attr("id");
                    if (formDomName in jsonValue) {
                        moFormObj.coreHelp[formDomName].set(jsonValue[formDomName]);
                    } else {
                        moFormObj.coreHelp[formDomName].set("");
                    }
                }
            });

        }

        $("#" + t.moFormObj.moFormId + " .wid .coreTree").each(function (index, allObj) {
            t.helpDimTreeSel[$(allObj).attr("id")] = new HelpDimTreeSel($(allObj).attr("id"));
            $(t.helpDimTreeSel[$(allObj).attr("id")]).bind("change", function (event, data) {
            });
            t.helpDimTreeSel[$(allObj).attr("id")].init();

        });
        $("#" + t.moFormObj.moFormId + " .wid .dropdown-menu").bind("click", function (e) {
            e.stopPropagation();
        });

    }

    this.init = init;
    function init(moFormObj) {
//            this.moFormObj = moFormObj;
//            $("#" + t.moFormObj.moFormId + " .wid").html("");
    }

    this.goNext = goNext;
    function goNext(moFormObj, wk) {
        t.moFormObj = moFormObj;
        t.moFormObj.doObj.DO_TYPE = "wGoNext";
        var wkJson = JSON.parse(wk);
        var wkJsonVal = JSON.parse(wk);
        wkJson["nextNodeUserId"] = {};
        if (undefined != t.helpDimTreeSel["coreWkTree" + wkJson["nextNodeId"]]) {
            wkJson["nextNodeUserId"] = t.helpDimTreeSel["coreWkTree" + wkJson["nextNodeId"]].get();
        } else {
            wkJson["nextNodeUserId"].dicVal = {};
        }


        //修改a b
        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].do = wkJson;
        t.moFormObj.doObj.w2.doWK = wkJson["pdKey"];

        var bdata={"s":false};
        t.moFormObj.doObj.fjd=t.moFormObj.f.readFJ(t.moFormObj);
        if( t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].do.b){//读取附加Form
            t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].do.a = false;

            $.ajax({
                type: "post",
                url: t.moFormObj.ajaxUrl,
                dataType: "json",
                async: false,
                data: {
                    "doObj": JSON.stringify(t.moFormObj.doObj)
                },
                success: function (data) {
                    if(data.s && data["YC_ID"]!=undefined && data["YC_ID"]!=""){
                        t.moFormObj.doObj["YC_ID"] = data["YC_ID"];
                        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].dim.WHereValue = data["YC_ID"];
                        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].dim.bus.InfoId = data["YC_ID"];
                    }
                    if(data.s && data["YC_NAME"]!=undefined && data["YC_NAME"]!=""){
                        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].dim.bus.InfoName = data["YC_NAME"];
                    }
                    bdata = data;
                }
            });
        }
        if(( wkJson["b"] && bdata.s ) || !wkJson["b"]){
            t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].do.b = false;
            $.ajax({
                type: "post",
                url: "/corePub/w2.jsp",
                dataType: "json",
                async: false,
                data: {
                    "doObj": JSON.stringify(t.moFormObj.doObj)
                },
                success: function (data) {
                    if(data.s){
                        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].sta.crtPiId = data["d"]["piId"];
                        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].sta.crtTaskId = data["d"]["taskId"];

                        t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].do.a = wkJsonVal["a"];
                        if(t.moFormObj.doObj.w2.wk[wkJson["pdKey"]].do.a){
                            $.ajax({
                                type: "post",
                                url: t.moFormObj.ajaxUrl,
                                dataType: "json",
                                async: false,
                                data: {
                                    "doObj": JSON.stringify(t.moFormObj.doObj)
                                },
                                success: function (adata) {
                                    t.moFormObj.afterWkSubmit(adata);
                                }
                            });
                        }else{
                            t.moFormObj.afterWkSubmit(data);
                        }
                    }else {
                        t.moFormObj.afterWkSubmit(data);
                    }
                }
            });
//
        }else{
            t.moFormObj.afterWkSubmit(bdata);
        }
    }
}

function hideWKMo() {
    $("#wkMoTo").modal("hide");
}

function showWkMo() {
    $("#wkMoTo").modal("show");
}

function showLoading(text) {
    // $("#loadingText").html(text);
    $("#loading").modal("show");
}

function hideLoading() {
    $("#loading").modal("hide");
}

var needFileDomId = "";

var fileType = "";

function getFile(fileTypeIn, id) {
    $('#fileUpload').modal({
        backdrop: 'static',
        keyboard: false
    });
    needFileDomId = id;
    fileType = fileTypeIn;
}

function fileUpload() {
    var url = "/corePub/fileUpload.jsp?fileType=" + fileType;
    $.ajaxFileUpload({
        url: url,            //需要链接到服务器地址
        secureuri: true,
        type: "get",
        fileElementId: 'file_f',                        //文件选择框的id属性
        success: function (data, status) {
            var results = $(data).find('body').html();
            var obj = eval("(" + results + ")");
            if (obj.s) {
                $('#' + needFileDomId).val(obj.url);
            } else {
                alert('文件上传失败！');
            }
            $('#fileUpload').modal('hide');
        }, error: function (data, status, e) {
            alert('文件上传失败！');
        }
    });
}

$.fn.changeAlert = function (data) {
    if (data == undefined) {
        $(this).find(" .moAlert").hide("slow");
    } else {
        $(this).find(" .moAlert").hide("slow");
        $(this).find(" .moAlert > div").removeClass();
        $(this).find(" .moAlert > div").addClass("alert alert-" + data['msgTpye']);
        $(this).find(" .moAlert > div strong").html(data.msg);
        $(this).find(" .moAlert > div span").html(data.msgMore);
        $(this).find(" .moAlert > div").show("slow");
        $(this).find(" .moAlert").show("slow");
    }
};

$.initColTree = function (treeDomId) {
    var openedNodeVal = {};
    var activeNodeVal = '';


    $('#' + treeDomId + ' li:has(ol)').find(' > ol > li').hide('slow');
    $('#' + treeDomId + " .corePli > table > tbody > tr > .col1 > i").addClass('glyphicon glyphicon-triangle-right');

    $('#' + treeDomId + ' .glyphicon-minus').each(function (index, openedObj) {
        openedNodeVal[$(openedObj).parent().parent().attr("nodeId")] = true;
    });
    $('#' + treeDomId).attr("openedNode", JSON.stringify(openedNodeVal));

    var node = $('#' + treeDomId + ' li:has(ol) > table > tbody > tr > .col1 > i');
    node.removeClass('glyphicon-triangle-right').addClass('glyphicon-plus');
    node.unbind("click");
    node.bind("click", function (e) {
        var children = $(e.target).parent().parent().parent().parent().parent().find(' >ol > li');
        if (children.is(":visible")) {
            children.hide('slow');
            $(e.target).removeClass('glyphicon-minus').addClass('glyphicon-plus');
        } else {
            children.show('slow');
            $(e.target).removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
        $('#' + treeDomId + ' .glyphicon-minus').each(function (index, openedObj) {
            openedNodeVal[$(openedObj).parent().parent().attr("nodeId")] = true;
        });
        $('#' + treeDomId).attr("openedNode", openedNodeVal);
        e.stopPropagation();
    });
    $('#' + treeDomId + ' .corePli > table').unbind('click');
    $('#' + treeDomId + ' .corePli > table').bind('click', function (e) {
        $('#' + treeDomId + ' .corePli > table').removeClass("active");
        $(e.target).parents("table").addClass("active");
        $('#' + treeDomId).attr("activeNode", $(this).find(' .col1 > i ').attr("treeId"));
        e.stopPropagation();
    });
    if ($('#' + treeDomId).attr("openedNode") != undefined) {

        var openedNodeValFromTree = JSON.parse($('#' + treeDomId).attr("openedNode"));
        for (var aaaaa in openedNodeValFromTree) {
            var openNode = $('#' + treeDomId + ' tr[nodeId=' + aaaaa + '] ');
            var children = openNode.parent().parent().parent().find(' >ol > li');
            children.show('slow');
            openNode.find(" .col1 > i").removeClass('glyphicon-plus').addClass('glyphicon-minus');
        }
        activeNodeVal = $('#' + treeDomId).attr("activeNode");
        if (activeNodeVal == undefined) {
            activeNodeVal = "";
        }

        $('#' + treeDomId + ' .openedNode').each(function (index, obj) {
            openedNodeVal[$(obj).parent().attr("treeId")] = true;
            var children = $(obj).parent().parent().parent().find(' >ol > li');
            children.show('slow');
            openedNodeVal[$(this).attr("id")] = true;
            $($(obj).find(" > .col1 > i ")).removeClass('glyphicon-plus').addClass('glyphicon-minus');
        });

        $('#' + treeDomId + ' .active').parents('li').find(' > ol > li').show('slow');
        $('#' + treeDomId + ' .active').parents('li > table').addClass('active');
        $('#' + treeDomId + ' .active').parents('ol > li').find(' > table > tbody > tr > .col1 > i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
        $('#' + treeDomId).attr("openedNode", openedNodeVal);
    }
};

function HelpRichEditer(dicDomId) {
    this.dicDomId = dicDomId;
    this.type = "richEditer";
    this.nodeId = 1;
    this.coreHelp = {};
    this.doObj = {
        "dicDomId": dicDomId,
        "d": {}
    };
    this.defualtData = {};

    var t = this;

    this.init = init;
    function init() {
        $("#" + t.dicDomId + " .richHelp").each(function (index, coreHelpObj) {
            if ($(coreHelpObj).attr("richHelpType") == "HelpDimTreeSel") {
                t.coreHelp[$(coreHelpObj).attr("id")] = new HelpDimTreeSel($(coreHelpObj).attr("id"));
                ;
                t.coreHelp[$(coreHelpObj).attr("id")].init();
            }
        });


        $("#" + t.dicDomId + " .dropdown-menu").unbind("click");
        $("#" + t.dicDomId + " .dropdown-menu").bind("click", function (e) {
            e.stopPropagation();
        });
        $("#" + t.dicDomId + " .richBtn").unbind("click");
        $("#" + t.dicDomId + " .richBtn").bind("click", function (e) {
            $(e.target).parents("#" + t.dicDomId + " .richGroup").find(".richSubMitAdd").removeClass("hidden");
            $(e.target).parents("#" + t.dicDomId + " .richGroup").find(".richSubMitSave").addClass("hidden");
            $(e.target).parents("#" + t.dicDomId + " .richGroup").find(".richSubMitDel").addClass("hidden");
        });


        $("#" + t.dicDomId + " .richSubMitSave").unbind("click");
        $("#" + t.dicDomId + " .richSubMitSave").bind("click", function (e) {
            $($(e.target).parents("#" + t.dicDomId + " .richForm")).find(" input").each(
                function (index, inputObj) {
                    $("#" + t.dicDomId + " .targetDom .active .richField").each(function (index, obj) {

                        if ($(obj).attr("richInputName") == $(inputObj).attr('name')) {
                            $(obj).attr("richInputVal", $(inputObj).val());
                            $(obj).html("<span>" + $(inputObj).attr('name') + ":" + $(inputObj).val() + "</span>");
                        }
                    });
                });
            $.initColTree($("#" + t.dicDomId + " .targetDom").attr("id"));
        });
        $("#" + t.dicDomId + " .richSubMitDel").unbind("click");
        $("#" + t.dicDomId + " .richSubMitDel").bind("click", function (e) {
            if ($("#" + t.dicDomId + " .targetDom .active").parent().has("ol > li").length == 0) {
                $("#" + t.dicDomId + " .targetDom .active").parent().parent().remove();
                $(e.target).parents("#" + t.dicDomId + " .richGroup").find(".richBtn").dropdown('toggle');
                $(t).trigger("change", [get()]);
            } else {
                alert("含有子节点，不能删除");
            }
        });

        $("#" + t.dicDomId + " .richSubMitReset").unbind("click");
        $("#" + t.dicDomId + " .richSubMitReset").bind("click", function (e) {
            reset();
        });
        $("#" + t.dicDomId + " .richSubMitAdd").unbind("click");
        $("#" + t.dicDomId + " .richSubMitAdd").bind("click", function (e) {
            t.nodeId += 1;
            var addHtml = "";
            addHtml += "<ol>";
            addHtml += "    <li class='corePli'>";
            addHtml += "        <table style='width:100%;'>";
            addHtml += "            <tbody>";
            addHtml += "                <tr nodeId='" + t.nodeId + "' richPath = '" + t.nodeId + "' richNodeId = '" + t.nodeId + "' richGroupId =  '" + $($(e.target).parents(".richGroup")).attr("richGroupId") + "'>";
            addHtml += "                    <td class='col1' style='width:1px'><i></i></td>";
            addHtml += "                    <td class='col2' style='width:1px'><i></i></td>";
            $($(e.target).parents("#" + t.dicDomId + " .richForm")).find(" input").each(
                function (index, inputObj) {
                    //if($(inputObj).attr('Xianshi')=='true'){
                        addHtml += "                    <td class='richField' tdWidth='" + $(inputObj).attr('tdWidth') + "' richInputName ='" + $(inputObj).attr('name') + "' richInputVal ='" + $(inputObj).val() + "' style = 'width:" + $(inputObj).attr('tdWidth') + "'><span>" + $(inputObj).attr('name') + ":" + $(inputObj).val() + "</span></td>";
                    //}
                });
            addHtml += "                </tr>";
            addHtml += "            </tbody>";
            addHtml += "        </table>";
            addHtml += "    </li>";
            addHtml += "</ol>";

            var addObj = $(addHtml);
            if ($("#" + t.dicDomId + " .targetDom .active").length == 0) {
                $("#" + t.dicDomId + " .targetDom").append($(addObj));
            } else {
                var crtPath = $("#" + t.dicDomId + " .targetDom .active").parent().find(" > table > tbody > tr").attr("richPath") + "|" + t.nodeId;
                $(addObj).find(" > li > table > tbody > tr").attr("richPath", crtPath);
                $("#" + t.dicDomId + " .targetDom .active").parent().append($(addObj));
            }

            $.initColTree($("#" + t.dicDomId + " .targetDom").attr("id"));
            $("#" + t.dicDomId + "  .corePli > table").unbind('dblclick');
            $("#" + t.dicDomId + "  .corePli > table").bind('dblclick', function (e) {

                var richGroupId = $(e.target).parents("#" + t.dicDomId + " tr").attr("richGroupId");
                $("#" + t.dicDomId + " .richGroup").each(function (index, richGroupObj) {

                    if ($(richGroupObj).attr("richGroupId") == richGroupId) {

                        var richBtn = $(richGroupObj).find(".richBtn");
                        $(richBtn).dropdown('toggle');

                        $(richGroupObj).find(".richSubMitSave").removeClass("hidden");
                        $(richGroupObj).find(".richSubMitDel").removeClass("hidden");
                        $(richGroupObj).find(".richSubMitAdd").addClass("hidden");
                        $(e.target).parents("#" + t.dicDomId + "  table").find(".richField").each(function (index, richInput) {
                            $(richGroupObj).find(" .richForm [name=" + $(richInput).attr("richInputName") + "]").val($(richInput).attr("richInputVal"));
                        });
                    }
                });
                $(t).trigger("change", [get()]);
            });
            $(t).trigger("change", [get()]);
        });

        $("#" + t.dicDomId + "  .corePli > table").unbind('dblclick');
        $("#" + t.dicDomId + "  .corePli > table").bind('dblclick', function (e) {

            var richGroupId = $(e.target).parents("#" + t.dicDomId + " tr").attr("richGroupId");
            $("#" + t.dicDomId + " .richGroup").each(function (index, richGroupObj) {

                if ($(richGroupObj).attr("richGroupId") == richGroupId) {

                    var richBtn = $(richGroupObj).find(".richBtn");
                    $(richBtn).dropdown('toggle');

                    $(richGroupObj).find(".richSubMitSave").removeClass("hidden");
                    $(richGroupObj).find(".richSubMitDel").removeClass("hidden");
                    $(richGroupObj).find(".richSubMitAdd").addClass("hidden");
                    $(e.target).parents("#" + t.dicDomId + "  table").find(".richField").each(function (index, richInput) {
                        $(richGroupObj).find(" .richForm [name=" + $(richInput).attr("richInputName") + "]").val($(richInput).attr("richInputVal"));
                    });
                }
            });
            $(t).trigger("change", [get()]);
        });
        $.initColTree($("#" + t.dicDomId + " .targetDom").attr("id"));
    }

    this.get = get;
    function get() {
        var Res = {
            "dicVal": []
        };
        var treeObj = [];
        $("#" + t.dicDomId + " .targetDom .corePli > table  > tbody > tr").each(function (index, trObj) {
            var treeVal = {};
            treeVal['PATH_INFO'] = $(trObj).attr("richPath");
            treeVal['SORT'] = index;
            treeVal['YC_ID'] = $(trObj).attr("richNodeId");
            var richField = {};
            $(trObj).find(".richField").each(function (fieldIndex, fieldObbj) {
                var field = {};
                field['value'] = $(fieldObbj).attr("richInputVal");
                field['tdWidth'] = $(fieldObbj).attr("tdWidth");
                richField[$(fieldObbj).attr("richInputName")] = field;
            })
            treeVal['field'] = richField;
            treeVal['groupId'] = $(trObj).attr("richGroupId");
            ;
            treeObj[index] = treeVal;
        });
        var theTreeRetAry = treeObj;
        var d = {};
        for (var i = 0; i < theTreeRetAry.length; i++) {
            var theRow = theTreeRetAry[i];
            var PATH_INFO = theRow['PATH_INFO'];
            var theTmp = d;
            if (PATH_INFO != theRow["YC_ID"]) {
                var theVatherV = PATH_INFO.split("|");
                var theMaxJ = theVatherV.length;
                theMaxJ = theMaxJ - 1;
                for (var j = 0; j < theMaxJ; j++) {
                    if (!(("SON" + theVatherV[j]) in theTmp)) {
                        var SON = {};
                        SON["SORT"] = i;
                        SON["SON" + theVatherV[j]] = SON;
                    }
                    theTmp = theTmp["SON" + theVatherV[j]];
                }
            }
            theTmp["SON" + theRow["YC_ID"]] = theRow;
        }
        Res["dicVal"] = d;
        return Res;
    }

    this.disable = disable;
    function disable() {
        $(e.target).parents("#" + t.dicDomId + " .richGroup").find(".richSubMitAdd").addClass("hidden");
        $(e.target).parents("#" + t.dicDomId + " .richGroup").find(".richSubMitSave").addClass("hidden");
        $("#" + t.dicDomId + " .richSubMitSave").unbind("click");
        $("#" + t.dicDomId + " .dropdown-menu").unbind("click");
    }

    this.hid = hid;
    function hid() {
        console.log("HelpRichEditer--hid待开发");
    }

    this.reset = reset;
    function reset() {
        $("#" + t.dicDomId + " .targetDom").html("");
        var val = t.defualtData["dicVal"];
        $("#" + t.dicDomId + " .targetDom").append($(addCrtNode(val, "")));
        init();

    }

    this.style = style;
    function style() {
        $("#" + t.dicDomId + " .targetDom .active").removeClass("active");
        $.initColTree($("#" + t.dicDomId + " .targetDom").attr("id"));
    }

    function addCrtNode(crtNodeObj, crtHtml) {
        var val = crtNodeObj;
        var allHtml = crtHtml;
        for (var node in val) {
            if (node.substring(0, 3) == "SON") {
                var nodeId = val[node]['YC_ID'];
                t.nodeId = parseInt(nodeId);
                var nodeHead = "";
                var sonHtml = "";
                var nodeFoot = "";
                nodeHead += "<ol>";
                nodeHead += "    <li class='corePli'>";
                nodeHead += "        <table style='width:100%;'>";
                nodeHead += "            <tbody>";
                nodeHead += "                <tr  nodeId='" + val[node]['YC_ID'] + "' richPath = '" + val[node]['PATH_INFO'] + "' richNodeId = '" + val[node]['YC_ID'] + "' richGroupId =  '" + val[node]['groupId'] + "'>";
                nodeHead += "                    <td class='col1' style='width:1px'><i></i></td>";
                nodeHead += "                    <td class='col2' style='width:1px'><i></i></td>";
                for (var crtfield in val[node]['field']) {
                    nodeHead += "                    <td class='richField' tdWidth='" + val[node]['field'][crtfield]['tdWidth'] + "' richInputName ='" + crtfield + "' richInputVal ='" + val[node]['field'][crtfield]['value'] + "' style = 'width:" + val[node]['field'][crtfield]['tdWidth'] + "'><span>" + crtfield + ":" + val[node]['field'][crtfield]['value'] + "</span></td>";
                }
                nodeHead += "                </tr>";
                nodeHead += "            </tbody>";
                nodeHead += "        </table>";

                var iHasSon = false;
                for (var mySon in val[node]) {
                    if (mySon.substring(0, 3) == "SON") {
                        iHasSon = true;
                        break;
                    }
                }
                if (iHasSon) {
                    sonHtml += addCrtNode(val[node], "");
                }
                nodeFoot += "    </li>";
                nodeFoot += "</ol>";
                allHtml += nodeHead + sonHtml + nodeFoot;
            }
        }
        return allHtml;
    }

    this.set = set;
    function set(defaultVal) {
        t.defualtData = defaultVal;
        $("#" + t.dicDomId + " .targetDom").html("");
        var val = defaultVal["dicVal"];
        $("#" + t.dicDomId + " .targetDom").append($(addCrtNode(val, "")));
        init();
    }

    /*this.init = init;
    function init() {
        console.log("HelpRichEditer--init待开发");
    }*/
}

//模态框FORM表单
function WKCoreMo(moFormId, ajaxUrl, myList,userId) {
    this.f = new F2();
    this.w = new W2();
    this.ajaxUrl = ajaxUrl;
    this.moFormId = moFormId;
    this.myList = myList;
    this.coreHelp = {};
    this.userId = userId;
    var t = this;

    this.doObj = {
            "DO_TYPE": "",
            "YC_ID": "",
            "sta": "",
            "treePath": "",
            "siteId": "",
            "neSelected": {},
            "d": {},
            "fjd": {},
            "w2": {
                "doWK":"",
                "session": {
                    "loginUserId": t.userId
                },
                "wk": {
                    "JiGouXinXiFaBu": {
                        "isMain": true,
                        "sort": 1,
                        "do": {
                            "submitType": "",
                            "crtNodeId": "",
                            "crtLineId": "",
                            "nextNodeId": "",
                            "nextNodeUserId": {
                                "dicVal": {}
                            },
                            "a": false,
                            "b": false
                        },
                        "sta": {
                            "crtPiId": "",
                            "crtTaskId": "",
                            "actNodeIds": [
                                {"nodeid": "start", "piid": ""},
                                {"nodeid": "end", "piid": ""}
                            ]
                        },
                        "dim": {
                            "doWithSta":{
                                "basicSta":"0|1",
                                "piSta":".*main__.*|.*(?i)main_orderJiGouPaiDan_N1.*|.*(?i)main_orderJiGouPaiDan_N2.*"
                            },"bus": {
                                "InfoId": "",
                                "InfoName": "",                   //订单名称（订单机构下产品等）  如果为信息，此内容为信息名称，将出现在待办表中；
                                "formPath": t.myList.doObj.formPath
                            },
                            "TabName": "CORE_NE_BASIC_TREE_RE",
                            "WhereField": "YC_ID",
                            "WHereValue": "",
                            "piidField": "PI_ID",
                            "PiStartValue": 1,
                            "busSta": "ZHUANGTAI",
                            "PiEndValue": 2,
                            "style": "fontColorRed"
                        }
                    },
                    "JiGouXinXiFaBuXiaJia": {
                        "isMain": false,
                        "sort": 3,
                        "do": {
                            "submitType": "",
                            "crtNodeId": "",
                            "crtLineId": "",
                            "nextNodeId": "",
                            "nextNodeUserId": {
                                "dicVal": {}
                            },
                            "a": false,
                            "b": false
                        },
                        "sta": {
                            "crtPiId": "",
                            "crtTaskId": "",
                            "actNodeIds": [
                                {"nodeid": "start", "piid": ""},
                                {"nodeid": "end", "piid": ""}
                            ]
                        },
                        "dim": {
                            "doWithSta": {
                                "basicSta": "2|3",
                                "piSta":".*main__.*|.*(?i)main_orderJiGouPaiDan_N1.*|.*(?i)main_orderJiGouPaiDan_N2.*"
                            },
                            "bus": {
                                "InfoId": "",
                                "InfoName": "",                   //订单名称（订单机构下产品等）  如果为信息，此内容为信息名称，将出现在待办表中；
                                "formPath": t.myList.doObj.formPath
                            },
                            "TabName": "CORE_NE_BASIC_TREE_RE",
                            "WhereField": "YC_ID",
                            "WHereValue": "",
                            "piidField": "PI_ID",
                            "PiStartValue": 3,
                            "busSta": "ZHUANGTAI",
                            "PiEndValue": 2,
                            "style": "fontColorRed"
                        }
                    },
                    "JiGouXinXiFaBuDel": {
                        "isMain": false,
                        "sort": 2,
                        "do": {
                            "submitType": "",
                            "crtNodeId": "",
                            "crtLineId": "",
                            "nextNodeId": "",
                            "nextNodeUserId": {
                                "dicVal": {}
                            },
                            "a": false,
                            "b": false
                        },
                        "sta": {
                            "crtPiId": "",
                            "crtTaskId": "",
                            "actNodeIds": [
                                {"nodeid": "start", "piid": ""},
                                {"nodeid": "end", "piid": ""}
                            ]
                        },
                        "dim": {
                            "doWithSta": {
                                "basicSta": "^[1-9]\d*$",
                                "piSta":".*main__.*|.*(?i)main_orderJiGouPaiDan_N1.*|.*(?i)main_orderJiGouPaiDan_N2.*"
                            },
                            "bus": {
                                "InfoId": "",
                                "InfoName": "",                   //订单名称（订单机构下产品等）  如果为信息，此内容为信息名称，将出现在待办表中；
                                "formPath": t.myList.doObj.formPath
                            },
                            "TabName": "CORE_NE_BASIC_TREE_RE",
                            "WhereField": "YC_ID",
                            "WHereValue": "",
                            "piidField": "PI_ID",
                            "PiStartValue": 1,
                            "busSta": "ZHUANGTAI",
                            "PiEndValue": 2,
                            "style": "fontColorRed"
                        }
                    }
                }
            }
        };

    t.w.init(t);

    this.setWkDim = setWkDim;
    function setWkDim(wkDimIn) {
        t.doObj.wkDim = wkDimIn;
    }

    this.setWkPi = setWkPi;
    function setWkPi(wkPiIn) {
        t.doObj.wkPi = wkPiIn;
    }

    this.wkEdit = wkEdit;
    function wkEdit(row,doObj) {
        t.doObj.YC_ID = row['InfoId'];
        $('#remoteContent').modal();
        $("#" + t.moFormId).changeAlert();
        loadData();
    }

    this.afterWkSubmit = afterWkSubmit;
    function afterWkSubmit(retObj) {
        $("#" + t.moFormId).changeAlert(retObj);
        loadData();
        t.myList.loadListByForm();
    }

    $("#" + t.moFormId + " .coreHelp").each(function (index, coreHelpObj) {
        if ($(coreHelpObj).attr("coreHelpType") == "HelpDataDicSel") {
            t.coreHelp[$(coreHelpObj).attr("id")] = new HelpDataDicSel($(coreHelpObj).attr("id"));
            t.coreHelp[$(coreHelpObj).attr("id")].init();
        } else if ($(coreHelpObj).attr("coreHelpType") == "HelpRichEditer") {
            t.coreHelp[$(coreHelpObj).attr("id")] = new HelpRichEditer($(coreHelpObj).attr("id"));
            t.coreHelp[$(coreHelpObj).attr("id")].init();
        } else if ($(coreHelpObj).attr("coreHelpType") == "HelpDimTreeSel") {
            t.coreHelp[$(coreHelpObj).attr("id")] = new HelpDimTreeSel($(coreHelpObj).attr("id"));
            ;
            t.coreHelp[$(coreHelpObj).attr("id")].init();
        } else if ($(coreHelpObj).attr("coreHelpType") == "HelpFile") {
            t.coreHelp[$(coreHelpObj).attr("id")] = new HelpFile($(coreHelpObj).attr("id"));
            t.coreHelp[$(coreHelpObj).attr("id")].init();
        } else if ($(coreHelpObj).attr("coreHelpType") == "HelpDimTreeSelNew") {
            t.coreHelp[$(coreHelpObj).attr("id")] = new HelpDimTreeSelNew($(coreHelpObj).attr("id"));
            t.coreHelp[$(coreHelpObj).attr("id")].init();
        }
        $(t.coreHelp[$(coreHelpObj).attr("id")]).unbind("change").bind("change", function (event, data) {
        });

    });


    $("#" + t.moFormId).changeAlert();

    $("#" + t.moFormId + " .uEditor").each(function (index, uEditorObj) {
        UE.getEditor($(uEditorObj).attr("id"));
    });

    $("#" + t.moFormId).validator().on("validate.bs.validator", function (e) {
        $("#" + t.moFormId).changeAlert();
    });

    $("#" + t.moFormId).validator().on('submit', function (e) {
        if (e.isDefaultPrevented()) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        t.doObj.d = t.f.read(t);
        $.ajax({
            type: "Post",
            url: t.ajaxUrl,
            dataType: "json",
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data.s) {
                    t.doObj["RE_ID"] = data["RE_ID"];
                    $("#" + t.moFormId).changeAlert(data);
                    if (t.doObj["RE_ID"] == "") {
                        $('#remoteContent').modal("hide");
                    } else {
                        loadData();
                    }
                    //t.myList.loadListByForm();
                } else {
                    $("#" + t.moFormId).changeAlert(data);

                }
            }
        });
        e.preventDefault();
    });

    this.close = close;
    function close() {
        $("#" + t.moFormId + " .uEditor").each(function (index, uEditorObj) {
            UE.delEditor($(uEditorObj).attr("id"));
        });
    }

    this.edit = edit;
    function edit(ROW, listDoObj) {
        t.doObj.YC_ID = ROW['YC_ID'];
        // for (var key in listDoObj.wkDim) {
        //     t.doObj.wkDim[key] = listDoObj.wkDim[key];
        // }
        $('#remoteContent').modal();
        $("#" + t.moFormId).changeAlert();
        loadData();
    }

    this.add = add;
    function add(treePath, wkDim) {
        t.doObj.YC_ID = "";
        t.doObj.sta = "0";
        t.doObj.treePath = treePath;
        // for (var key in wkDim) {
        //     t.doObj.wkDim[key] = wkDim[key];
        // }
        $('#remoteContent').modal();
        t.f.set(t, {}, "add");
        $("#" + t.moFormId).changeAlert();
        // t.doObj.PI_ID = "";
        // t.doObj.RE_ID = "";

        //清空do和所有流程状态
        //清空所有的流程状态
        for(var key in t.doObj.w2.wk){
            t.doObj.w2.wk[key].sta.crtTaskId="";
            t.doObj.w2.wk[key].sta.crtPiId="";
        }
        t.doObj.w2.doWK = "";
        t.w.getNext(t);
    }
    this.loadData = loadData;
    function loadData() {
        $("#" + t.moFormId)[0].reset();
        t.doObj.DO_TYPE = "detail";
        t.doObj.w2.doWK="";
        $.ajax({
            type: "Post",
            url: t.ajaxUrl,
            dataType: "json",
            data: {
                "doObj": JSON.stringify(t.doObj)
            },
            success: function (data) {
                if (data["s"]) {
                    //清空所有的流程状态
                    for(var key in t.doObj.w2.wk){
                        t.doObj.w2.wk[key].sta.crtTaskId="";
                        t.doObj.w2.wk[key].sta.crtPiId="";
                    }

                    t.doObj.YC_ID = data["d"]['YC_ID'];
                    t.doObj.sta = data["d"]['STA'];
                    if(data["d"]["PDKEY"]!=undefined&&data["d"]["PDKEY"]!=""){
                        t.doObj.w2.wk[data["d"]["PDKEY"]].sta.crtPiId = data["d"]['PI_ID'];
                        t.doObj.w2.wk[data["d"]["PDKEY"]].dim.bus.InfoId = data["d"]['YC_ID'];
                        t.doObj.w2.wk["JiGouXinXiFaBuXiaJia"].dim.bus.InfoId = data["d"]['YC_ID'];
                        t.doObj.w2.wk[data["d"]["PDKEY"]].dim.bus.InfoName = data["d"]['YC_NAME'];
                        t.doObj.w2.wk["JiGouXinXiFaBuXiaJia"].dim.bus.InfoName = data["d"]['YC_NAME'];
                        t.doObj.w2.wk[data["d"]["PDKEY"]].dim.WHereValue = data["d"]['YC_ID'];
                        t.doObj.w2.wk["JiGouXinXiFaBuXiaJia"].dim.WHereValue = data["d"]['YC_ID'];
                        t.doObj.w2.wk[data["d"]["PDKEY"]].sta.crtTaskId = data["d"]["TASK_ID"];
                        t.doObj.w2.wk[data["d"]["PDKEY"]].do.crtNodeId = data["d"]["WK_CRT_NODE"];
                    }
//                        if (data["d"]['STA'] == t.doObj.wkPi.PiEndValue) {
//                            t.f.set(t, data["d"]['YC_JSON'], "afterPi");
//                        } else {
//                            t.f.set(t, data["d"]['YC_JSON'], "edit");
//                        }

                    t.f.set(t, data["d"]['YC_JSON']);
                    t.w.getNext(t);
                    //t.w.getFormDim(data["d"]["YC_JSON"]["wfval"]);
                }
//                    $("#" + t.moFormId).changeAlert(data);
//                    t.doObj.DO_TYPE = "";
//                    t.myList.moLoadList();
            }
        });
    }

    t.myList.setMoForm(t);
}


