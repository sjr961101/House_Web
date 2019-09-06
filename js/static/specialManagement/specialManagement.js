var chk_value = [];
var userTableInit = new Object();
var $table = $('#tb_users'),
    selections = [];
var logPageSize = 10;

$(function() {
    // 1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    $("#search").click(function(){
        console.log("success");
        $('#tb_users').bootstrapTable(('refresh'));
    });
});


var TableInit = function() {
    // 初始化Table
    userTableInit.Init = function() {
        $('#tb_users').bootstrapTable({
            // url: '../../js/static/specialManagement/specialManagement.json', // 请求后台的URL（*）
            url: ZEUS_BASE_URL + '/getList', // 请求后台的URL（*）
            method: 'post', // 请求方式（*）
            toolbar: '#toolbar', // 工具按钮用哪个容器
            striped: true, // 是否显示行间隔色
            cache: false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, // 是否显示分页（*）
            sortable: false, // 是否启用排序
            sortOrder: "asc", // 排序方式
            queryParams: userTableInit.queryParams, // 传递参数（*）
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: 10, // 每页的记录行数（*）
            pageList: [10, 25, 50, 100], // 可供选择的每页的行数（*）
            //			height : 456,
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            search: false, // 是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: false,
            showColumns: false, // 是否显示所有的列
            showRefresh: false, // 是否显示刷新按钮
            minimumCountColumns: 2, // 最少允许的列数
            clickToSelect: false, // 设置true 将在点击行时，自动选择rediobox 和 checkbox
            showToggle: false, // 是否显示详细视图和列表视图的切换按钮
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表、
            paginationLoop: true,
            maintainSelected: true,
            // responseHandler: function(res) { // res 为后台return的值
            //     $.each(res.rows, function(i, row) {
            //         row.state = $.inArray(row.id, selections) !== -1;
            //     });
            //     return res;
            // },

            columns: [{
                field: 'state',
                title: '全选',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            },  {
                field: 'id',
                visible: false
            },
                {
                field: 'community',
                title: '小区名'
            }, {
                field: 'location',
                title: '户型'
            }, {
                field: 'owner',
                title: '业主',
            }, {
                field: 'area',
                title: '面积',
            }, {
                field: 'phone',
                title: '电话',
            }, {
                field: 'houseType',
                title: '状态'
            }, {
                field: 'remark',
                title: '备注'
            }]
        });
    };
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function() {
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });
    // 得到查询的参数
    userTableInit.queryParams = function(params) {
        logPageSize = params.limit;
        var chkstr = chk_value.join(",");
        var temp = { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
             offset: params.offset, // nowpage
             limit: params.limit, // pagesize
             community:$("#community").val(),
             maxArea:$("#maxArea").val(),
             minArea:$("#minArea").val()
        };
        return temp;
    };
    return userTableInit;
};
function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), function(row) {
        console.log(row);
        return row.id;
    });
}

function responseHandler(res) {
    $.each(res.rows, function(i, row) {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
}
$("#addInfo").click(function() {
    $("input[name='community']").val("");
    $("input[name='location']").val("");
    $("input[name='owner']").val("");
    $("input[name='area']").val("");
    $("input[name='remark']").val("");
    $(".zxRange option:first").prop("selected", 'selected');
    $(".zxType option:first").prop("selected", 'selected');
    $("#modalAddorEditTitle").html("新增信息");
    $("#modal").modal("show");
});
function addOrEdit(){
    var modalTitle = $("#modalAddorEditTitle").html();
    var vasd = jQuery.form2json("myForm");
    console.log(vasd.data);
    ajaxRequest("POST", "/insert", function(ajaxRet) {
        if(ajaxRet.count == 1) {
            $("#modal").modal("hide");
            layer.alert(ajaxRet.data);
        }else{
            $("#tb_users").bootstrapTable('destroy');
            userTableInit.Init();
            $("#modal").modal("hide");
            layer.alert(ajaxRet.data);
        }
    },undefined ,vasd.data);
}
$("#delThis").click(function() {
    var idSelections = getIdSelections();
    console.log("getIdSelections:" + idSelections);
    var vasd ={};
    if(idSelections == ""){
        layer.msg('您尚未勾选，请勾选需要进行操作的数据', {
            icon : 2
        });
        return ;
    }else{
        vasd.data= "{\"ids\" :\" "+idSelections.toString() + "\"}";
    }
    console.log(vasd.data);
    layer.confirm('请是否确定删除所勾选的数据？', {
        icon: 7,
        title: '提示'
    }, function() {
        layer.closeAll('dialog');
        ajaxRequest("POST", "/delete", function(ajaxRet) {
            if(ajaxRet.count != 0) {
                layer.msg(ajaxRet.data, {
                    icon : 1
                });
                $("#tb_users").bootstrapTable('destroy');
                userTableInit.Init();
            }
        }, undefined ,vasd.data);
    });
});