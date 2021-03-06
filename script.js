

(function($) {
    $.fn.fixDiv = function(options) {
        var defaultVal = {
            top: 10
        };
        var obj = $.extend(defaultVal, options);
        // $.extend方法是我们在开发中经常用到的方法，用于合并若干个对象，且支持深度拷贝

        $this = this;
        var _top = $this.offset().top; // original top
        var _left = $this.offset().left;

        $(window).scroll(function() {
            var _currentTop = $this.offset().top;
            var _scrollTop = $(document).scrollTop();

            /**
             *  scrollTop() 方法返回或设置匹配元素的滚动条的垂直位置。
             *  scroll top offset 指的是滚动条相对于其顶部的偏移。
             *  如果该方法未设置参数，则返回以像素计的相对滚动条顶部的偏移。
             */

            if (_scrollTop > _top) {
                $this.offset({
                    top: _scrollTop + obj.top,
                    left: _left
                });
            } else {
                $this.offset({
                    top: _top,
                    left: _left
                });
            }
        });
        return $this;
    };
})(jQuery);

$(function() {
    $("#search_box").fixDiv({ top: 0 });
    $('#search_btn').click(highlight); // 点击search时，执行highlight函数；
    $('#searchstr').keydown(function(e) {
        var key = e.which;
        if (key == 13) highlight();

        /**
         *  完整的 key press 过程分为两个部分：1. 按键被按下；2. 按键被松开。
         *  当按钮被按下时，发生 keydown 事件。
         *  keydown() 方法触发 keydown 事件，或规定当发生 keydown 事件时运行的函数。
         *  注释：如果在文档元素上进行设置，则无论元素是否获得焦点，该事件都会发生。
         */

        /*http://www.cnblogs.com/zhangziqiu/archive/2009/05/06/jQuery-Learn-5.html*/
    })

    var i = 0;
    var sCurText;

    function highlight() {
        clearSelection(); //先清空一下上次高亮显示的内容；

        var flag = 0;
        var bStart = true;


        $('#tip').text('');
        $('#tip').hide();
        var searchText = $('#searchstr').val();
        var _searchTop = $('#searchstr').offset().top + 30;
        var _searchLeft = $('#searchstr').offset().left;

        if ($.trim(searchText) == "") {
            //alert(123);
            showTips("Please enter the content", _searchTop, 3, _searchLeft);
            return;
        }


        var searchText = $('#searchstr').val(); //获取你输入的关键字；
        var regExp = new RegExp(searchText, 'g'); //创建正则表达式，g表示全局的，如果不用g，则查找到第一个就不会继续向下查找了；

        var content = $("#content").text();
        if (!regExp.test(content)) {
            showTips("Nothing found", _searchTop, 3, _searchLeft);
            return;
        } else {
            if (sCurText != searchText) {
                i = 0;
                sCurText = searchText;
            }
        }

        $('p').each(function() {
            var html = $(this).html();
            var newHtml = html.replace(regExp, '<span class="highlight">' + searchText + '</span>'); //将找到的关键字替换，加上highlight属性；

            $(this).html(newHtml); //更新；
            flag = 1;
        });

        if (flag == 1) {
            if ($(".highlight").size() > 1) {
                var _top = $(".highlight").eq(i).offset().top + $(".highlight").eq(i).height();
                var _tip = $(".highlight").eq(i).parent().find("strong").text();
                if (_tip == "") _tip = $(".highlight").eq(i).parent().parent().find("strong").text();
                var _left = $(".highlight").eq(i).offset().left;
                var _tipWidth = $("#tip").width();
                if (_left > $(document).width() - _tipWidth) {
                    _left = _left - _tipWidth;
                }
                $("#tip").html(_tip).show();
                $("#tip").offset({ top: _top, left: _left });
                $("#search_btn").val("查找下一个");
            } else {
                var _top = $(".highlight").offset().top + $(".highlight").height();
                var _tip = $(".highlight").parent().find("strong").text();
                var _left = $(".highlight").offset().left;
                $('#tip').show();
                $("#tip").html(_tip).offset({ top: _top, left: _left });
            }
            $("html, body").animate({ scrollTop: _top - 50 });
            i++;
            if (i > $(".highlight").size() - 1) {
                i = 0;
            }
        }
    }

    function clearSelection() {
        $('p').each(function() {
            //找到所有highlight属性的元素；
            $(this).find('.highlight').each(function() {
                $(this).replaceWith($(this).html()); //将他们的属性去掉；
            });
        });
    }

    //mask
    var tipsDiv = '<div class="tipsClass"></div>';
    $('body').append(tipsDiv);

    function showTips(tips, height, time, left) {
        var windowWidth = document.documentElement.clientWidth;
        $('.tipsClass').text(tips);
        $('div.tipsClass').css({
            'top': height + 'px',
            'left': left + 'px',
            'position': 'absolute',
            'padding': '8px 6px',
            'background': '#000000',
            'font-size': 14 + 'px',
            'font-weight': 900,
            'margin': '0 auto',
            'text-align': 'center',
            'width': 'auto',
            'color': '#fff',
            'border-radius': '2px',
            'opacity': '0.8',
            'box-shadow': '0px 0px 10px #000',
            '-moz-box-shadow': '0px 0px 10px #000',
            '-webkit-box-shadow': '0px 0px 10px #000'
        }).show();
        setTimeout(function() { $('div.tipsClass').fadeOut(); }, (time * 1000));
    }
})